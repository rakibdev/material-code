import { type FlatMaterialColors } from 'material-colors'

export const themeOptions = {
  darkMode: true,
  colors: {
    primary: '#00adff',

    // Syntax colors.
    blue: '#0091ff',
    sky_blue: '#00adff',
    red: '#ff002b',
    green: '#00ffac',
    pink: '#ff00d9',
    yellow: '#ffee00'
  },
  tones: [80, 50, 40, 20] as const
}

type ThemeOptions = typeof themeOptions

export type SemanticColors = {
  background: string
  foreground: string
  muted: string // Secondary text, placeholders, inactive elements
  border: string

  primary: string // Buttons, links, badges, breakpoints, progress bars
  primaryForeground: string

  error: string
  errorForeground: string

  success: string // Success indicators, green terminal colors
  warning: string // Warning indicators, yellow terminal colors

  surface: string // Elevated panels, dropdowns, cards, tabs
  surfaceHover: string // Hover states, active selections

  // Syntax highlighting
  syntax: {
    comment: string // Comments and punctuation
    string: string // String literals
    keyword: string // Keywords, operators, control flow
    variable: string // Variables, tags, HTML elements
    attribute: string // HTML attributes, CSS selectors
    property: string // Object properties, CSS properties
    function: string // Functions, methods, CSS values
    constant: string // Numbers, constants, types

    // Bracket pair colors
    bracket1: string // First level brackets
    bracket2: string // Second level brackets
    bracket3: string // Third level brackets
    bracket4: string // Fourth level brackets
  }
}

export const createSemanticColors = (
  colors: FlatMaterialColors<ThemeOptions['colors'], ThemeOptions['tones']>
): SemanticColors => {
  return {
    background: colors.primary_surface,
    foreground: colors.neutral_20,
    muted: colors.neutral_40,
    border: colors.primary_surface_3,

    primary: colors.primary_40,
    primaryForeground: colors.primary_surface,

    error: colors.red_40,
    errorForeground: colors.red_20,
    success: colors.green_40,
    warning: colors.yellow_40,

    surface: colors.primary_surface_2,
    surfaceHover: colors.primary_surface_3,

    syntax: {
      comment: colors.neutral_40,
      string: colors.green_40,
      keyword: colors.pink_50,
      variable: colors.blue_50,
      attribute: colors.blue_40,
      property: colors.sky_blue_40,
      function: colors.red_50,
      constant: colors.yellow_40,

      bracket1: colors.pink_50,
      bracket2: colors.yellow_40,
      bracket3: colors.red_50,
      bracket4: colors.green_50
    }
  }
}

export const createEditorTheme = (colors: SemanticColors) => {
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

      'button.foreground': colors.primaryForeground,
      'button.background': colors.primary,
      'button.secondaryForeground': colors.muted,
      'button.secondaryBackground': colors.surfaceHover,

      'badge.background': colors.primary,
      'badge.foreground': colors.primaryForeground,
      'activityBarBadge.background': colors.primary,
      'activityBarBadge.foreground': colors.primaryForeground,

      'checkbox.background': transparent,
      'checkbox.foreground': colors.primary,
      'checkbox.border': colors.primary,

      'dropdown.background': colors.surface,

      'input.background': colors.surface,
      'input.placeholderForeground': colors.muted,
      'inputValidation.errorBackground': colors.error + '40',
      'inputValidation.errorForeground': colors.errorForeground,
      'inputValidation.errorBorder': transparent,

      'inputOption.activeBackground': colors.primary,
      'inputOption.activeForeground': colors.primaryForeground,
      'inputOption.activeBorder': transparent,

      'scrollbar.shadow': transparent,
      'scrollbarSlider.background': colors.surfaceHover,
      'scrollbarSlider.hoverBackground': colors.surfaceHover,
      'scrollbarSlider.activeBackground': colors.surfaceHover,

      'list.hoverBackground': colors.surfaceHover,
      'list.activeSelectionBackground': colors.surfaceHover,
      'list.activeSelectionForeground': colors.foreground,
      'list.inactiveSelectionBackground': colors.surface,
      'list.dropBackground': colors.primary + '50',
      'list.highlightForeground': colors.primary,
      'listFilterWidget.background': colors.surfaceHover,

      'activityBar.background': colors.background,
      'activityBar.foreground': colors.foreground,
      'activityBar.activeBorder': transparent,
      'activityBar.activeBackground': colors.surface,

      'sideBar.background': colors.background,
      'sideBar.foreground': colors.foreground,
      'sideBar.border': transparent,
      'sideBarSectionHeader.background': transparent,

      'editorGroup.dropBackground': colors.primary + '50',
      'editorGroup.border': colors.border,
      'editorGroupHeader.tabsBackground': colors.background,

      'tab.activeBackground': colors.surface,
      'tab.activeforeground': colors.foreground,
      'tab.hoverBackground': colors.surfaceHover,
      'tab.inactiveBackground': colors.background,
      'tab.inactiveForeground': colors.muted,
      'tab.border': transparent,

      'panel.background': colors.surface,
      'panel.border': transparent,
      'panel.dropBorder': colors.primary,
      'panelTitle.activeforeground': colors.foreground,
      'panelTitle.activeBorder': colors.foreground,
      'panelTitle.inactiveForeground': colors.muted,

      'outputView.background': colors.surface,

      'statusBar.debuggingBackground': colors.background,
      'debugIcon.breakpointForeground': colors.primary,
      'debugIcon.breakpointUnverifiedForeground': colors.primary,
      'editor.stackFrameHighlightBackground': colors.primary + '20',
      'debugIcon.breakpointCurrentStackframeForeground': colors.primary,

      'debugToolBar.background': colors.surface,
      'debugIcon.restartForeground': colors.success,
      'debugIcon.stepOverForeground': colors.primary,
      'debugIcon.stepIntoForeground': colors.primary,
      'debugIcon.stepOutForeground': colors.primary,
      'debugIcon.continueForeground': colors.primary,

      'debugTokenExpression.name': colors.syntax.attribute,
      'debugTokenExpression.value': colors.muted,
      'debugTokenExpression.string': colors.success,
      'debugTokenExpression.number': colors.warning,
      'debugTokenExpression.boolean': colors.warning,
      'debugTokenExpression.error': colors.error,

      'editorGutter.foldingControlForeground': colors.muted,

      'editorGutter.modifiedBackground': colors.primary,
      'editorGutter.addedBackground': colors.success + '80',
      'editorGutter.deletedBackground': colors.error + '80',

      'diffEditor.diagonalFill': colors.border + '50',
      'diffEditor.insertedTextBackground': transparent,
      'diffEditor.removedTextBackground': transparent,
      'diffEditor.insertedLineBackground': colors.success + '20',
      'diffEditor.removedLineBackground': colors.error + '20',

      'editorRuler.foreground': colors.surface,
      'editorWhitespace.foreground': colors.muted,

      'editorHoverWidget.background': colors.surface,
      'editorHoverWidget.border': transparent,

      'editorOverviewRuler.border': transparent,
      'editorOverviewRuler.errorForeground': colors.error,
      'editorOverviewRuler.findMatchForeground': colors.primary,
      'editorOverviewRuler.infoForeground': colors.success,
      'editorOverviewRuler.warningForeground': colors.warning,

      'menubar.selectionBackground': colors.surface,
      'menu.background': colors.surface,
      'menu.foreground': colors.foreground,
      'menu.selectionBackground': colors.surfaceHover,
      'menu.separatorBackground': transparent,

      'pickerGroup.border': transparent,
      'pickerGroup.foreground': colors.primary,

      'keybindingLabel.background': colors.surfaceHover,
      'keybindingLabel.foreground': colors.foreground,
      'keybindingLabel.border': transparent,
      'keybindingLabel.bottomBorder': transparent,

      'titleBar.activeBackground': colors.background,
      'titleBar.activeforeground': colors.foreground,
      'titleBar.inactiveBackground': colors.background,
      'titleBar.inactiveforeground': colors.foreground,

      'statusBar.background': colors.background,
      'statusBar.foreground': colors.foreground,
      'statusBar.border': transparent,
      'statusBar.focusBorder': transparent,
      'statusBar.noFolderBackground': colors.background,
      'statusBarItem.hoverBackground': colors.surface,
      'statusBarItem.activeBackground': colors.surface,
      'statusBarItem.remoteBackground': colors.background,
      'statusBarItem.remoteforeground': colors.foreground,

      'editor.background': colors.background,
      'editor.foreground': colors.foreground,
      'editor.lineHighlightBackground': colors.primary + '10',
      'editor.selectionBackground': colors.surfaceHover,
      'editor.wordHighlightBackground': colors.primary + '30',
      'editor.findMatchBackground': colors.primary + '30',
      'editor.findMatchHighlightBackground': colors.primary + '30',
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

      'editorIndentGuide.activeBackground': colors.surface,
      'editorIndentGuide.background': transparent,
      'editorInfo.foreground': colors.foreground,
      'editorError.foreground': colors.error,
      'editorWarning.foreground': colors.warning,
      'editorLink.activeforeground': colors.foreground,

      'editorLineNumber.foreground': colors.border,
      'editorLineNumber.activeForeground': colors.muted,

      'editorWidget.background': colors.surface,
      'editorWidget.border': transparent,
      'editorSuggestWidget.selectedBackground': colors.surfaceHover,

      'peekView.border': transparent,

      'peekViewTitle.background': colors.surface,
      'peekViewTitleLabel.foreground': colors.primary,
      'peekViewTitleDescription.foreground': colors.foreground,

      'peekViewResult.background': colors.surface,
      'peekViewResult.matchHighlightBackground': colors.primary + '30',
      'peekViewResult.selectionBackground': colors.surfaceHover,
      'peekViewResult.selectionForeground': colors.foreground,
      'peekViewResult.lineforeground': colors.foreground,

      'peekViewEditor.background': colors.surface,
      'peekViewEditor.matchHighlightBackground': colors.primary + '30',

      'notificationCenterHeader.background': colors.surfaceHover,
      'notifications.background': colors.surfaceHover,
      'notificationsInfoIcon.foreground': colors.primary,

      'problemsInfoIcon.foreground': colors.primary,

      'settings.headerForeground': colors.primary,
      'settings.focusedRowBackground': transparent,
      'settings.focusedRowBorder': transparent,
      'settings.modifiedItemIndicator': colors.primary,

      'progressBar.background': colors.primary,
      'tree.indentGuidesStroke': colors.surface,

      'terminal.foreground': colors.foreground,
      'terminal.ansiBrightBlue': colors.syntax.variable,
      'terminal.ansiBrightGreen': colors.success,
      'terminal.ansiBrightRed': colors.syntax.bracket3,
      'terminal.ansiBrightYellow': colors.warning,
      'terminal.ansiBrightCyan': colors.syntax.property,

      'terminal.ansiBrightMagenta': colors.syntax.bracket1,

      'breadcrumb.foreground': colors.muted,
      'breadcrumb.focusforeground': colors.foreground,
      'breadcrumb.activeSelectionForeground': colors.foreground,
      'breadcrumbPicker.background': colors.surface,

      'editorStickyScroll.background': colors.background + '80',
      'editorStickyScrollHover.background': colors.surface
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

export type Theme = ReturnType<typeof createEditorTheme>
