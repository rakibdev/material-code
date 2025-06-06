import vscode from 'vscode'
import { AppData } from './utils/appdata'
import { buildDir, packageJson } from './utils/config'
import * as inject from './inject'
import { openSyntaxThemePicker } from './theme/syntax'
import { saveTheme } from './theme/utils'

// todo: Improve markdown highlighting.
// const isWeb = vscode.env.appHost != 'desktop'

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

  vscode.workspace.onDidChangeConfiguration(event => {
    if (
      event.affectsConfiguration('material-code.primaryColor') ||
      event.affectsConfiguration('material-code.syntaxTheme')
    ) {
      updateThemes()
    }
  })

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', inject.applyStyles),
    vscode.commands.registerCommand('material-code.removeStyles', inject.removeStyles),
    vscode.commands.registerCommand('material-code.selectSyntaxTheme', openSyntaxThemePicker)
  ]
  commands.forEach(command => context.subscriptions.push(command))
}
