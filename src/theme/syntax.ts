import vscode from 'vscode'
import { packageJson, settings } from '../utils/config'
import { getInstalledThemes, readTheme } from './utils'
import { type VsCodeTheme } from './create'

export const openSyntaxThemePicker = async () => {
  const themes = getInstalledThemes()
  const current = settings().get<string>('syntaxTheme') || packageJson.displayName

  const icon = `$(symbol-color)`
  const quickPick = vscode.window.createQuickPick()
  quickPick.items = [
    ...Object.entries(themes)
      .filter(([, t]) => (settingKey == 'syntaxTheme' ? t.uiTheme != 'vs' : t.uiTheme == 'vs'))
      .map(([name]) => name)
      .sort((item, item2) => {
        if (item == current) return -1
        if (item2 == current) return 1
        return item.localeCompare(item2)
      })
      .map(name => ({
        label: `${icon} ${name}`,
        description: name == current ? '(current)' : undefined
      }))
  ]
  quickPick.matchOnDescription = true

  quickPick.onDidChangeSelection(async ([item]) => {
    if (!item) return
    const selected = item.label.replace(icon, '').trim()
    const isDefault = selected.startsWith(packageJson.displayName)
    await settings().update('syntaxTheme', isDefault ? undefined : selected, vscode.ConfigurationTarget.Global)
    quickPick.hide()
  })

  quickPick.onDidHide(() => quickPick.dispose())
  quickPick.show()
}

export const mergeSyntaxTheme = async (target: VsCodeTheme, source: VsCodeTheme) => {
  target.tokenColors = source.tokenColors
  target.semanticTokenColors = source.semanticTokenColors
  target.semanticHighlighting = source.semanticHighlighting
  for (const key of Object.keys(target.colors) as Array<keyof VsCodeTheme['colors']>) {
    if (key.startsWith('editorBracket')) target.colors[key] = source.colors?.[key]
  }
}
