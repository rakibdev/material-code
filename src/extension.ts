import vscode from 'vscode'
import { AppData } from './utils/appdata'
import { buildDir, packageJson } from './utils/config'
import * as inject from './inject'
import { openSyntaxThemePicker } from './theme/syntax'
import { saveTheme } from './theme/utils'
import { createHash } from 'crypto'

// todo: Improve markdown highlighting.
// const isWeb = vscode.env.appHost != 'desktop'

const getSettingsHash = () => {
  const config = vscode.workspace.getConfiguration('material-code')
  const relevant = {
    colors: config.get('colors'),
    primaryColor: config.get('primaryColor'),
    syntaxTheme: config.get('syntaxTheme'),
    syntaxThemeLight: config.get('syntaxThemeLight')
  }
  return createHash('md5').update(JSON.stringify(relevant)).digest('hex')
}

const updateThemes = async () => {
  await saveTheme(vscode.Uri.joinPath(buildDir, 'dark.json'), true)
  await saveTheme(vscode.Uri.joinPath(buildDir, 'light.json'), false)
}

export const activate = async (context: vscode.ExtensionContext) => {
  const appData = new AppData(context)
  await appData.initialize()

  inject.init(appData.dir)

  const version = appData.get().version
  if (version != packageJson.version) {
    appData.set('version', packageJson.version)
    updateThemes()

    if (!version) {
      vscode.window
        .showInformationMessage(`${packageJson.displayName} installed!`, 'Open README', 'Cancel')
        .then(action => {
          if (action == 'Open README') vscode.env.openExternal(vscode.Uri.parse(packageJson.repository.url))
        })
    }
  }

  // Apply themes on startup only if settings changed since last launch
  const currentHash = getSettingsHash()
  if (currentHash !== appData.get().settingsHash) {
    appData.set('settingsHash', currentHash)
    updateThemes() // no await so it doesn't delay the extension activation
  }

  vscode.workspace.onDidChangeConfiguration(event => {
    if (
      event.affectsConfiguration('material-code.colors') ||
      event.affectsConfiguration('material-code.primaryColor') ||
      event.affectsConfiguration('material-code.syntaxTheme') ||
      event.affectsConfiguration('material-code.syntaxThemeLight')
    ) {
      updateThemes()
    }
  })

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', inject.applyStyles),
    vscode.commands.registerCommand('material-code.removeStyles', inject.removeStyles),
    vscode.commands.registerCommand('material-code.selectDarkSyntaxTheme', () => openSyntaxThemePicker('syntaxTheme')),
    vscode.commands.registerCommand('material-code.selectLightSyntaxTheme', () =>
      openSyntaxThemePicker('syntaxThemeLight')
    )
  ]
  commands.forEach(command => context.subscriptions.push(command))
}
