import { Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities'

const hexFromHct = (hue, chroma, tone) => hexFromArgb(Hct.from(hue, chroma, tone).toInt())

const maxLightness = 99
let darkThemeExtraLightness = 8
const inverseTone = tone => Math.min(100 - tone + darkThemeExtraLightness, maxLightness)

const createColors = options => {
  const primary = Hct.fromInt(argbFromHex(options.primary))
  options.neutral = hexFromHct(primary.hue, 10, 40)

  const colors = {}
  for (const [key, value] of Object.entries(options)) {
    const isColor = typeof value == 'string' && value.startsWith('#')
    if (!isColor) continue

    const { hue, chroma } = Hct.fromInt(argbFromHex(value))
    const tones = [80, 50, 40, 20]
    tones.forEach(tone => {
      colors[`${key}_${tone}`] = hexFromHct(hue, chroma, options.dark ? inverseTone(tone) : tone)
    })
    if (key != 'neutral') {
      colors[`${key}_surface`] = hexFromHct(hue, 8, options.dark ? inverseTone(102) : maxLightness)
      colors[`${key}_surface_2`] = hexFromHct(hue, 16, options.dark ? inverseTone(95) : 95)
      colors[`${key}_surface_3`] = hexFromHct(hue, 20, options.dark ? inverseTone(90) : 90)
      colors[`${key}_surface_4`] = hexFromHct(hue, 20, options.dark ? inverseTone(85) : 85)
    }
  }
  return colors
}

export const createTheme = options => {
  if (options.lightness) darkThemeExtraLightness = options.lightness
  const colors = createColors({
    dark: true,
    primary: '#00adff',
    blue: '#0091ff',
    skyblue: '#00adff',
    red: '#ff002b',
    green: '#00ffac',
    pink: '#ff00d9',
    yellow: '#ffee00',
    ...options
  })
  colors.transparent = '#ffffff00'
  return {
    name: 'Material Code',
    type: 'dark',
    colors: {
      foreground: colors.neutral_20,
      'icon.foreground': colors.neutral_20,
      'banner.iconForeground': colors.neutral_20,
      'textLink.foreground': colors.primary_40,
      'textLink.activeForeground': colors.primary_40,
      errorForeground: colors.red_40,
      'selection.background': colors.primary_surface_4,
      focusBorder: colors.transparent,
      'sash.hoverBorder': colors.primary_40,
      'widget.shadow': colors.transparent,

      'button.foreground': colors.primary_surface,
      'button.background': colors.primary_40,
      'button.secondaryForeground': colors.primary_20,
      'button.secondaryBackground': colors.primary_surface_3,

      'badge.background': colors.primary_40,
      'badge.foreground': colors.primary_surface,
      'activityBarBadge.background': colors.primary_40,
      'activityBarBadge.foreground': colors.primary_surface,

      'checkbox.background': colors.transparent,
      'checkbox.foreground': colors.primary_40,
      'checkbox.border': colors.primary_40,

      'dropdown.background': colors.primary_surface_2,

      'input.background': colors.primary_surface_2,
      'input.placeholderForeground': colors.neutral_40,
      'inputValidation.errorBackground': colors.error_surface_2,
      'inputValidation.errorForeground': colors.red_20,
      'inputValidation.errorBorder': colors.transparent,

      'inputOption.activeBackground': colors.primary_40,
      'inputOption.activeForeground': colors.primary_surface,
      'inputOption.activeBorder': colors.transparent,

      'scrollbar.shadow': colors.transparent,
      'scrollbarSlider.background': colors.primary_surface_3,
      'scrollbarSlider.hoverBackground': colors.primary_surface_3,
      'scrollbarSlider.activeBackground': colors.primary_surface_3,

      'list.hoverBackground': colors.primary_surface_3,
      'list.activeSelectionBackground': colors.primary_surface_3,
      'list.inactiveSelectionBackground': colors.primary_surface_2,
      'list.dropBackground': colors.primary_40 + 80,
      'list.highlightForeground': colors.primary_40,
      'listFilterWidget.background': colors.primary_surface_3,

      'activityBar.background': colors.primary_surface,
      'activityBar.foreground': colors.neutral_20,
      'activityBar.activeBorder': colors.transparent,
      'activityBar.activeBackground': colors.primary_surface_2,

      'sideBar.background': colors.primary_surface,
      'sideBar.foreground': colors.neutral_20,
      'sideBar.border': colors.transparent,
      'sideBarSectionHeader.background': colors.transparent,

      'editorGroup.dropBackground': colors.primary_40 + 80,
      'editorGroup.border': colors.primary_surface_3,
      'editorGroupHeader.tabsBackground': colors.primary_surface,

      'tab.activeBackground': colors.primary_surface_2,
      'tab.activeforeground': colors.neutral_20,
      'tab.hoverBackground': colors.primary_surface_3,
      'tab.inactiveBackground': colors.primary_surface,
      'tab.inactiveForeground': colors.neutral_40,
      'tab.border': colors.transparent,

      'panel.background': colors.primary_surface_2,
      'panel.border': colors.transparent,
      'panel.dropBorder': colors.primary_40,
      'panelTitle.activeforeground': colors.neutral_20,
      'panelTitle.activeBorder': colors.neutral_20,
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

      'editorGutter.modifiedBackground': colors.primary_40,
      'editorGutter.addedBackground': colors.green_80,
      'editorGutter.deletedBackground': colors.red_80,

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
      'menu.foreground': colors.neutral_20,
      'menu.selectionBackground': colors.primary_surface_3,
      'menu.separatorBackground': colors.transparent,

      'pickerGroup.border': colors.transparent,
      'pickerGroup.foreground': colors.primary_40,

      'keybindingLabel.background': colors.primary_surface_3,
      'keybindingLabel.foreground': colors.neutral_20,
      'keybindingLabel.border': colors.transparent,
      'keybindingLabel.bottomBorder': colors.transparent,

      'titleBar.activeBackground': colors.primary_surface,
      'titleBar.activeforeground': colors.neutral_20,
      'titleBar.inactiveBackground': colors.primary_surface,
      'titleBar.inactiveforeground': colors.neutral_20,

      'statusBar.background': colors.primary_surface,
      'statusBar.foreground': colors.neutral_20,
      'statusBar.border': colors.transparent,
      'statusBar.focusBorder': colors.transparent,
      'statusBar.noFolderBackground': colors.primary_surface,
      'statusBarItem.hoverBackground': colors.primary_surface_2,
      'statusBarItem.activeBackground': colors.primary_surface_2,
      'statusBarItem.remoteBackground': colors.primary_surface,
      'statusBarItem.remoteforeground': colors.neutral_20,

      'editor.background': colors.primary_surface,
      'editor.foreground': colors.neutral_20,
      'editorCursor.foreground': colors.neutral_20,
      'editor.lineHighlightBackground': colors.primary_surface_2,
      'editor.selectionBackground': colors.primary_surface_3,
      'editor.wordHighlightBackground': colors.primary_80,
      'editor.findMatchBackground': colors.primary_80,
      'editor.findMatchHighlightBackground': colors.primary_80,

      'editorBracketMatch.background': colors.primary_80,
      'editorBracketMatch.border': colors.transparent,

      'editorStickyScroll.background': colors.primary_surface + 80,
      'editorStickyScrollHover.background': colors.primary_surface_2,

      'editorBracketHighlight.foreground1': colors.pink_50,
      'editorBracketHighlight.foreground2': colors.yellow_40,
      'editorBracketHighlight.foreground3': colors.red_50,
      'editorBracketHighlight.foreground4': colors.green_50,
      'editorBracketPairGuide.activeBackground1': colors.pink_50 + 90,
      'editorBracketPairGuide.activeBackground2': colors.yellow_40 + 90,
      'editorBracketPairGuide.activeBackground3': colors.red_50 + 90,
      'editorBracketPairGuide.activeBackground4': colors.green_50 + 90,
      'editorBracketPairGuide.background1': colors.pink_surface_4,
      'editorBracketPairGuide.background2': colors.yellow_surface_4,
      'editorBracketPairGuide.background3': colors.red_surface_4,
      'editorBracketPairGuide.background4': colors.green_surface_4,

      'editorIndentGuide.activeBackground': colors.primary_surface_2,
      'editorIndentGuide.background': colors.transparent,
      'editorInfo.foreground': colors.neutral_20,
      'editorError.foreground': colors.red_40,
      'editorWarning.foreground': colors.yellow_40,
      'editorLink.activeforeground': colors.neutral_20,

      'editorLineNumber.foreground': colors.primary_surface_3,
      'editorLineNumber.activeForeground': colors.neutral_40,

      'editorWidget.background': colors.primary_surface_2,
      'editorWidget.border': colors.transparent,
      'editorSuggestWidget.selectedBackground': colors.primary_surface_3,

      'peekView.border': colors.transparent,

      'peekViewTitle.background': colors.primary_surface_2,
      'peekViewTitleLabel.foreground': colors.primary_40,
      'peekViewTitleDescription.foreground': colors.neutral_20,

      'peekViewResult.background': colors.primary_surface_2,
      'peekViewResult.matchHighlightBackground': colors.primary_80,
      'peekViewResult.selectionBackground': colors.primary_surface_3,
      'peekViewResult.selectionForeground': colors.primary_20,
      'peekViewResult.lineforeground': colors.neutral_20,

      'peekViewEditor.background': colors.primary_surface_2,
      'peekViewEditor.matchHighlightBackground': colors.primary_80,

      'notificationCenterHeader.background': colors.primary_surface_3,
      'notifications.background': colors.primary_surface_3,
      'notificationsInfoIcon.foreground': colors.primary_40,

      'problemsInfoIcon.foreground': colors.primary_40,

      'settings.headerForeground': colors.primary_40,
      'settings.focusedRowBackground': colors.transparent,
      'settings.focusedRowBorder': colors.transparent,
      'settings.modifiedItemIndicator': colors.primary_40,

      'progressBar.background': colors.primary_40,
      'tree.indentGuidesStroke': colors.primary_surface_2,

      'terminal.foreground': colors.neutral_20,
      'terminal.ansiBrightBlue': colors.blue_50,
      'terminal.ansiBrightGreen': colors.green_40,
      'terminal.ansiBrightRed': colors.red_50,
      'terminal.ansiBrightYellow': colors.yellow_40,
      'terminal.ansiBrightCyan': colors.skyblue_40,
      'terminal.ansiBrightMagenta': colors.pink_50,

      'breadcrumb.foreground': colors.neutral_40,
      'breadcrumb.focusforeground': colors.neutral_20,
      'breadcrumb.activeSelectionforeground': colors.neutral_20,
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
          foreground: colors.skyblue_40
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
}
