import { promises as fs } from 'fs'
import { Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities'

const createTheme = (name, brightness, colorfulness = 16) => {
  const hexTone = (hct, tone) => hexFromArgb(Hct.from(hct.hue, hct.chroma, tone + brightness).toInt())

  const primary = Hct.fromInt(argbFromHex('#00adff'))
  const red = Hct.fromInt(argbFromHex('#ff002b'))
  const green = Hct.fromInt(argbFromHex('#00ffac'))
  const pink = Hct.fromInt(argbFromHex('#ff00bb'))
  const yellow = Hct.fromInt(argbFromHex('#fff700'))
  const neutral = Hct.from(primary.hue, colorfulness, primary.tone)
  const surface = Hct.from(neutral.hue, neutral.chroma + 4, neutral.tone)

  const colors = {
    neutral: hexTone(neutral, 60),
    foreground: hexTone(neutral, 80),
    background: hexTone(neutral, 8),
    surface: hexTone(surface, 15),
    surface2: hexTone(surface, 18),
    primary: hexTone(primary, 60),
    red: hexTone(red, 60),
    green: hexTone(green, 70),
    pink: hexTone(pink, 60),
    yellow: hexTone(yellow, 70),
    transparent: '#ffffff00'
  }

  const theme = {
    name,
    type: 'dark',
    colors: {
      foreground: colors.foreground,
      'icon.foreground': colors.foreground,
      errorForeground: colors.red,
      focusBorder: colors.transparent,
      'selection.background': colors.primary + 60,
      'widget.shadow': colors.transparent,
      'sash.hoverBorder': colors.transparent,

      'button.background': hexTone(primary, 70),
      'button.foreground': hexTone(primary, 10),
      'button.secondaryForeground': hexTone(primary, 70),
      'button.secondaryBackground': colors.transparent,

      'checkbox.background': colors.transparent,
      'checkbox.foreground': colors.primary,
      'checkbox.border': colors.primary,

      'dropdown.background': colors.surface,

      'input.background': colors.surface,
      'input.placeholderForeground': colors.neutral,
      'inputOption.activeBackground': hexTone(primary, 70),
      'inputOption.activeForeground': hexTone(primary, 10),
      'inputValidation.errorForeground': hexTone(red, 10),
      'inputValidation.errorBorder': colors.transparent,

      'inputValidation.errorBackground': colors.red,

      'scrollbar.shadow': colors.transparent,
      'scrollbarSlider.background': colors.surface2,
      'scrollbarSlider.hoverBackground': colors.surface2,
      'scrollbarSlider.activeBackground': colors.surface2,

      'badge.background': hexTone(primary, 70),
      'badge.foreground': hexTone(primary, 10),

      'list.hoverBackground': colors.surface2,
      'list.activeSelectionBackground': colors.surface2,
      'list.inactiveSelectionBackground': colors.surface,
      'list.dropBackground': colors.primary + 60,
      'list.highlightForeground': colors.primary,
      'listFilterWidget.background': colors.surface2,

      'activityBar.background': colors.background,
      'activityBar.foreground': colors.foreground,
      'activityBar.activeBorder': colors.transparent,
      'activityBar.activeBackground': colors.surface,

      'sideBar.background': colors.background,
      'sideBar.foreground': colors.foreground,
      'sideBar.border': colors.transparent,
      'sideBarSectionHeader.background': colors.transparent,

      'editorGroup.dropBackground': colors.primary + 60,
      'editorGroup.border': colors.surface2,
      'editorGroupHeader.tabsBackground': colors.background,

      'tab.activeBackground': colors.surface,
      'tab.activeForeground': colors.foreground,
      'tab.hoverBackground': colors.surface2,
      'tab.inactiveBackground': colors.background,
      'tab.inactiveForeground': colors.neutral,
      'tab.border': colors.transparent,

      'panel.background': colors.surface,
      'panel.border': colors.transparent,
      'panel.dropBorder': colors.primary,
      'panelTitle.activeForeground': colors.foreground,
      'panelTitle.activeBorder': colors.foreground,
      'panelTitle.inactiveForeground': colors.neutral,

      'debugToolBar.background': colors.surface,

      'editorGutter.foldingControlForeground': colors.neutral,

      'diffEditor.insertedTextBackground': colors.primary + 20,
      'diffEditor.removedTextBackground': colors.red + 20,

      'editorRuler.foreground': colors.surface,
      'editorWhitespace.foreground': colors.neutral,

      'editorHoverWidget.background': colors.surface,
      'editorHoverWidget.border': colors.transparent,

      'editorOverviewRuler.border': colors.transparent,
      'editorOverviewRuler.errorForeground': colors.red,
      'editorOverviewRuler.findMatchForeground': colors.primary,
      'editorOverviewRuler.infoForeground': colors.green,
      'editorOverviewRuler.warningForeground': colors.yellow,

      'extensionButton.prominentBackground': colors.primary,
      'extensionButton.prominentForeground': colors.foreground,
      'extensionButton.prominentHoverBackground': colors.primary,
      'extensionBadge.remoteForeground': colors.foreground,

      'menubar.selectionBackground': colors.surface,
      'menu.background': colors.surface,
      'menu.foreground': colors.foreground,
      'menu.selectionBackground': colors.surface2,
      'menu.separatorBackground': colors.transparent,

      'pickerGroup.border': colors.transparent,

      'keybindingLabel.background': colors.surface2,
      'keybindingLabel.foreground': colors.foreground,
      'keybindingLabel.border': colors.transparent,
      'keybindingLabel.bottomBorder': colors.transparent,

      'titleBar.activeBackground': colors.background,
      'titleBar.activeForeground': colors.foreground,
      'titleBar.inactiveBackground': colors.background,
      'titleBar.inactiveForeground': colors.foreground,

      'statusBar.background': colors.background,
      'statusBar.foreground': colors.foreground,
      'statusBar.border': colors.transparent,
      'statusBar.noFolderBackground': colors.background,
      'statusBarItem.hoverBackground': colors.surface,
      'statusBarItem.activeBackground': colors.surface,
      'statusBarItem.remoteBackground': colors.background,
      'statusBarItem.remoteForeground': colors.foreground,

      'editor.background': colors.background,
      'editor.foreground': colors.foreground,
      'editorCursor.foreground': colors.foreground,
      'editor.lineHighlightBackground': colors.surface,
      'editor.selectionBackground': colors.primary + 60,
      'editor.wordHighlightBackground': colors.primary + 40,
      'editor.findMatchBackground': colors.primary + 60,
      'editor.findMatchHighlightBackground': colors.primary + 40,

      'editorBracketMatch.background': colors.primary + 60,
      'editorBracketMatch.border': colors.transparent,
      'editorBracketHighlight.foreground1': colors.pink,
      'editorBracketHighlight.foreground2': colors.yellow,
      'editorBracketHighlight.foreground3': colors.red,
      'editorBracketHighlight.foreground4': colors.green,
      'editorBracketPairGuide.activeBackground1': hexTone(pink, 30),
      'editorBracketPairGuide.activeBackground2': hexTone(yellow, 30),
      'editorBracketPairGuide.activeBackground3': hexTone(red, 30),
      'editorBracketPairGuide.activeBackground4': hexTone(green, 30),

      'editorIndentGuide.activeBackground': colors.surface,
      'editorIndentGuide.background': colors.transparent,
      'editorInfo.foreground': colors.foreground,
      'editorError.foreground': '#ff619e',
      'editorWarning.foreground': colors.yellow,
      'editorLink.activeForeground': colors.foreground,

      'editorLineNumber.foreground': colors.surface2,
      'editorLineNumber.activeForeground': colors.neutral,

      'editorWidget.background': colors.surface,
      'editorWidget.border': colors.transparent,
      'editorSuggestWidget.selectedBackground': colors.surface2,

      'peekView.border': colors.primary,
      'peekViewEditor.background': colors.surface,
      'peekViewResult.background': colors.surface2,
      'peekViewTitleLabel.foreground': colors.primary,
      'peekViewTitleDescription.foreground': colors.foreground,
      'peekViewEditor.matchHighlightBackground': colors.primary + 40,
      'peekViewResult.matchHighlightBackground': colors.primary + 40,
      'peekViewResult.selectionBackground': hexTone(primary, 70),
      'peekViewResult.selectionForeground': hexTone(primary, 10),
      'peekViewResult.lineForeground': colors.foreground,

      'notificationCenterHeader.background': colors.surface2,
      'notifications.background': colors.surface2,

      'settings.headerForeground': colors.primary,
      'settings.focusedRowBackground': colors.transparent,
      'settings.focusedRowBorder': colors.transparent,
      'settings.modifiedItemIndicator': colors.primary,

      'textLink.foreground': colors.primary,

      'progressBar.background': colors.primary,
      'tree.indentGuidesStroke': colors.surface,

      'terminalCursor.foreground': colors.foreground,
      'terminal.ansiBrightBlue': colors.primary,
      'terminal.ansiBrightGreen': colors.green,
      'terminal.ansiBrightRed': colors.red,
      'terminal.ansiBrightYellow': colors.yellow,

      'breadcrumb.foreground': colors.neutral,
      'breadcrumb.focusForeground': colors.foreground,
      'breadcrumb.activeSelectionForeground': colors.foreground,
      'breadcrumbPicker.background': colors.surface
    },
    tokenColors: [
      {
        scope: [
          '',
          'punctuation',
          'keyword',
          'keyword.other.unit',
          'constant.other',
          'support.constant',

          'comment',
          'punctuation.definition.comment'
        ],
        settings: {
          foreground: colors.neutral
        }
      },
      {
        scope: ['string', 'punctuation.definition.string'],
        settings: {
          foreground: colors.green
        }
      },
      {
        scope: [
          'storage.type',
          'storage.modifier',
          'keyword.control',
          'punctuation.definition.keyword',
          'punctuation.definition.template-expression',
          'keyword.operator.new.js',
          'keyword.operator.expression.typeof.js',
          'keyword.operator.expression.instanceof.js',
          'keyword.operator.expression.import.js',
          'string.other'
        ],
        settings: {
          foreground: colors.pink
        }
      },
      {
        scope: [
          'variable',
          'meta.objectliteral.js',
          'entity.name.tag',
          'punctuation.definition.tag',
          'meta.block.open.vue',
          'meta.block.close.vue',
          'punctuation.definition.block.open.begin.vue',
          'punctuation.definition.block.open.end.vue',
          'punctuation.definition.block.close.begin.vue',
          'punctuation.definition.block.close.end.vue'
        ],
        settings: {
          foreground: colors.primary
        }
      },
      {
        scope: [
          'entity.other.attribute-name',
          'punctuation.definition.entity.css',
          'punctuation.separator.key-value.html',
          'meta.tag.block.any.html',
          'punctuation.separater.key-value.vue-html',
          'punctuation.definition.directive.prefix.vue-html',
          'keyword.operator.slot-shorthand.vue-html',
          'keyword.operator.binding-shorthand.vue-html',
          'entity.name.directive.vue-html',
          'variable.other.directive.argument.vue-html',
          'variable.other.directive.modifier.vue-html',
          'keyword.operator.event-handler-shorthand.vue-html'
        ],
        settings: {
          foreground: hexTone(primary, 70)
        }
      },
      {
        scope: [
          'variable.other.object.property',
          'variable.other.constant.property',
          'support.variable',
          'support.function',
          'support.type',
          'entity.name.function',
          'keyword.other'
        ],
        settings: {
          foreground: colors.red
        }
      },
      {
        scope: ['constant', 'support.constant', 'support.class', 'entity.name.type', 'keyword.other.unit'],
        settings: {
          foreground: colors.yellow
        }
      }
    ]
  }

  return theme
}

fs.writeFile('themes/dark.json', JSON.stringify(createTheme('Material Code', -2)))
fs.writeFile('themes/darker.json', JSON.stringify(createTheme('Material Code Darker', -6)))

// todo
// {
//   "$schema": "vscode://schemas/color-theme",
//   "name": "Default Dark Modern",
//   "include": "./dark_plus.json",
//   "colors": {
//     "activityBar.activeBorder": "#0078d4",
//     "activityBar.background": "#181818",
//     "activityBar.border": "#ffffff15",
//     "activityBar.foreground": "#d7d7d7",
//     "activityBar.inactiveForeground": "#ffffff80",
//     "activityBarBadge.background": "#0078d4",
//     "activityBarBadge.foreground": "#ffffff",
//     "badge.background": "#0078d4",
//     "badge.foreground": "#ffffff",
//     "button.background": "#0078d4",
//     "button.border": "#ffffff12",
//     "button.foreground": "#ffffff",
//     "button.hoverBackground": "#0078d4e6",
//     "button.secondaryBackground": "#FFFFFF0F",
//     "button.secondaryForeground": "#cccccc",
//     "button.secondaryHoverBackground": "#ffffff15",
//     "checkbox.background": "#313131",
//     "checkbox.border": "#ffffff1f",
//     "debugToolBar.background": "#181818",
//     "descriptionForeground": "#8b949e",
//     "diffEditor.insertedLineBackground": "#23863633",
//     "diffEditor.insertedTextBackground": "#2386364d",
//     "diffEditor.removedLineBackground": "#da363333",
//     "diffEditor.removedTextBackground": "#da36334d",
//     "dropdown.background": "#313131",
//     "dropdown.border": "#ffffff1f",
//     "dropdown.foreground": "#cccccc",
//     "dropdown.listBackground": "#1f1f1f",
//     "editor.background": "#1f1f1f",
//     "editor.findMatchBackground": "#9e6a03",
//     "editor.foreground": "#cccccc",
//     "editorGroup.border": "#ffffff17",
//     "editorGroupHeader.tabsBackground": "#181818",
//     "editorGroupHeader.tabsBorder": "#ffffff15",
//     "editorGutter.addedBackground": "#2ea043",
//     "editorGutter.deletedBackground": "#f85149",
//     "editorGutter.modifiedBackground": "#0078d4",
//     "editorInlayHint.background": "#8b949e33",
//     "editorInlayHint.foreground": "#8b949e",
//     "editorInlayHint.typeBackground": "#8b949e33",
//     "editorInlayHint.typeForeground": "#8b949e",
//     "editorLineNumber.activeForeground": "#cccccc",
//     "editorLineNumber.foreground": "#6e7681",
//     "editorOverviewRuler.border": "#010409",
//     "editorWidget.background": "#1f1f1f",
//     "errorForeground": "#f85149",
//     "focusBorder": "#0078d4",
//     "foreground": "#cccccc",
//     "icon.foreground": "#cccccc",
//     "input.background": "#2a2a2a",
//     "input.border": "#ffffff1f",
//     "input.foreground": "#cccccc",
//     "input.placeholderForeground": "#ffffff79",
//     "inputOption.activeBackground": "#2489db82",
//     "inputOption.activeBorder": "#2488db",
//     "keybindingLabel.foreground": "#cccccc",
//     "list.activeSelectionBackground": "#323232",
//     "list.activeSelectionIconForeground": "#ffffff",
//     "list.activeSelectionForeground": "#ffffff",
//     "menu.background": "#1f1f1f",
//     "notificationCenterHeader.background": "#1f1f1f",
//     "notificationCenterHeader.foreground": "#cccccc",
//     "notifications.background": "#1f1f1f",
//     "notifications.border": "#ffffff15",
//     "notifications.foreground": "#cccccc",
//     "panel.background": "#181818",
//     "panel.border": "#ffffff15",
//     "panelInput.border": "#ffffff15",
//     "panelTitle.activeBorder": "#0078d4",
//     "panelTitle.activeForeground": "#cccccc",
//     "panelTitle.inactiveForeground": "#8b949e",
//     "peekViewEditor.background": "#1f1f1f",
//     "peekViewEditor.matchHighlightBackground": "#bb800966",
//     "peekViewResult.background": "#1f1f1f",
//     "peekViewResult.matchHighlightBackground": "#bb800966",
//     "pickerGroup.border": "#ffffff15",
//     "pickerGroup.foreground": "#8b949e",
//     "progressBar.background": "#0078d4",
//     "quickInput.background": "#1f1f1f",
//     "quickInput.foreground": "#cccccc",
//     "scrollbar.shadow": "#484f5833",
//     "scrollbarSlider.activeBackground": "#6e768187",
//     "scrollbarSlider.background": "#6e768133",
//     "scrollbarSlider.hoverBackground": "#6e768145",
//     "settings.dropdownBackground": "#313131",
//     "settings.dropdownBorder": "#ffffff1f",
//     "settings.headerForeground": "#ffffff",
//     "settings.modifiedItemIndicator": "#bb800966",
//     "sideBar.background": "#181818",
//     "sideBar.border": "#ffffff15",
//     "sideBar.foreground": "#cccccc",
//     "sideBarSectionHeader.background": "#181818",
//     "sideBarSectionHeader.border": "#ffffff15",
//     "sideBarSectionHeader.foreground": "#cccccc",
//     "sideBarTitle.foreground": "#cccccc",
//     "statusBar.background": "#181818",
//     "statusBar.border": "#ffffff15",
//     "statusBar.debuggingBackground": "#0078d4",
//     "statusBar.debuggingForeground": "#ffffff",
//     "statusBar.focusBorder": "#0078d4",
//     "statusBar.foreground": "#cccccc",
//     "statusBar.noFolderBackground": "#1f1f1f",
//     "statusBarItem.focusBorder": "#0078d4",
//     "statusBarItem.prominentBackground": "#6e768166",
//     "statusBarItem.remoteBackground": "#0078d4",
//     "statusBarItem.remoteForeground": "#ffffff",
//     "tab.activeBackground": "#1f1f1f",
//     "tab.activeBorder": "#1f1f1f",
//     "tab.activeBorderTop": "#0078d4",
//     "tab.activeForeground": "#ffffff",
//     "tab.border": "#ffffff15",
//     "tab.hoverBackground": "#1f1f1f",
//     "tab.inactiveBackground": "#181818",
//     "tab.inactiveForeground": "#ffffff80",
//     "tab.unfocusedActiveBorder": "#1f1f1f",
//     "tab.unfocusedActiveBorderTop": "#ffffff15",
//     "tab.unfocusedHoverBackground": "#6e76811a",
//     "terminal.foreground": "#cccccc",
//     "terminal.tab.activeBorder": "#0078d4",
//     "textBlockQuote.background": "#010409",
//     "textBlockQuote.border": "#ffffff14",
//     "textCodeBlock.background": "#6e768166",
//     "textLink.activeForeground": "#40A6FF",
//     "textLink.foreground": "#40A6FF",
//     "textSeparator.foreground": "#21262d",
//     "titleBar.activeBackground": "#181818",
//     "titleBar.activeForeground": "#cccccc",
//     "titleBar.border": "#ffffff15",
//     "titleBar.inactiveBackground": "#1f1f1f",
//     "titleBar.inactiveForeground": "#8b949e",
//     "welcomePage.tileBackground": "#ffffff0f",
//     "welcomePage.progress.foreground": "#0078d4",
//     "widget.border": "#ffffff15"
//   },
//   "tokenColors": [
//     {
//       "name": "Function declarations",
//       "scope": [
//         "entity.name.function",
//         "support.function",
//         "support.constant.handlebars",
//         "source.powershell variable.other.member",
//         "entity.name.operator.custom-literal"
//       ],
//       "settings": {
//         "foreground": "#DCDCAA"
//       }
//     },
//     {
//       "name": "Types declaration and references",
//       "scope": [
//         "support.class",
//         "support.type",
//         "entity.name.type",
//         "entity.name.namespace",
//         "entity.other.attribute",
//         "entity.name.scope-resolution",
//         "entity.name.class",
//         "storage.type.numeric.go",
//         "storage.type.byte.go",
//         "storage.type.boolean.go",
//         "storage.type.string.go",
//         "storage.type.uintptr.go",
//         "storage.type.error.go",
//         "storage.type.rune.go",
//         "storage.type.cs",
//         "storage.type.generic.cs",
//         "storage.type.modifier.cs",
//         "storage.type.variable.cs",
//         "storage.type.annotation.java",
//         "storage.type.generic.java",
//         "storage.type.java",
//         "storage.type.object.array.java",
//         "storage.type.primitive.array.java",
//         "storage.type.primitive.java",
//         "storage.type.token.java",
//         "storage.type.groovy",
//         "storage.type.annotation.groovy",
//         "storage.type.parameters.groovy",
//         "storage.type.generic.groovy",
//         "storage.type.object.array.groovy",
//         "storage.type.primitive.array.groovy",
//         "storage.type.primitive.groovy"
//       ],
//       "settings": {
//         "foreground": "#4EC9B0"
//       }
//     },
//     {
//       "name": "Types declaration and references, TS grammar specific",
//       "scope": [
//         "meta.type.cast.expr",
//         "meta.type.new.expr",
//         "support.constant.math",
//         "support.constant.dom",
//         "support.constant.json",
//         "entity.other.inherited-class"
//       ],
//       "settings": {
//         "foreground": "#4EC9B0"
//       }
//     },
//     {
//       "name": "Control flow / Special keywords",
//       "scope": [
//         "keyword.control",
//         "source.cpp keyword.operator.new",
//         "keyword.operator.delete",
//         "keyword.other.using",
//         "keyword.other.operator",
//         "entity.name.operator"
//       ],
//       "settings": {
//         "foreground": "#C586C0"
//       }
//     },
//     {
//       "name": "Variable and parameter name",
//       "scope": [
//         "variable",
//         "meta.definition.variable.name",
//         "support.variable",
//         "entity.name.variable",
//         "constant.other.placeholder"
//       ],
//       "settings": {
//         "foreground": "#9CDCFE"
//       }
//     },
//     {
//       "name": "Constants and enums",
//       "scope": [
//         "variable.other.constant",
//         "variable.other.enummember"
//       ],
//       "settings": {
//         "foreground": "#4FC1FF"
//       }
//     },
//     {
//       "name": "Object keys, TS grammar specific",
//       "scope": [
//         "meta.object-literal.key"
//       ],
//       "settings": {
//         "foreground": "#9CDCFE"
//       }
//     },
//     {
//       "name": "CSS property value",
//       "scope": [
//         "support.constant.property-value",
//         "support.constant.font-name",
//         "support.constant.media-type",
//         "support.constant.media",
//         "constant.other.color.rgb-value",
//         "constant.other.rgb-value",
//         "support.constant.color"
//       ],
//       "settings": {
//         "foreground": "#CE9178"
//       }
//     },
//     {
//       "name": "Regular expression groups",
//       "scope": [
//         "punctuation.definition.group.regexp",
//         "punctuation.definition.group.assertion.regexp",
//         "punctuation.definition.character-class.regexp",
//         "punctuation.character.set.begin.regexp",
//         "punctuation.character.set.end.regexp",
//         "keyword.operator.negation.regexp",
//         "support.other.parenthesis.regexp"
//       ],
//       "settings": {
//         "foreground": "#CE9178"
//       }
//     },
//     {
//       "scope": [
//         "constant.character.character-class.regexp",
//         "constant.other.character-class.set.regexp",
//         "constant.other.character-class.regexp",
//         "constant.character.set.regexp"
//       ],
//       "settings": {
//         "foreground": "#d16969"
//       }
//     },
//     {
//       "scope": [
//         "keyword.operator.or.regexp",
//         "keyword.control.anchor.regexp"
//       ],
//       "settings": {
//         "foreground": "#DCDCAA"
//       }
//     },
//     {
//       "scope": "keyword.operator.quantifier.regexp",
//       "settings": {
//         "foreground": "#d7ba7d"
//       }
//     },
//     {
//       "scope": [
//         "constant.character",
//         "constant.other.option"
//       ],
//       "settings": {
//         "foreground": "#569cd6"
//       }
//     },
//     {
//       "scope": "constant.character.escape",
//       "settings": {
//         "foreground": "#d7ba7d"
//       }
//     },
//     {
//       "scope": "entity.name.label",
//       "settings": {
//         "foreground": "#C8C8C8"
//       }
//     }
//   ],
//   "semanticTokenColors": {
//     "newOperator": "#C586C0",
//     "stringLiteral": "#ce9178",
//     "customLiteral": "#DCDCAA",
//     "numberLiteral": "#b5cea8"
//   }
// }
