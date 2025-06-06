import { dirname } from 'path'
import * as vscode from 'vscode'
import { createEditorTheme, themeOptions, type Theme } from './create'
import { settings } from '../utils/config'
import { errorNotification } from '../utils/extension'
import { readFile, writeFile } from '../utils/file'
import { deepMerge } from '../utils/object'
import { mergeSyntaxTheme } from './syntax'
import * as materialColors from 'material-colors'
import { createSemanticColors } from './create'

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

  return content as Theme
}

export const saveTheme = async (uri: vscode.Uri, darkMode: boolean) => {
  const options = deepMerge(themeOptions, { darkMode, colors: { primary: settings().get<string>('primaryColor') } })
  const flatColors = materialColors.flatten(materialColors.generate(options))
  const theme = createEditorTheme(createSemanticColors(flatColors))

  const syntaxThemeName = settings().get<string>('syntaxTheme')
  if (syntaxThemeName) {
    const themes = getInstalledThemes()
    const syntaxThemeUri = themes[syntaxThemeName]
    if (syntaxThemeUri) await mergeSyntaxTheme(theme, (await readTheme(syntaxThemeUri)) as Theme)
    else return errorNotification(`Syntax theme "${syntaxThemeName}" not found.`)
  }

  await writeFile(uri, JSON.stringify(theme))
}
