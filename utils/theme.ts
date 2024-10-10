import { dirname } from 'path'
import * as vscode from 'vscode'
import { deepMerge } from './object'
import { readFile } from './file'

export const getInstalledThemes = () => {
  const result: Record<string, vscode.Uri> = {}
  vscode.extensions.all.forEach(extension => {
    const themes = extension.packageJSON.contributes?.themes
    if (!themes) return
    for (const theme of themes) {
      result[theme.label] = vscode.Uri.joinPath(vscode.Uri.file(extension.extensionPath), theme.path)
    }
  })
  return result
}

export const readTheme = async (uri: vscode.Uri, parent = {}) => {
  let content: Record<string, any> = {}

  try {
    content = JSON.parse(await readFile(uri))
  } catch {
    return parent
  }
  if (content.include) {
    const includeUri = vscode.Uri.joinPath(vscode.Uri.file(dirname(uri.path)), content.include)
    content = await readTheme(includeUri, content)
  }

  content = deepMerge(content, parent)

  return content
}
