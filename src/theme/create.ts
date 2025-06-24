import {
  type MaterialPalette,
  hexToHct,
  hctToHex,
  createDynamicPalette,
  createPrimaryVariants,
  error,
  primary
} from 'material-colors'

export const themeOptions = {
  darkMode: true,
  primary,
  error,

  blue: '#0091ff',
  skyBlue: primary,
  red: '#ff002b',
  green: '#00ffac',
  pink: '#ff00d9',
  yellow: '#ffee00'
}

export type Theme = MaterialPalette & {
  error: string
  errorForeground: string

  /** Success indicators, green terminal colors */
  success: string
  /** Warning indicators, yellow terminal colors */
  warning: string

  /** Syntax highlighting */
  syntax: {
    comment: string
    string: string
    /** Keywords, operators, control flow */
    keyword: string
    /** Variables, tags, HTML elements */
    variable: string
    /** HTML attributes, CSS selectors */
    attribute: string
    /** Object properties, CSS properties */
    property: string
    /** Functions, methods, CSS values */
    function: string
    /** Numbers, constants, types */
    constant: string

    /** Bracket pair colors */
    bracket1: string
    bracket2: string
    bracket3: string
    bracket4: string
  }
}

export const createTheme = (options: typeof themeOptions): Theme => {
  const primaryHct = hexToHct(options.primary)
  const primaryPalette = createDynamicPalette(primaryHct, options.darkMode)

  const errorHct = hexToHct(options.error)
  const errorPalette = createDynamicPalette(errorHct, options.darkMode)

  const greenHct = hexToHct(options.green)
  const green = createPrimaryVariants(greenHct, options.darkMode)

  const yellowHct = hexToHct(options.yellow)
  const yellow = createPrimaryVariants(yellowHct, options.darkMode)

  const blueHct = hexToHct(options.blue)
  const skyBlueHct = hexToHct(options.skyBlue)
  const pinkHct = hexToHct(options.pink)

  const chroma = options.darkMode ? 90 : 120
  const tone = options.darkMode ? 60 : 48
  const syntaxColors = {
    string: hctToHex(greenHct.hue, chroma, tone),
    keyword: hctToHex(pinkHct.hue, chroma, tone),
    variable: hctToHex(blueHct.hue, chroma, options.darkMode ? 50 : tone),
    property: hctToHex(skyBlueHct.hue, chroma, tone),
    attribute: hctToHex(skyBlueHct.hue, chroma, options.darkMode ? 70 : tone),
    function: hctToHex(errorHct.hue, options.darkMode ? 70 : 90, tone),
    constant: hctToHex(yellowHct.hue, chroma, options.darkMode ? 70 : 60)
  }

  return {
    ...primaryPalette,

    error: errorPalette.primary,
    errorForeground: errorPalette.primaryForeground,
    success: green.color,
    warning: yellow.color,

    syntax: {
      comment: primaryPalette.mutedForeground,
      string: syntaxColors.string,
      keyword: syntaxColors.keyword,
      variable: syntaxColors.variable,
      attribute: syntaxColors.attribute,
      property: syntaxColors.property,
      function: syntaxColors.function,
      constant: syntaxColors.constant,

      bracket1: syntaxColors.keyword,
      bracket2: syntaxColors.constant,
      bracket3: syntaxColors.function,
      bracket4: syntaxColors.string
    }
  }
}

export const createVsCodeTheme = (colors: Theme) => {
  const transparent = '#ffffff00'

  return {
    name: 'Material Code',
    colors: {
      'banner.iconForeground': colors.foreground,
      'textLink.foreground': colors.primary,
      foreground: colors.foreground,
      'icon.foreground': colors.foreground,
      'textLink.activeForeground': colors.primary,
      errorForeground: colors.error,
      'selection.background': colors.primary + '20',
      focusBorder: transparent,
      'sash.hoverBorder': colors.primary,
      'widget.shadow': transparent,
      'widget.border': colors.border,

      'button.foreground': colors.primaryForeground,
      'button.background': colors.primary,
      'button.secondaryForeground': colors.secondaryForeground,
      'button.secondaryBackground': colors.secondary,

      'badge.background': colors.primary,
      'badge.foreground': colors.primaryForeground,
      'activityBarBadge.background': colors.primary,
      'activityBarBadge.foreground': colors.primaryForeground,

      'checkbox.background': transparent,
      'checkbox.foreground': colors.primary,
      'checkbox.border': colors.primary,

      'dropdown.background': colors.popover,
      'dropdown.foreground': colors.foreground,
      'dropdown.border': transparent,

      'input.background': colors.card,
      'input.foreground': colors.foreground,
      'input.border': transparent,
      'input.placeholderForeground': colors.mutedForeground,
      'inputValidation.errorBackground': colors.error + '40',
      'inputValidation.errorForeground': colors.errorForeground,
      'inputValidation.errorBorder': transparent,
      'inputValidation.warningBackground': colors.warning + '40',
      'inputValidation.warningForeground': colors.foreground,
      'inputValidation.warningBorder': transparent,
      'inputValidation.infoBackground': colors.primary + '40',
      'inputValidation.infoForeground': colors.foreground,
      'inputValidation.infoBorder': transparent,

      'inputOption.activeBackground': colors.primary,
      'inputOption.activeForeground': colors.primaryForeground,
      'inputOption.activeBorder': transparent,

      'scrollbar.shadow': transparent,
      'scrollbarSlider.background': colors.hover,
      'scrollbarSlider.hoverBackground': colors.hover,
      'scrollbarSlider.activeBackground': colors.hover,

      'list.hoverBackground': colors.hover,
      'list.hoverForeground': colors.foreground,
      'list.activeSelectionBackground': colors.hover,
      'list.activeSelectionForeground': colors.foreground,
      'list.inactiveSelectionBackground': colors.card,
      'list.inactiveSelectionForeground': colors.foreground,
      'list.focusBackground': colors.hover,
      'list.focusForeground': colors.foreground,
      'list.dropBackground': colors.primary + '50',
      'list.highlightForeground': colors.primary,
      'listFilterWidget.background': colors.hover,
      'listFilterWidget.outline': colors.primary,
      'listFilterWidget.noMatchesOutline': colors.error,

      'activityBar.background': colors.background,
      'activityBar.foreground': colors.foreground,
      'activityBar.activeBorder': transparent,
      'activityBar.activeBackground': colors.card,

      'sideBar.background': colors.background,
      'sideBar.foreground': colors.foreground,
      'sideBar.border': transparent,
      'sideBarSectionHeader.background': transparent,

      'editorGroup.dropBackground': colors.primary + '50',
      'editorGroup.border': colors.border,
      'editorGroupHeader.tabsBackground': colors.background,

      'tab.activeBackground': colors.card,
      'tab.hoverBackground': colors.hover,
      'tab.inactiveBackground': colors.background,
      'tab.inactiveForeground': colors.mutedForeground,
      'tab.activeForeground': colors.foreground,
      'tab.border': transparent,

      'panel.background': colors.card,
      'panel.border': transparent,
      'panel.dropBorder': colors.primary,
      'panelTitle.activeForeground': colors.foreground,
      'panelTitle.activeBorder': colors.foreground,
      'panelTitle.inactiveForeground': colors.mutedForeground,

      'outputView.background': colors.card,

      'statusBar.debuggingBackground': colors.background,
      'debugIcon.breakpointForeground': colors.primary,
      'debugIcon.breakpointUnverifiedForeground': colors.primary,
      'editor.stackFrameHighlightBackground': colors.primary + '20',
      'debugIcon.breakpointCurrentStackframeForeground': colors.primary,

      'debugToolBar.background': colors.card,
      'debugIcon.restartForeground': colors.success,
      'debugIcon.stepOverForeground': colors.primary,
      'debugIcon.stepIntoForeground': colors.primary,
      'debugIcon.stepOutForeground': colors.primary,
      'debugIcon.continueForeground': colors.primary,

      'debugTokenExpression.name': colors.syntax.attribute,
      'debugTokenExpression.value': colors.secondary,
      'debugTokenExpression.string': colors.success,
      'debugTokenExpression.number': colors.warning,
      'debugTokenExpression.boolean': colors.warning,
      'debugTokenExpression.error': colors.error,

      'editorGutter.foldingControlForeground': colors.secondary,

      'editorGutter.modifiedBackground': colors.primary,
      'editorGutter.addedBackground': colors.success + '80',
      'editorGutter.deletedBackground': colors.error + '80',

      'diffEditor.diagonalFill': colors.border + '50',
      'diffEditor.insertedTextBackground': transparent,
      'diffEditor.removedTextBackground': transparent,
      'diffEditor.insertedLineBackground': colors.success + '20',
      'diffEditor.removedLineBackground': colors.error + '20',

      'editorRuler.foreground': colors.card,
      'editorWhitespace.foreground': colors.secondaryForeground,

      'editorHoverWidget.background': colors.popover,
      'editorHoverWidget.border': transparent,

      'editorOverviewRuler.border': transparent,
      'editorOverviewRuler.errorForeground': colors.error,
      'editorOverviewRuler.findMatchForeground': colors.primary,
      'editorOverviewRuler.infoForeground': colors.success,
      'editorOverviewRuler.warningForeground': colors.warning,

      'menubar.selectionBackground': colors.card,
      'menu.background': colors.popover,
      'menu.foreground': colors.foreground,
      'menu.selectionBackground': colors.hover,
      'menu.selectionForeground': colors.foreground,
      'menu.separatorBackground': transparent,
      'menu.border': transparent,

      'pickerGroup.border': transparent,
      'pickerGroup.foreground': colors.primary,

      'quickInput.background': colors.popover,
      'quickInput.foreground': colors.foreground,
      'quickInputList.focusBackground': colors.secondary,
      'quickInputList.focusForeground': colors.secondaryForeground,
      'quickInputList.focusIconForeground': colors.primary,
      'quickInputTitle.background': colors.popover,

      'keybindingLabel.background': colors.hover,
      'keybindingLabel.foreground': colors.foreground,
      'keybindingLabel.border': transparent,
      'keybindingLabel.bottomBorder': transparent,

      'titleBar.activeBackground': colors.background,
      'titleBar.activeForeground': colors.foreground,
      'titleBar.inactiveBackground': colors.background,
      'titleBar.inactiveForeground': colors.foreground,

      'statusBar.background': colors.background,
      'statusBar.foreground': colors.foreground,
      'statusBar.border': transparent,
      'statusBar.focusBorder': transparent,
      'statusBar.noFolderBackground': colors.background,
      'statusBarItem.hoverBackground': colors.card,
      'statusBarItem.activeBackground': colors.card,
      'statusBarItem.remoteBackground': colors.background,
      'statusBarItem.remoteForeground': colors.foreground,

      'editor.background': colors.background,
      'editor.foreground': colors.foreground,
      'editor.lineHighlightBackground': colors.primary + '10',
      'editor.selectionBackground': colors.hover,
      'editor.selectionForeground': colors.foreground,
      'editor.inactiveSelectionBackground': colors.hover + '50',
      'editor.selectionHighlightBackground': colors.primary + '20',
      'editor.wordHighlightBackground': colors.primary + '30',
      'editor.wordHighlightStrongBackground': colors.primary + '40',
      'editor.findMatchBackground': colors.primary + '30',
      'editor.findMatchHighlightBackground': colors.primary + '30',
      'editor.findRangeHighlightBackground': colors.primary + '20',
      'editor.hoverHighlightBackground': colors.hover,
      'editor.lineHighlightBorder': transparent,
      'editor.rangeHighlightBackground': colors.primary + '20',
      'editor.symbolHighlightBackground': colors.primary + '20',
      'editorCursor.foreground': colors.foreground,
      'editorBracketMatch.background': colors.primary + '40',
      'editorBracketMatch.border': transparent,

      'editorBracketHighlight.foreground1': colors.syntax.bracket1,
      'editorBracketHighlight.foreground2': colors.syntax.bracket2,
      'editorBracketHighlight.foreground3': colors.syntax.bracket3,
      'editorBracketHighlight.foreground4': colors.syntax.bracket4,
      'editorBracketPairGuide.activeBackground1': colors.syntax.bracket1 + '20',
      'editorBracketPairGuide.activeBackground2': colors.syntax.bracket2 + '20',
      'editorBracketPairGuide.activeBackground3': colors.syntax.bracket3 + '20',
      'editorBracketPairGuide.activeBackground4': colors.syntax.bracket4 + '20',
      'editorBracketPairGuide.background1': colors.syntax.bracket1 + '10',
      'editorBracketPairGuide.background2': colors.syntax.bracket2 + '10',
      'editorBracketPairGuide.background3': colors.syntax.bracket3 + '10',
      'editorBracketPairGuide.background4': colors.syntax.bracket4 + '10',

      'editorIndentGuide.activeBackground': colors.card,
      'editorIndentGuide.background': transparent,
      'editorInfo.foreground': colors.foreground,
      'editorError.foreground': colors.error,
      'editorWarning.foreground': colors.warning,
      'editorLink.activeForeground': colors.foreground,

      'editorLineNumber.foreground': colors.mutedForeground,
      'editorLineNumber.activeForeground': colors.foreground,

      'editorWidget.background': colors.popover,
      'editorWidget.border': transparent,
      'editorSuggestWidget.selectedBackground': colors.hover,

      'peekView.border': transparent,

      'peekViewTitle.background': colors.popover,
      'peekViewTitleLabel.foreground': colors.primary,
      'peekViewTitleDescription.foreground': colors.foreground,

      'peekViewResult.background': colors.popover,
      'peekViewResult.matchHighlightBackground': colors.primary + '30',
      'peekViewResult.selectionBackground': colors.hover,
      'peekViewResult.selectionForeground': colors.foreground,
      'peekViewResult.lineForeground': colors.foreground,

      'peekViewEditor.background': colors.popover,
      'peekViewEditor.matchHighlightBackground': colors.primary + '30',

      'notificationCenterHeader.background': colors.hover,
      'notificationCenterHeader.foreground': colors.foreground,
      'notifications.background': colors.hover,
      'notifications.foreground': colors.foreground,
      'notifications.border': transparent,
      'notificationsInfoIcon.foreground': colors.primary,
      'notificationsWarningIcon.foreground': colors.warning,
      'notificationsErrorIcon.foreground': colors.error,

      'problemsInfoIcon.foreground': colors.primary,
      'problemsWarningIcon.foreground': colors.warning,
      'problemsErrorIcon.foreground': colors.error,

      'settings.headerForeground': colors.primary,
      'settings.focusedRowBackground': transparent,
      'settings.focusedRowBorder': transparent,
      'settings.modifiedItemIndicator': colors.primary,

      'progressBar.background': colors.primary,
      'tree.indentGuidesStroke': colors.card,

      'terminal.foreground': colors.foreground,
      'terminal.ansiBrightBlue': colors.syntax.variable,
      'terminal.ansiBrightGreen': colors.success,
      'terminal.ansiBrightRed': colors.syntax.bracket3,
      'terminal.ansiBrightYellow': colors.warning,
      'terminal.ansiBrightCyan': colors.syntax.property,

      'terminal.ansiBrightMagenta': colors.syntax.bracket1,

      'breadcrumb.foreground': colors.secondaryForeground,
      'breadcrumb.focusForeground': colors.foreground,
      'breadcrumb.activeSelectionForeground': colors.foreground,
      'breadcrumbPicker.background': colors.popover,

      'editorStickyScroll.background': colors.background + '80',
      'editorStickyScrollHover.background': colors.card
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
          foreground: colors.syntax.comment
        }
      },
      {
        scope: ['string', 'punctuation.definition.string'],
        settings: {
          foreground: colors.syntax.string
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
          foreground: colors.syntax.keyword
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
          foreground: colors.syntax.variable
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
          foreground: colors.syntax.attribute
        }
      },
      {
        scope: ['variable.other', 'punctuation.definition'],
        settings: {
          foreground: colors.syntax.property
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
          foreground: colors.syntax.function
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
          foreground: colors.syntax.constant
        }
      }
    ],
    semanticTokenColors: {}
  }
}

export type VsCodeTheme = ReturnType<typeof createVsCodeTheme>
