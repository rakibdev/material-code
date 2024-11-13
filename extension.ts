import * as materialColors from 'material-colors'
import vscode from 'vscode'
import { createVsCodeTheme, themeOptions, type Theme } from './theme/theme'
import { AppData } from './utils/appdata'
import { buildDir, extensionUri, packageJson, settings } from './utils/config'
import { errorNotification } from './utils/extension'
import { normalizeLocalInjectPath, readFile, writeFile } from './utils/file'
import { deepMerge } from './utils/object'
import { getInstalledThemes, readTheme } from './utils/theme'

// todo: Improve markdown highlighting.
// const isWeb = vscode.env.appHost != 'desktop'

let appData: AppData

let workbenchFile: vscode.Uri

const vscodeRoot = vscode.Uri.file(vscode.env.appRoot)
;[
  'out/vs/code/electron-sandbox/workbench/workbench.esm.html', // Above 1.94.0
  'out/vs/code/electron-sandbox/workbench/workbench.html'
].forEach(async file => {
  try {
    const uri = vscode.Uri.joinPath(vscodeRoot, file)
    await vscode.workspace.fs.stat(uri)
    workbenchFile = uri
  } catch {}
})

const saveWorkbench = async (workbenchHtml: string) => {
  const onSuccess = () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow')
  }

  try {
    await writeFile(workbenchFile, workbenchHtml)
    onSuccess()
  } catch {
    const tempFile = vscode.Uri.joinPath(appData.dir, 'workbench.html')
    await writeFile(tempFile, workbenchHtml)
    const moveCommand = process.platform.includes('win') ? 'move' : 'mv'
    const command = `${moveCommand} "${tempFile.fsPath}" "${workbenchFile.fsPath}"`

    const sudo = await import('@vscode/sudo-prompt')
    sudo.exec(command, { name: packageJson.displayName }, async (error: any) => {
      if (error) {
        await vscode.workspace.fs.delete(tempFile)
        errorNotification(
          /EPERM|EACCES|ENOENT/.test(error.code)
            ? 'Permission denied. Run editor as admin and try again.'
            : error.message
        )
      } else onSuccess()
    })
  }
}

const clearInjection = (workbenchHtml: string) =>
  workbenchHtml.replace(/\n*?<!--material-code-->.*?<!--material-code-->\n*?/s, '\n\n')

const onCommandRemoveStyles = async () => {
  const html = await readFile(workbenchFile)
  saveWorkbench(clearInjection(html))
}

const toInlineCode = (code: string) => {
  if (/^<[^>]+>/.test(code)) return code
  const isCss = /\{[^}]+:[^}]+\}/.test(code)
  return `<${isCss ? 'style' : 'script'}>${code}</${isCss ? 'style' : 'script'}>`
}

const onCommandApplyStyles = async () => {
  const inject = settings().get<string[]>('inject', [])
  let code = ''

  for (const line of inject) {
    const isFile = line.endsWith('.css') || line.endsWith('.js')
    if (isFile) {
      try {
        if (line.startsWith('https://')) {
          vscode.window.showInformationMessage('Fetching ' + line)
          const response = await fetch(line)
          if (response.ok) {
            code += toInlineCode(await response.text())
          } else throw new Error(response.statusText)
        } else {
          const uri = normalizeLocalInjectPath(line)
          await vscode.workspace.fs.stat(uri)
          if (uri.fsPath.startsWith(extensionUri.fsPath)) {
            const withSchema = uri.with({ scheme: 'vscode-file', authority: 'vscode-app' })
            code += line.endsWith('.css')
              ? `\n<link rel="stylesheet" href="${withSchema.toString()}">\n`
              : `\n<script src="${withSchema.toString()}"></script>\n`
          } else {
            // External `src`, `href` is blocked by CORS.
            code += toInlineCode(await readFile(uri))
          }
        }
      } catch (error: any) {
        errorNotification(`${line}: ${error.message}`)
      }
    } else code += toInlineCode(line)
  }

  let html = await readFile(workbenchFile)
  html = clearInjection(html)
    .replace(/<meta.*http-equiv="Content-Security-Policy".*?>/s, '')
    .replace(/\n*?<\/html>/, `\n\n<!--material-code-->${code}<!--material-code-->\n\n</html>`)
  saveWorkbench(html)
}

const mergeSyntaxTheme = async (theme: Theme, syntaxThemeUri: vscode.Uri) => {
  const syntaxTheme = (await readTheme(syntaxThemeUri)) as Theme
  theme.tokenColors = syntaxTheme.tokenColors
  theme.semanticTokenColors = syntaxTheme.semanticTokenColors
  for (const key of Object.keys(theme.colors) as Array<keyof Theme['colors']>) {
    if (key.startsWith('editorBracket')) theme.colors[key] = syntaxTheme.colors?.[key]
  }
}

const saveTheme = async (themeUri: vscode.Uri, darkMode: boolean) => {
  const options = deepMerge(themeOptions, { darkMode, colors: { primary: settings().get<string>('primaryColor') } })
  const theme = createVsCodeTheme(materialColors.flatten(materialColors.generate(options)))

  const syntaxThemeName = settings().get<string>('syntaxTheme')
  if (syntaxThemeName) {
    const themes = getInstalledThemes()
    const syntaxThemeUri = themes[syntaxThemeName]
    // todo: Adjust syntax colors for light theme.
    if (syntaxThemeUri) await mergeSyntaxTheme(theme, syntaxThemeUri)
    else return errorNotification(`Syntax theme "${syntaxThemeName}" not found.`)
  }

  await writeFile(themeUri, JSON.stringify(theme))
}

export const activate = async (context: vscode.ExtensionContext) => {
  appData = new AppData(context)
  await appData.initialize()

  const updateThemeVariants = async () => {
    await saveTheme(vscode.Uri.joinPath(buildDir, 'dark.json'), true)
    await saveTheme(vscode.Uri.joinPath(buildDir, 'light.json'), false)
  }

  const version = appData.get().version
  if (version != packageJson.version) {
    appData.set('version', packageJson.version)
    updateThemeVariants()

    if (!version) {
      vscode.window
        .showInformationMessage(`${packageJson.displayName} installed!`, 'Open README', 'Cancel')
        .then(action => {
          if (action == 'Open README') vscode.env.openExternal(vscode.Uri.parse(packageJson.repository.url))
        })
    }
  }

  vscode.workspace.onDidChangeConfiguration(event => {
    if (
      event.affectsConfiguration('material-code.primaryColor') ||
      event.affectsConfiguration('material-code.syntaxTheme')
    ) {
      updateThemeVariants()
    }
  })

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', onCommandApplyStyles),
    vscode.commands.registerCommand('material-code.removeStyles', onCommandRemoveStyles)
  ]
  commands.forEach(command => context.subscriptions.push(command))
}
