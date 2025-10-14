import vscode from 'vscode'
import { extensionUri, packageJson, settings } from './utils/config'
import { errorNotification } from './utils/extension'
import { normalizeInjectPath, readFile, writeFile } from './utils/file'

let appDataDir: vscode.Uri
let workbenchFile: vscode.Uri

export const init = async (dir: vscode.Uri) => {
  appDataDir = dir

  const vscodeRoot = vscode.Uri.file(vscode.env.appRoot)
  const files = [
    'out/vs/code/electron-browser/workbench/workbench.html', // Above v1.105.0
    'out/vs/code/electron-sandbox/workbench/workbench.esm.html', // Above v1.94.0
    'out/vs/code/electron-sandbox/workbench/workbench.html'
  ]

  for (const file of files) {
    try {
      const uri = vscode.Uri.joinPath(vscodeRoot, file)
      await vscode.workspace.fs.stat(uri)
      workbenchFile = uri
      return
    } catch {}
  }

  errorNotification('workbench.html not found')
}

export const updateWorkbenchFile = async (workbenchHtml: string) => {
  const onSuccess = () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow')
  }

  try {
    await writeFile(workbenchFile, workbenchHtml)
    onSuccess()
  } catch {
    const tempFile = vscode.Uri.joinPath(appDataDir, 'workbench.html')
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

export const clearInjection = (workbenchHtml: string) =>
  workbenchHtml.replace(/\n*?<!--material-code-->.*?<!--material-code-->\n*?/s, '\n\n')

const htmlWrapCode = (code: string) => {
  if (/^<[^>]+>/.test(code)) return code
  const isCss = /\{[^}]+:[^}]+\}/.test(code)
  return `<${isCss ? 'style' : 'script'}>${code}</${isCss ? 'style' : 'script'}>`
}

export const applyStyles = async () => {
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
            code += htmlWrapCode(await response.text())
          } else throw new Error(response.statusText)
        } else {
          const uri = normalizeInjectPath(line)
          await vscode.workspace.fs.stat(uri)
          if (uri.fsPath.startsWith(extensionUri.fsPath)) {
            const withSchema = uri.with({ scheme: 'vscode-file', authority: 'vscode-app' })
            code += line.endsWith('.css')
              ? `\n<link rel="stylesheet" href="${withSchema.toString()}">\n`
              : `\n<script src="${withSchema.toString()}"></script>\n`
          } else {
            // External `src`, `href` is blocked by CORS.
            code += htmlWrapCode(await readFile(uri))
          }
        }
      } catch (error: any) {
        errorNotification(`${line}: ${error.message}`)
      }
    } else code += htmlWrapCode(line)
  }

  let html = await readFile(workbenchFile)
  html = clearInjection(html)
    .replace(/<meta.*http-equiv="Content-Security-Policy".*?>/s, '')
    .replace(/\n*?<\/html>/, `\n\n<!--material-code-->${code}<!--material-code-->\n\n</html>`)
  updateWorkbenchFile(html)
}

export const removeStyles = async () => {
  const html = await readFile(workbenchFile)
  updateWorkbenchFile(clearInjection(html))
}
