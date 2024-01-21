import vscode from 'vscode'
import os from 'os'

const stringFromArray = value => {
  return new TextDecoder().decode(value)
}

const arrayFromString = value => {
  return new TextEncoder().encode(value)
}

export const writeFile = (uri, content) => {
  return vscode.workspace.fs.writeFile(uri, arrayFromString(content))
}

export const readFile = async uri => {
  return stringFromArray(await vscode.workspace.fs.readFile(uri))
}

export const errorNotification = message => {
  vscode.window.showErrorMessage(message, 'Report on GitHub').then(async action => {
    if (action == 'Report on GitHub') {
      const body = `**OS:** ${os.platform()} ${os.release()}\n**Visual Studio Code:** ${
        vscode.version
      }\n**Error:** \`${message}\``
      vscode.env.openExternal(
        vscode.Uri.parse(packageJson.repository.url + `/issues/new?body=${encodeURIComponent(body)}`)
      )
    }
  })
}
