import { dirname } from 'path'
import * as vscode from 'vscode'
import { createVsCodeTheme, themeOptions, type VsCodeTheme } from './create'
import { settings } from '../utils/config'
import { errorNotification } from '../utils/extension'
import { readFile, writeFile } from '../utils/file'
import { mergeSyntaxTheme } from './syntax'
import { createTheme } from './create'

export const getInstalledThemes = () => {
  const result: Record<string, { uri: vscode.Uri; uiTheme: string }> = {}
  vscode.extensions.all.forEach(extension => {
    const themes = extension.packageJSON.contributes?.themes
    if (!themes) return
    for (const theme of themes) {
      result[theme.label] = {
        uri: vscode.Uri.joinPath(vscode.Uri.file(extension.extensionPath), theme.path),
        uiTheme: theme.uiTheme
      }
    }
  })
  return result
}

export const mergeTheme = (target: any, source: any) => {
  const sourceCopy = { ...source }

  // If both target and source have tokenColors, merge them
  if (Array.isArray(target?.tokenColors) && Array.isArray(source?.tokenColors)) {
    sourceCopy.tokenColors = [...target.tokenColors, ...source.tokenColors]
  }

  if (target?.colors && source?.colors) {
    sourceCopy.colors = { ...target.colors, ...source.colors }
  }

  if (target?.semanticTokenColors && source?.semanticTokenColors) {
    sourceCopy.semanticTokenColors = { ...target.semanticTokenColors, ...source.semanticTokenColors }
  }

  return { ...target, ...sourceCopy }
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
    const includedContent = await readTheme(includeUri)
    // Included first (lowest priority)
    content = mergeTheme(includedContent, content)
  }

  content = mergeTheme(content, parent)

  return content as VsCodeTheme
}

export const saveTheme = async (uri: vscode.Uri, darkMode: boolean) => {
  const options = {
    ...themeOptions,
    darkMode,
    primary: settings().get<string>('primaryColor') || themeOptions.primary
  }

  const theme = createVsCodeTheme(createTheme(options))

  const name = settings().get<string>(darkMode ? 'syntaxTheme' : 'lightSyntaxTheme')
  if (name) {
    const themes = getInstalledThemes()
    const sourceUri = themes[name]?.uri
    if (sourceUri) {
      const source = (await readTheme(sourceUri)) as VsCodeTheme
      await mergeSyntaxTheme(theme, source)
    } else return errorNotification(`Syntax theme "${name}" not found.`)
  }

  await writeFile(uri, JSON.stringify(theme))
}
