import vscode from 'vscode'
import { packageJson } from './config'

export const errorNotification = (message: string) => {
  const button = 'Report on GitHub'
  vscode.window.showErrorMessage(message, button).then(async action => {
    if (action == button) {
      const body = `**OS:** ${process.platform}\n**Visual Studio Code:** ${vscode.version}\n**Error:** \`${message}\``
      vscode.env.openExternal(
        vscode.Uri.parse(packageJson.repository.url + `/issues/new?body=${encodeURIComponent(body)}`)
      )
    }
  })
}
