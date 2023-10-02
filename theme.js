import { promises as fs } from 'fs'
import { Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities'

const createColors = options => {
  const hexFromHct = (hue, chroma, tone) => hexFromArgb(Hct.from(hue, chroma, tone).toInt())
  const primary = Hct.fromInt(argbFromHex(options.primary))
  options.neutral = hexFromHct(primary.hue, 10, 40)

  const colors = {}
  for (const [colorKey, value] of Object.entries(options)) {
    const isColor = typeof value == 'string' && value.startsWith('#')
    if (!isColor) continue

    const { hue, chroma } = Hct.fromInt(argbFromHex(value))
    const maxTone = 98
    const inverseTone = tone => Math.min(100 - tone + options.lightness, maxTone)

    const tones = [90, 80, 60, 50, 40, 10]
    tones.forEach(tone => {
      colors[`${colorKey}_${tone}`] = hexFromHct(hue, chroma, options.dark ? inverseTone(tone) : tone)
    })

    if (colorKey != 'neutral') {
      const surface = hexFromHct(hue, 10, options.dark ? inverseTone(100) : maxTone)
      const surface2 = hexFromHct(hue, 15, options.dark ? inverseTone(95) : 95)
      const surface3 = hexFromHct(hue, 20, options.dark ? inverseTone(90) : 90)
      const surface4 = hexFromHct(hue, 20, options.dark ? inverseTone(85) : 85)
      colors[`${colorKey}_surface`] = surface
      colors[`${colorKey}_surface_2`] = surface2
      colors[`${colorKey}_surface_3`] = surface3
      colors[`${colorKey}_surface_4`] = surface4
    }
  }
  return colors
}

export const createTheme = (path, options) => {
  const colors = createColors({
    dark: true,
    lightness: 8,
    primary: '#00adff',
    blue: '#0091ff',
    cyan: '#00adff',
    red: '#ff002b',
    green: '#00ffac',
    pink: '#ff00d9',
    yellow: '#fff700',
    ...options
  })
  colors.transparent = '#ffffff00'

  const theme = {
    name: 'Material Code',
    type: 'dark',
    colors: {
      foreground: colors.neutral_10,
      'icon.foreground': colors.neutral_10,
      'textLink.foreground': colors.primary_40,
      errorForeground: colors.red_40,
      'selection.background': colors.primary_surface_4,
      focusBorder: colors.transparent,
      'sash.hoverBorder': colors.primary_40,
      'widget.shadow': colors.transparent,

      'button.background': colors.primary_40,
      'button.foreground': colors.primary_surface,
      'button.secondaryBackground': colors.primary_surface_3,
      'button.secondaryForeground': colors.primary_10,

      'checkbox.background': colors.transparent,
      'checkbox.foreground': colors.primary_40,
      'checkbox.border': colors.primary_40,

      'dropdown.background': colors.primary_surface_2,

      'input.background': colors.primary_surface_2,
      'input.placeholderForeground': colors.neutral_40,
      'inputOption.activeBackground': colors.primary_surface_3,
      'inputOption.activeForeground': colors.primary_10,
      'inputValidation.errorBackground': colors.error_surface_2,
      'inputValidation.errorForeground': colors.red_10,
      'inputValidation.errorBorder': colors.transparent,

      'scrollbar.shadow': colors.transparent,
      'scrollbarSlider.background': colors.primary_surface_3,
      'scrollbarSlider.hoverBackground': colors.primary_surface_3,
      'scrollbarSlider.activeBackground': colors.primary_surface_3,

      'badge.background': colors.primary_surface_3,
      'badge.foreground': colors.primary_10,

      'list.hoverBackground': colors.primary_surface_3,
      'list.activeSelectionBackground': colors.primary_surface_3,
      'list.inactiveSelectionBackground': colors.primary_surface_2,
      'list.dropBackground': colors.primary_40 + 80,
      'list.highlightForeground': colors.primary_40,
      'listFilterWidget.background': colors.primary_surface_3,

      'activityBar.background': colors.primary_surface,
      'activityBar.foreground': colors.neutral_10,
      'activityBar.activeBorder': colors.transparent,
      'activityBar.activeBackground': colors.primary_surface_2,

      'sideBar.background': colors.primary_surface,
      'sideBar.foreground': colors.neutral_10,
      'sideBar.border': colors.transparent,
      'sideBarSectionHeader.background': colors.transparent,

      'editorGroup.dropBackground': colors.primary_40 + 80,
      'editorGroup.border': colors.primary_surface_3,
      'editorGroupHeader.tabsBackground': colors.primary_surface,

      'tab.activeBackground': colors.primary_surface_2,
      'tab.activeForeground': colors.neutral_10,
      'tab.hoverBackground': colors.primary_surface_3,
      'tab.inactiveBackground': colors.primary_surface,
      'tab.inactiveForeground': colors.neutral_40,
      'tab.border': colors.transparent,

      'panel.background': colors.primary_surface_2,
      'panel.border': colors.transparent,
      'panel.dropBorder': colors.primary_40,
      'panelTitle.activeForeground': colors.neutral_10,
      'panelTitle.activeBorder': colors.neutral_10,
      'panelTitle.inactiveForeground': colors.neutral_40,

      'statusBar.debuggingBackground': colors.primary_surface,
      'debugIcon.breakpointForeground': colors.primary_40,
      'debugIcon.breakpointUnverifiedForeground': colors.primary_40,
      'editor.stackFrameHighlightBackground': colors.primary_80,
      'debugIcon.breakpointCurrentStackframeForeground': colors.primary_40,

      'debugToolBar.background': colors.primary_surface_2,
      'debugIcon.restartForeground': colors.green_40,
      'debugIcon.stepOverForeground': colors.primary_40,
      'debugIcon.stepIntoForeground': colors.primary_40,
      'debugIcon.stepOutForeground': colors.primary_40,
      'debugIcon.continueForeground': colors.primary_40,

      'debugTokenExpression.name': colors.pink_40,
      'debugTokenExpression.value': colors.neutral_40,
      'debugTokenExpression.string': colors.green_40,
      'debugTokenExpression.number': colors.yellow_40,
      'debugTokenExpression.boolean': colors.yellow_40,
      'debugTokenExpression.error': colors.red_40,

      'editorGutter.foldingControlForeground': colors.neutral_40,

      'diffEditor.diagonalFill': colors.primary_surface_4,
      'diffEditor.insertedTextBackground': colors.transparent,
      'diffEditor.removedTextBackground': colors.transparent,
      'diffEditor.insertedLineBackground': colors.green_80 + 80,
      'diffEditor.removedLineBackground': colors.red_80 + 80,

      'editorRuler.foreground': colors.primary_surface_2,
      'editorWhitespace.foreground': colors.neutral_40,

      'editorHoverWidget.background': colors.primary_surface_2,
      'editorHoverWidget.border': colors.transparent,

      'editorOverviewRuler.border': colors.transparent,
      'editorOverviewRuler.errorForeground': colors.red_40,
      'editorOverviewRuler.findMatchForeground': colors.primary_40,
      'editorOverviewRuler.infoForeground': colors.green_40,
      'editorOverviewRuler.warningForeground': colors.yellow_40,

      'menubar.selectionBackground': colors.primary_surface_2,
      'menu.background': colors.primary_surface_2,
      'menu.foreground': colors.neutral_10,
      'menu.selectionBackground': colors.primary_surface_3,
      'menu.separatorBackground': colors.transparent,

      'pickerGroup.border': colors.transparent,

      'keybindingLabel.background': colors.primary_surface_3,
      'keybindingLabel.foreground': colors.neutral_10,
      'keybindingLabel.border': colors.transparent,
      'keybindingLabel.bottomBorder': colors.transparent,

      'titleBar.activeBackground': colors.primary_surface,
      'titleBar.activeForeground': colors.neutral_10,
      'titleBar.inactiveBackground': colors.primary_surface,
      'titleBar.inactiveForeground': colors.neutral_10,

      'statusBar.background': colors.primary_surface,
      'statusBar.foreground': colors.neutral_10,
      'statusBar.border': colors.transparent,
      'statusBar.focusBorder': colors.transparent,
      'statusBar.noFolderBackground': colors.primary_surface,
      'statusBarItem.hoverBackground': colors.primary_surface_2,
      'statusBarItem.activeBackground': colors.primary_surface_2,
      'statusBarItem.remoteBackground': colors.primary_surface,
      'statusBarItem.remoteForeground': colors.neutral_10,

      'editor.background': colors.primary_surface,
      'editor.foreground': colors.neutral_10,
      'editorCursor.foreground': colors.neutral_10,
      'editor.lineHighlightBackground': colors.primary_surface_2,
      'editor.selectionBackground': colors.primary_80,
      'editor.wordHighlightBackground': colors.primary_80,
      'editor.findMatchBackground': colors.primary_80,
      'editor.findMatchHighlightBackground': colors.primary_80,

      'editorBracketMatch.background': colors.primary_80,
      'editorBracketMatch.border': colors.transparent,
      'editorBracketHighlight.foreground1': colors.pink_50,
      'editorBracketHighlight.foreground2': colors.yellow_40,
      'editorBracketHighlight.foreground3': colors.red_50,
      'editorBracketHighlight.foreground4': colors.green_40,
      'editorBracketPairGuide.activeBackground1': colors.pink_60,
      'editorBracketPairGuide.activeBackground2': colors.yellow_60,
      'editorBracketPairGuide.activeBackground3': colors.red_60,
      'editorBracketPairGuide.activeBackground4': colors.green_60,

      'editorIndentGuide.activeBackground': colors.primary_surface_2,
      'editorIndentGuide.background': colors.transparent,
      'editorInfo.foreground': colors.neutral_10,
      'editorError.foreground': colors.red_40,
      'editorWarning.foreground': colors.yellow_40,
      'editorLink.activeForeground': colors.neutral_10,

      'editorLineNumber.foreground': colors.primary_surface_3,
      'editorLineNumber.activeForeground': colors.neutral_40,

      'editorWidget.background': colors.primary_surface_2,
      'editorWidget.border': colors.transparent,
      'editorSuggestWidget.selectedBackground': colors.primary_surface_3,

      'peekView.border': colors.primary_40,
      'peekViewEditor.background': colors.primary_surface_2,
      'peekViewResult.background': colors.primary_surface_3,
      'peekViewTitleLabel.foreground': colors.primary_40,
      'peekViewTitleDescription.foreground': colors.neutral_10,
      'peekViewEditor.matchHighlightBackground': colors.primary_90,
      'peekViewResult.matchHighlightBackground': colors.primary_90,
      'peekViewResult.selectionBackground': colors.primary_surface_3,
      'peekViewResult.selectionForeground': colors.primary_10,
      'peekViewResult.lineForeground': colors.neutral_10,

      'notificationCenterHeader.background': colors.primary_surface_3,
      'notifications.background': colors.primary_surface_3,

      'settings.headerForeground': colors.primary_40,
      'settings.focusedRowBackground': colors.transparent,
      'settings.focusedRowBorder': colors.transparent,
      'settings.modifiedItemIndicator': colors.primary_40,

      'progressBar.background': colors.primary_40,
      'tree.indentGuidesStroke': colors.primary_surface_2,

      'terminal.foreground': colors.neutral_10,
      'terminal.ansiBrightBlue': colors.blue_50,
      'terminal.ansiBrightGreen': colors.green_40,
      'terminal.ansiBrightRed': colors.red_50,
      'terminal.ansiBrightYellow': colors.yellow_40,
      'terminal.ansiBrightCyan': colors.cyan_40,
      'terminal.ansiBrightMagenta': colors.pink_50,

      'breadcrumb.foreground': colors.neutral_40,
      'breadcrumb.focusForeground': colors.neutral_10,
      'breadcrumb.activeSelectionForeground': colors.neutral_10,
      'breadcrumbPicker.background': colors.primary_surface_2
    },
    tokenColors: [
      {
        scope: [
          '',
          'punctuation',
          'keyword',
          'keyword.other.unit',
          'constant.other',

          'comment',
          'punctuation.definition.comment'
        ],
        settings: {
          foreground: colors.neutral_40
        }
      },
      {
        scope: ['string', 'punctuation.definition.string'],
        settings: {
          foreground: colors.green_40
        }
      },
      {
        scope: [
          'storage.type', // const
          'storage.modifier',
          'keyword.operator', // =, ?, :, +
          'keyword.control', // new, import, from
          'punctuation.definition.template-expression' // ${}
        ],
        settings: {
          foreground: colors.pink_50
        }
      },
      {
        scope: [
          'variable',
          'meta.objectliteral',
          'entity.name.tag', // div
          'punctuation.definition.tag', // tag bracket <>
          'invalid.illegal.character-not-allowed-here.html' // closing bracket /
        ],
        settings: {
          foreground: colors.blue_50
        }
      },
      {
        scope: [
          'entity.other.attribute-name',
          'punctuation.separator.key-value.html', // class=
          'punctuation.attribute-shorthand.bind.html.vue', // :class
          'punctuation.attribute-shorthand.event.html.vue' // @click
        ],
        settings: {
          foreground: colors.blue_40
        }
      },
      {
        scope: ['variable.other', 'punctuation.definition'],
        settings: {
          foreground: colors.cyan_40
        }
      },
      {
        scope: [
          'support.variable',
          'support.function',
          'entity.name.function', // function()
          'keyword.other',
          'support.type', // css property
          'punctuation.separator.key-value.css' // color: blue
        ],
        settings: {
          foreground: colors.red_50
        }
      },
      {
        scope: [
          'constant', // numbers, \n
          'support.constant', // css value
          'keyword.other.unit', // 5px
          'punctuation.terminator.rule.css', // px;
          'entity.name.type' // class name
        ],
        settings: {
          foreground: colors.yellow_40
        }
      }
    ]
  }

  return fs.writeFile(path, JSON.stringify(theme))
}

if (process.env.dev) createTheme('./themes/dark.json')
