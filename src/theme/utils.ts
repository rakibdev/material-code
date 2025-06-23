import { dirname } from 'path'
import * as vscode from 'vscode'
import { createVsCodeTheme, themeOptions, type VsCodeTheme } from './create'
import { settings } from '../utils/config'
import { errorNotification } from '../utils/extension'
import { readFile, writeFile } from '../utils/file'
import { deepMerge } from '../utils/object'
import { mergeSyntaxTheme } from './syntax'
import { createTheme } from './create'

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
    let jsonString = await readFile(uri)

    jsonString = jsonString
      // Remove comments, except URLs in strings (e.g. "$schema": "vscode://schemas/color-theme")
      .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => (g ? '' : m))
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, '$1')

    content = JSON.parse(jsonString)
  } catch (error: any) {
    errorNotification(error.message)
    return parent
  }
  if (content.include) {
    const includeUri = vscode.Uri.joinPath(vscode.Uri.file(dirname(uri.path)), content.include)
    content = await readTheme(includeUri, content)
  }

  content = deepMerge(content, parent)

  return content as VsCodeTheme
}

export const saveTheme = async (uri: vscode.Uri, darkMode: boolean) => {
  const options = deepMerge(themeOptions, {
    darkMode,
    primary: settings().get<string>('primaryColor') || themeOptions.primary
  })

  const theme = createVsCodeTheme(createTheme(options))

  const syntaxThemeName = settings().get<string>('syntaxTheme')
  if (syntaxThemeName) {
    const themes = getInstalledThemes()
    const syntaxThemeUri = themes[syntaxThemeName]
    if (syntaxThemeUri) await mergeSyntaxTheme(theme, (await readTheme(syntaxThemeUri)) as VsCodeTheme)
    else return errorNotification(`Syntax theme "${syntaxThemeName}" not found.`)
  }

  await writeFile(uri, JSON.stringify(theme))
}
