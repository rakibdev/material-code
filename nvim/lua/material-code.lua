local materialColors = require('material-colors')

local M = {}

local syntaxHues = {
  green  = '#00ffac',
  pink   = '#ff00d9',
  blue   = '#0091ff',
  yellow = '#ffee00',
}

local function blend(fg, bg, alpha)
  local r = math.floor(tonumber(fg:sub(2,3),16) * alpha + tonumber(bg:sub(2,3),16) * (1-alpha) + 0.5)
  local g = math.floor(tonumber(fg:sub(4,5),16) * alpha + tonumber(bg:sub(4,5),16) * (1-alpha) + 0.5)
  local b = math.floor(tonumber(fg:sub(6,7),16) * alpha + tonumber(bg:sub(6,7),16) * (1-alpha) + 0.5)
  return string.format('#%02x%02x%02x', r, g, b)
end

function M.createSyntaxColors(primaryHex, dark)
  local primaryHct = materialColors.hexToHct(primaryHex or materialColors.primary)
  local errorHct   = materialColors.hexToHct(materialColors.error)
  local greenHct   = materialColors.hexToHct(syntaxHues.green)
  local pinkHct    = materialColors.hexToHct(syntaxHues.pink)
  local blueHct    = materialColors.hexToHct(syntaxHues.blue)
  local yellowHct  = materialColors.hexToHct(syntaxHues.yellow)

  local chroma = dark and 90 or 120
  local tone   = dark and 60 or 48
  local text   = materialColors.createTextVariants(primaryHct, dark)

  return {
    comment   = text.mutedForeground,
    string    = materialColors.hctToHex(greenHct.hue,    chroma, tone),
    keyword   = materialColors.hctToHex(pinkHct.hue,     chroma, tone),
    variable  = materialColors.hctToHex(blueHct.hue,     chroma, dark and 50 or tone),
    attribute = materialColors.hctToHex(primaryHct.hue,  chroma, dark and 70 or tone),
    property  = materialColors.hctToHex(primaryHct.hue,  chroma, tone),
    ["function"] = materialColors.hctToHex(errorHct.hue, dark and 70 or 90, tone),
    constant  = materialColors.hctToHex(yellowHct.hue,   chroma, dark and 70 or 60),
  }
end

function M.createNeovimTheme(colors)
  local primaryHct = materialColors.hexToHct(colors.primary)

  local red    = materialColors.createPrimaryVariants(materialColors.hexToHct(materialColors.error),   colors.darkMode).color
  local green  = materialColors.createPrimaryVariants(materialColors.hexToHct(syntaxHues.green),  colors.darkMode).color
  local yellow = materialColors.createPrimaryVariants(materialColors.hexToHct(syntaxHues.yellow), colors.darkMode).color
  local pink   = materialColors.createPrimaryVariants(materialColors.hexToHct(syntaxHues.pink),   colors.darkMode).color
  local cyan   = materialColors.createPrimaryVariants(materialColors.hexToHct(syntaxHues.blue),   colors.darkMode).color

  M.colors = vim.tbl_extend('force', colors, { red = red, green = green, yellow = yellow, pink = pink, cyan = cyan })

  local greenHct = materialColors.hexToHct(syntaxHues.green)
  local errorHct = materialColors.hexToHct(materialColors.error)
  local bgTone = colors.darkMode and 16 or 92

  local searchBg = blend(colors.primary, colors.background, 0.3)
  local matchBg = materialColors.hctToHex(primaryHct.hue, 16, bgTone)
  -- Lower chroma keeps syntax highlighting legible over diff backgrounds
  local bgChroma = 20
  local wordBgChroma = 24
  local diffAdd = materialColors.hctToHex(greenHct.hue, bgChroma, bgTone)
  local diffDel = materialColors.hctToHex(errorHct.hue, bgChroma, bgTone)
  local wordBgTone = colors.darkMode and 30 or 82
  local diffAddWord = materialColors.hctToHex(greenHct.hue, wordBgChroma, wordBgTone)
  local diffDelWord = materialColors.hctToHex(errorHct.hue, wordBgChroma, wordBgTone)

  return {
    Normal              = { fg = colors.foreground, bg = colors.background },
    NormalNC            = { fg = colors.foreground, bg = colors.background },
    NormalFloat         = { fg = colors.foreground, bg = colors.popover },
    FloatBorder         = { fg = colors.border, bg = colors.popover },
    SignColumn          = { bg = 'none' },
    FoldColumn          = { bg = 'none',  fg = colors.secondary },
    Folded              = { bg = colors.card,     fg = colors.mutedForeground },
    EndOfBuffer         = { fg = colors.background },
    WinSeparator        = { fg = colors.border },
    ColorColumn         = { bg = colors.card },
    Conceal             = { fg = colors.mutedForeground },
    NonText             = { fg = colors.hover },
    SpecialKey          = { fg = colors.hover },

    Cursor              = { fg = colors.background,      bg = colors.foreground },
    CursorLine          = { bg = colors.card },
    CursorLineNr        = { fg = colors.foreground,      bold = true },
    LineNr              = { fg = colors.mutedForeground },

    Visual              = { bg = colors.hover },
    VisualNOS           = { bg = colors.hover },
    Search              = { bg = searchBg, fg = colors.foreground },
    IncSearch           = { bg = colors.primary, fg = colors.primaryForeground, bold = true },
    CurSearch           = { bg = colors.primary, fg = colors.primaryForeground, bold = true },
    Substitute          = { bg = colors.syntax['function'], fg = colors.background },

    StatusLine          = { bg = colors.background,  fg = colors.foreground },
    StatusLineNC        = { bg = colors.background,  fg = colors.mutedForeground },
    TabLine             = { bg = colors.background,  fg = colors.mutedForeground },
    TabLineSel          = { bg = colors.card, fg = colors.foreground },
    TabLineFill         = { bg = colors.background },
    Pmenu               = { bg = colors.popover, fg = colors.foreground },
    PmenuSel            = { bg = colors.secondary, fg = colors.secondaryForeground },
    PmenuSbar           = { bg = colors.hover },
    PmenuThumb          = { bg = colors.mutedForeground },
    MatchParen          = { bg = blend(colors.primary, colors.background, 0.4), bold = true },
    QuickFixLine        = { bg = colors.hover },
    qfLineNr            = { fg = colors.mutedForeground },

    Comment             = { fg = colors.syntax.comment },
    String              = { fg = colors.syntax.string },
    Character           = { fg = colors.syntax.string },
    Number              = { fg = colors.syntax.constant },
    Boolean             = { fg = colors.syntax.constant },
    Float               = { fg = colors.syntax.constant },
    Constant            = { fg = colors.syntax.constant },
    Identifier          = { fg = colors.foreground },
    Function            = { fg = colors.syntax['function'] },
    Statement           = { fg = colors.syntax.keyword },
    Conditional         = { fg = colors.syntax.keyword },
    Repeat              = { fg = colors.syntax.keyword },
    Label               = { fg = colors.syntax.keyword },
    Operator            = { fg = colors.syntax.keyword },
    Keyword             = { fg = colors.syntax.keyword },
    Exception           = { fg = colors.syntax.keyword },
    PreProc             = { fg = colors.syntax.keyword },
    Include             = { fg = colors.syntax.keyword },
    Define              = { fg = colors.syntax.keyword },
    Macro               = { fg = colors.syntax.keyword },
    PreCondit           = { fg = colors.syntax.keyword },
    Type                = { fg = colors.syntax.constant },
    StorageClass        = { fg = colors.syntax.keyword },
    Structure           = { fg = colors.syntax.constant },
    Typedef             = { fg = colors.syntax.constant },
    Special             = { fg = colors.syntax.attribute },
    SpecialChar         = { fg = colors.syntax.attribute },
    Tag                 = { fg = colors.syntax.variable },
    Delimiter           = { fg = colors.mutedForeground },
    SpecialComment      = { fg = colors.mutedForeground },
    Debug               = { fg = red },
    Underlined          = { underline = true },
    Error               = { fg = red },
    Todo                = { fg = colors.background,     bg = yellow, bold = true },
    Title               = { fg = colors.primary, bold = true },

    ['@comment']               = { fg = colors.syntax.comment },
    ['@string']                = { fg = colors.syntax.string },
    ['@string.escape']         = { fg = colors.syntax.attribute },
    ['@string.regex']          = { fg = colors.syntax.string },
    ['@number']                = { fg = colors.syntax.constant },
    ['@boolean']               = { fg = colors.syntax.constant },
    ['@float']                 = { fg = colors.syntax.constant },
    ['@constant']              = { fg = colors.syntax.constant },
    ['@constant.builtin']      = { fg = colors.syntax.constant },
    ['@constant.macro']        = { fg = colors.syntax.constant },
    ['@keyword']               = { fg = colors.syntax.keyword },
    ['@keyword.function']      = { fg = colors.syntax.keyword },
    ['@keyword.operator']      = { fg = colors.syntax.keyword },
    ['@keyword.return']        = { fg = colors.syntax.keyword },
    ['@conditional']           = { fg = colors.syntax.keyword },
    ['@repeat']                = { fg = colors.syntax.keyword },
    ['@exception']             = { fg = colors.syntax.keyword },
    ['@include']               = { fg = colors.syntax.keyword },
    ['@operator']              = { fg = colors.syntax.keyword },
    ['@label']                 = { fg = colors.syntax.keyword },
    ['@storageclass']          = { fg = colors.syntax.keyword },
    ['@function']              = { fg = colors.syntax['function'] },
    ['@function.builtin']      = { fg = colors.syntax['function'] },
    ['@function.call']         = { fg = colors.syntax['function'] },
    ['@function.macro']        = { fg = colors.syntax['function'] },
    ['@method']                = { fg = colors.syntax['function'] },
    ['@method.call']           = { fg = colors.syntax['function'] },
    ['@constructor']           = { fg = colors.syntax['function'] },
    ['@parameter']             = { fg = colors.foreground },
    ['@variable']              = { fg = colors.foreground },
    ['@variable.builtin']      = { fg = colors.syntax.attribute },
    ['@field']                 = { fg = colors.syntax.property },
    ['@property']              = { fg = colors.syntax.property },
    ['@type']                  = { fg = colors.syntax.constant },
    ['@type.builtin']          = { fg = colors.syntax.constant },
    ['@type.qualifier']        = { fg = colors.syntax.keyword },
    ['@namespace']             = { fg = colors.syntax.attribute },
    ['@attribute']             = { fg = colors.syntax.attribute },
    ['@tag']                   = { fg = colors.syntax.variable },
    ['@tag.attribute']         = { fg = colors.syntax.attribute },
    ['@tag.delimiter']         = { fg = colors.mutedForeground },
    ['@punctuation.bracket']   = { fg = colors.secondaryForeground },
    ['@punctuation.delimiter'] = { fg = colors.mutedForeground },
    ['@punctuation.special']   = { fg = colors.syntax.keyword },
    ['@text.title']            = { fg = colors.primary, bold = true },
    ['@text.uri']              = { fg = colors.syntax.property,    underline = true },
    ['@text.strong']           = { bold = true },
    ['@text.emphasis']         = { italic = true },
    ['@text.literal']          = { fg = colors.syntax.string },
    ['@text.reference']        = { fg = colors.primary },
    ['@text.note']             = { fg = colors.primary },
    ['@text.warning']          = { fg = yellow },
    ['@text.danger']           = { fg = red },
    ['@diff.plus']             = { fg = green },
    ['@diff.minus']            = { fg = red },
    ['@diff.delta']            = { fg = yellow },

    DiagnosticError            = { fg = red },
    DiagnosticWarn             = { fg = yellow },
    DiagnosticInfo             = { fg = colors.primary },
    DiagnosticHint             = { fg = colors.mutedForeground },
    DiagnosticUnderlineError   = { undercurl = true, sp = red },
    DiagnosticUnderlineWarn    = { undercurl = true, sp = yellow },
    DiagnosticUnderlineInfo    = { undercurl = true, sp = colors.primary },
    DiagnosticUnderlineHint    = { undercurl = true, sp = colors.mutedForeground },
    DiagnosticVirtualTextError = { fg = red,     bg = diffDel },
    DiagnosticVirtualTextWarn  = { fg = yellow,  bg = blend(yellow, colors.background, 0.15) },
    DiagnosticVirtualTextInfo  = { fg = colors.primary, bg = matchBg },
    DiagnosticVirtualTextHint  = { fg = colors.mutedForeground },
    DiagnosticSignError        = { fg = red },
    DiagnosticSignWarn         = { fg = yellow },
    DiagnosticSignInfo         = { fg = colors.primary },
    DiagnosticSignHint         = { fg = colors.mutedForeground },

    DiffAdd        = { bg = diffAdd },
    DiffDelete     = { bg = diffDel },
    DiffChange     = { bg = diffAdd },
    DiffText       = { bg = diffAddWord },
    DiffAddWord    = { bg = diffAddWord },
    DiffDeleteWord = { bg = diffDelWord },
    Added          = { fg = green },
    Removed        = { fg = red },
    Changed        = { fg = yellow },

    GitSignsAdd    = { fg = green },
    GitSignsChange = { fg = colors.primary },
    GitSignsDelete = { fg = red },

    LspReferenceText  = { bg = matchBg },
    LspReferenceRead  = { bg = matchBg },
    LspReferenceWrite = { bg = searchBg },
  }
end

function M.apply(highlights, dark)
  vim.o.background = (dark == false) and 'light' or 'dark'
  vim.cmd('hi clear')
  if vim.fn.exists('syntax_on') == 1 then vim.cmd('syntax reset') end
  vim.g.colors_name = 'material-code'
  for group, opts in pairs(highlights) do
    vim.api.nvim_set_hl(0, group, opts)
  end
end

return M
