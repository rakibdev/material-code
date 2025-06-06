import vscode from 'vscode'
import { extensionUri } from './config'

const arrayFromString = (value: string) => {
  return new TextEncoder().encode(value)
}

const stringFromArray = (value: Uint8Array) => {
  return new TextDecoder().decode(value)
}

export const writeFile = (uri: vscode.Uri, content: string) => {
  return vscode.workspace.fs.writeFile(uri, arrayFromString(content))
}

export const readFile = async (uri: vscode.Uri) => {
  return stringFromArray(await vscode.workspace.fs.readFile(uri))
}

export const normalizeInjectPath = (path: string) => {
  path = path.replaceAll('${extensionDir}', extensionUri.fsPath)

  let uri: vscode.Uri = vscode.Uri.file(path)

  if (path[0] == '~') {
    const home = process.env.HOME || process.env.USERPROFILE
    uri = vscode.Uri.joinPath(vscode.Uri.file(home), path.substring(1))
  }

  return uri
}
