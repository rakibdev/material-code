import injectCss from 'inline:./inject.css'
import injectJs from 'inline:./inject.js'

import vscode from 'vscode'
import sudo from '@vscode/sudo-prompt' // todo: dynamic import
import { createTheme } from './theme.js'
import { readFile, writeFile, errorNotification } from './utils.js'

// const isWeb = vscode.env.appHost != 'desktop'
const vscodeRoot = vscode.Uri.file(vscode.env.appRoot)
const workbenchFile = vscode.Uri.joinPath(vscodeRoot, 'out/vs/code/electron-sandbox/workbench/workbench.html')
let appDataDir = null
let packageJson = null

const appData = {
  content: {},
  async initialize() {
    try {
      const storageFile = vscode.Uri.joinPath(appDataDir, 'storage.json')
      await vscode.workspace.fs.stat(storageFile)
      appData.content = JSON.parse(await readFile(storageFile))
    } catch (error) {
      if (error.code == 'FileNotFound') await vscode.workspace.fs.createDirectory(appDataDir)
      else errorNotification(error.message)
    }
  },
  get(key) {
    return key ? appData.content[key] : appData.content
  },
  set(key, value) {
    appData.content[key] = value
    return writeFile(vscode.Uri.joinPath(appDataDir, 'storage.json'), JSON.stringify(appData.content))
  }
}

const settings = {
  get(key) {
    return vscode.workspace.getConfiguration('material-code')[key]
  }
}

const updateInstallationFiles = async workbenchHtml => {
  const onSuccess = () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow')
  }

  try {
    await writeFile(workbenchFile, workbenchHtml)
    onSuccess()
  } catch {
    const tempWorkbenchFile = vscode.Uri.joinPath(appDataDir, 'workbench.html')
    await writeFile(tempWorkbenchFile, workbenchHtml)
    const moveCommand = process.platform.includes('win') ? 'move' : 'mv'
    const command = `${moveCommand} "${tempWorkbenchFile.fsPath}" "${workbenchFile.fsPath}"`
    sudo.exec(command, { name: packageJson.displayName }, async error => {
      if (error) {
        await vscode.workspace.fs.delete(tempWorkbenchFile)
        errorNotification(
          /EPERM|EACCES|ENOENT/.test(error.code)
            ? 'Permission denied. Run editor as admin and try again.'
            : error.message
        )
      } else onSuccess()
    })
  }
}

const clearInjectedCode = workbenchHtml =>
  workbenchHtml.replace(/\n*?<!--material-code-->.*?<!--material-code-->\n*?/s, '\n\n')

const onRemoveStylesCommand = async () => {
  const html = await readFile(workbenchFile)
  updateInstallationFiles(clearInjectedCode(html))
}

const onApplyStylesCommand = async () => {
  const userCss = settings.get('customCSS')
  let html = await readFile(workbenchFile)
  html = clearInjectedCode(html)
    .replace(/<meta.*http-equiv="Content-Security-Policy".*?>/s, '')
    .replace(
      /\n*?<\/html>/,
      `\n\n<!--material-code-->\n<style>\n${
        injectCss + userCss
      }</style>\n<script>\n${injectJs}</script>\n<!--material-code-->\n\n</html>`
    )
  updateInstallationFiles(html)
}

const isNewVersion = (current, previous) => {
  current = current.split('.')
  previous = previous.split('.')
  for (let i = 0; i < current.length; i++) {
    if (parseInt(current[i]) > parseInt(previous[i])) return true
  }
}

module.exports.activate = async context => {
  appDataDir = context.globalStorageUri
  packageJson = context.extension.packageJSON
  await appData.initialize(context)

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', async () => {
      await appData.set('styles_enabled', true)
      onApplyStylesCommand()
    }),
    vscode.commands.registerCommand('material-code.removeStyles', async () => {
      await appData.set('styles_enabled', false)
      onRemoveStylesCommand()
    })
  ]
  commands.forEach(command => context.subscriptions.push(command))

  const version = appData.get().version
  if (version != packageJson.version) {
    appData.set('version', packageJson.version)
    if (version) {
      // if (isNewVersion(packageJson.version, version)) {
      //   vscode.window
      //     .showInformationMessage(
      //       `${packageJson.displayName} was updated to v${packageJson.version} from v${version}!`,
      //       'Open changelog'
      //     )
      //     .then(action => {
      //       if (action == 'Open changelog') {
      //         const releases = `${packageJson.repository.url}/releases`
      //         vscode.env.openExternal(vscode.Uri.parse(releases))
      //       }
      //     })
      // }
    } else {
      vscode.window
        .showInformationMessage(`${packageJson.displayName} installed! See README?`, 'Open', 'Cancel')
        .then(action => {
          if (action == 'Open') vscode.env.openExternal(vscode.Uri.parse(packageJson.repository.url))
        })
    }
  }

  const enabled = appData.get('styles_enabled')
  const html = await readFile(workbenchFile)
  const hasCode = html.includes('material-code')
  if (enabled && !hasCode) {
    vscode.window.showInformationMessage('Re-apply styles?', 'Ignore', 'Ok').then(action => {
      if (action == 'Ok') vscode.commands.executeCommand('material-code.applyStyles')
      if (action == 'Ignore') appData.set('styles_enabled', false)
    })
  }

  vscode.workspace.onDidChangeConfiguration(async event => {
    const primaryColorChanged = event.affectsConfiguration('material-code.primaryColor')
    const lightnessChanged = event.affectsConfiguration('material-code.lightness')
    if (primaryColorChanged || lightnessChanged) {
      const options = { primary: settings.get('primaryColor') }
      if (lightnessChanged) options.lightness = settings.get('lightness')
      await createTheme(context.extensionPath + '/themes/dark.json', options)
      vscode.window.showInformationMessage('Theme updated. Reload window to see changes.', 'Reload').then(action => {
        if (action == 'Reload') vscode.commands.executeCommand('workbench.action.reloadWindow')
      })
    }
  })

  if (process.env.DEV) createTheme(context.extensionPath + '/themes/dark.json')
}

module.exports.deactivate = () => {}
