const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;
const sudo = require('sudo-prompt');

const app_dir = path.dirname(require.main.filename) + '/';
const workbench_file = path.normalize(
  app_dir + 'vs/code/electron-browser/workbench/workbench.html'
);
let extension_dir = '';

console.log(workbench_file);

const settings = {
  get(section) {
    return vscode.workspace.getConfiguration(section);
  },
  update(key, value) {
    return settings.get().update(key, value, vscode.ConfigurationTarget.Global);
  }
};

// todo: secondary button color when visible when deleting a file.
const updateTheme = async () => {
  const blue_intensity = {
    high: 80,
    medium: 50,
    low: 10
  };
  const lightness = {
    high: 5,
    medium: 0,
    low: -5
  };

  const hexVariant = ([h, s], l) => {
    l += lightness[settings.get('material-code').lightness];

    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // [hue,saturation]
  const primary = [202, 100];
  const neutral = [primary[0], blue_intensity[settings.get('material-code').blueIntensity]];
  const red = [350, 90];
  const green = [160, 100];
  const pink = [300, 90];
  const yellow = [71, 60];
  const colors = {
    neutral: hexVariant(neutral, 60),
    primary: hexVariant(primary, 60),
    foreground: hexVariant(neutral, 80),
    background: hexVariant(neutral, 10),
    surface: hexVariant(neutral, 15),
    surface2: hexVariant(neutral, 20),
    red: hexVariant(red, 60),
    green: hexVariant(green, 40),
    pink: hexVariant(pink, 60),
    yellow: hexVariant(yellow, 60),
    transparent: '#ffffff00'
  };
  const theme = {
    name: 'Material Code',
    type: 'dark',
    colors: {
      foreground: colors.foreground,
      'icon.foreground': colors.foreground,
      errorForeground: colors.red,
      focusBorder: colors.transparent,
      'selection.background': colors.primary + 60,
      'widget.shadow': colors.transparent,
      'sash.hoverBorder': colors.transparent,

      'button.background': hexVariant(primary, 30),
      'button.foreground': hexVariant(primary, 90),
      'button.secondaryForeground': hexVariant(primary, 90),
      'button.secondaryBackground': colors.transparent,

      'checkbox.background': colors.transparent,
      'checkbox.foreground': colors.primary,
      'checkbox.border': colors.primary,

      'dropdown.background': colors.surface,

      'input.background': colors.surface,
      'input.placeholderForeground': colors.neutral,
      'inputOption.activeBackground': hexVariant(primary, 30),
      'inputOption.activeForeground': hexVariant(primary, 90),
      'inputValidation.errorForeground': hexVariant(red, 10),
      'inputValidation.errorBorder': colors.transparent,

      'inputValidation.errorBackground': colors.red,

      'scrollbar.shadow': colors.transparent,
      'scrollbarSlider.background': colors.surface2,
      'scrollbarSlider.hoverBackground': colors.surface2,
      'scrollbarSlider.activeBackground': colors.surface2,

      'badge.background': hexVariant(primary, 30),
      'badge.foreground': hexVariant(primary, 90),

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

      'editorBracketMatch.background': colors.primary + 30,
      'editorBracketMatch.border': colors.primary,
      'editorBracketHighlight.foreground1': colors.pink,
      'editorBracketHighlight.foreground2': colors.yellow,
      'editorBracketHighlight.foreground3': colors.red,
      'editorBracketHighlight.foreground4': colors.green,
      'editorBracketPairGuide.activeBackground1': hexVariant(pink, 30),
      'editorBracketPairGuide.activeBackground2': hexVariant(yellow, 30),
      'editorBracketPairGuide.activeBackground3': hexVariant(red, 30),
      'editorBracketPairGuide.activeBackground4': hexVariant(green, 30),

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
      'peekViewResult.selectionBackground': hexVariant(primary, 30),
      'peekViewResult.selectionForeground': hexVariant(primary, 90),
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
        scope: ['comment', 'punctuation.definition.comment'],
        settings: {
          foreground: colors.neutral
        }
      },
      {
        scope: [
          '',
          'punctuation',
          'keyword',
          'keyword.other.unit',
          'constant.other',
          'support.constant'
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
          foreground: hexVariant(primary, 50)
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
          foreground: colors.primary
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
          foreground: hexVariant(red, 70)
        }
      },
      {
        scope: [
          'constant',
          'support.constant',
          'support.class',
          'entity.name.type',
          'keyword.other.unit'
        ],
        settings: {
          foreground: colors.yellow
        }
      }
    ]
  };

  return fs.writeFile(extension_dir + 'dark.json', JSON.stringify(theme));
};

const updateWorkbenchFile = async workbench_content => {
  const onUpdated = () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow');
  };
  try {
    await fs.writeFile(workbench_file, workbench_content);
    onUpdated();
  } catch (error) {
    const temp_workbench = extension_dir + 'workbench.html';
    await fs.writeFile(temp_workbench, workbench_content);
    const windows = process.platform.includes('win');
    const command = `${windows ? 'move' : 'mv'} "${temp_workbench}" "${workbench_file}"`;
    sudo.exec(command, { name: 'Material Code' }, error => {
      if (error) {
        fs.unlink(temp_workbench);
        const message = /EPERM|EACCES|ENOENT/.test(error.code)
          ? 'Permission denied. Run editor as admin and try again.'
          : error.message;
        vscode.window.showErrorMessage(message);
      } else {
        onUpdated();
      }
    });
  }
};

const removeStyles = async () => {
  let html = await fs.readFile(workbench_file, 'utf8');
  html = html.replace(/<!--material-code-->.*?<!--material-code-->/s, '');
  updateWorkbenchFile(html);
};

const applyStyles = async () => {
  let css = `
  .window-title {
    display: none;
  }

  [role=tab] {
    border-radius: 20px 20px 5px 5px;
  }

  [role=button],
  [role=tooltip],
  [role=dialog],
  .monaco-menu,
  .editor-widget, /* find widget */
  .menubar-menu-button, /* title bar menu buttons */
  .notifications-center {
    border-radius: 30px;
  }
  
  /* icon button */
  .codicon {
    border-radius: 30px !important;
  }
  
  .monaco-editor .suggest-widget, /* autocomplete */
  .quick-input-widget, /* command pallete */
  .notification-toast {
    border-radius: 30px;
    overflow: hidden;
  }
  
  input,
  select,
  /* extensions, settings search input */
  .suggest-input-container {
    border-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
  }
  
  /* .selected-text radius */
  .monaco-editor .top-left-radius {
    border-top-left-radius: 5px;
  }
  .monaco-editor .bottom-left-radius {
    border-bottom-left-radius: 5px;
  }
  .monaco-editor .top-right-radius {
    border-top-right-radius: 5px;
  }
  .monaco-editor .bottom-right-radius {
    border-bottom-right-radius: 5px;
  }
  
  /* ripple */
  .ripple-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: none;
  }
  .ripple {
    background-color: currentColor;
    opacity: 0.19;
    border-radius: 50%;
    position: absolute;
    -webkit-mask-image: radial-gradient(closest-side, #fff 65%, transparent);
  }
  `;
  const styles = settings.get('material-code').customStyles;
  for (const selector in styles) {
    css += selector + '{' + styles[selector] + '}';
  }

  const script = `
  const addListeners = (element, events, func, options = {}) => {
    events.split(' ').forEach(event => {
      element.addEventListener(event, func, options[event]);
    });
  };
  const removeListeners = (element, events, func) => {
    events.split(' ').forEach(event => {
      element.removeEventListener(event, func);
    });
  };
  const showRipple = event => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
    const corners = [
      { x: 0, y: 0 },
      { x: rect.width, y: 0 },
      { x: 0, y: rect.height },
      { x: rect.width, y: rect.height }
    ];
    let radius = 0;
    corners.forEach(corner => {
      const x_delta = x - corner.x;
      const y_delta = y - corner.y;
      const corner_distance = Math.sqrt(x_delta * x_delta + y_delta * y_delta);
      if (corner_distance > radius) {
        radius = corner_distance;
      }
    });
    // ripple soft edge size 65% of container.
    radius += radius * (65 / 100);
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.width = radius * 2 + 'px';
    ripple.style.height = ripple.style.width;
    ripple.style.left = x - radius + 'px';
    ripple.style.top = y - radius + 'px';
  
    const container = document.createElement('div');
    container.className = 'ripple-container';
    container.appendChild(ripple);
    element.appendChild(container);
    
    const ripple_animation = ripple.animate({ transform: ['scale(0.1)', 'scale(1)'] }, 400);
    const hideRipple = async () => {
      removeListeners(element, 'pointerup pointerleave', hideRipple);
      await ripple_animation.finished;
      const hide_animation = ripple.animate(
        { opacity: [getComputedStyle(ripple).opacity, 0] },
        { duration: 100, fill: 'forwards' }
      );
      await hide_animation.finished;
      ripple.remove();
      container.remove();
    };
    addListeners(element, 'pointerup pointerleave', hideRipple);
  };

  const applyRipple = () => {
    const elements = document.querySelectorAll('[role=button], [role=tab], .codicon, [role=listitem], [role=menuitem], [role=option], [role=treeitem], .scrollbar>.slider');
    elements.forEach(element => {
      if (element.showRipple) return;
      if (getComputedStyle(element).position == 'static') {
        element.style.position = 'relative';
      }
      element.showRipple = showRipple;
      element.addEventListener('pointerdown', element.showRipple);
    });
  }

  const onEditorUpdated = () => {
    applyRipple();

    // editor context menu rounded corner, inside shadow root.
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('.monaco-menu { border-radius: 30px; }');
    const host = document.querySelector('.shadow-root-host');
    if (host?.shadowRoot) {
      host.shadowRoot.adoptedStyleSheets = [sheet];
    }
  }

  let timeout = null;
  const observer = new MutationObserver(mutations => {
    const nodes_added = mutations.some(mutation => mutation.addedNodes.length);
    if (nodes_added) {
      clearTimeout(timeout);
      setTimeout(onEditorUpdated, 800);
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  `;
  const code = `<!--material-code--><style>${css}</style><script>${script}</script><!--material-code-->`;
  let html = await fs.readFile(workbench_file, 'utf8');
  html =
    html
      .replace(/<meta http-equiv="Content-Security-Policy".*>/g, '') // allow inline script tag.
      .replace(/<!--material-code-->.*?<!--material-code-->/s, '')
      .replace('</html>', '') +
    code +
    '</html>';
  updateWorkbenchFile(html);
};

const enableRecommendedSettings = async level => {
  settings.update('editor.bracketPairColorization.enabled', true);
  settings.update('editor.guides.bracketPairs', true);

  if (level == 'all') {
    // todo:
    // settings.update('editor.cursorBlinking', 'solid');
    // settings.update('workbench.activityBar.visible', false);
    // settings.update('mdb.sendTelemetry', false);
    // settings.update('telemetry.telemetryLevel', 'off');
  }
};

const activate = async context => {
   extension_dir = path.normalize(context.extensionPath + '/');

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', () => {
      context.globalState.update('styles_enabled', true);
      applyStyles();
    }),
    vscode.commands.registerCommand('material-code.removeStyles', () => {
      context.globalState.update('styles_enabled', false);
      removeStyles();
    })
  ];
  commands.forEach(command => context.subscriptions.push(command));

  const styles_enabled = context.globalState.get('styles_enabled');

  const first_run = typeof styles_enabled != 'boolean';
  if (first_run) {
    enableRecommendedSettings();
    context.globalState.update('styles_enabled', false);
    vscode.window
      .showInformationMessage('Apply styles to get rounded corners, ripple effect?', 'Apply')
      .then(response => {
        if (response == 'Apply') {
          vscode.commands.executeCommand('material-code.applyStyles');
        }
      });
  }

  const html = await fs.readFile(workbench_file, 'utf8');
  const injected = html.includes('material-code');
  if (styles_enabled && !injected) {
    vscode.window
      .showInformationMessage(
        "Visual Studio Code overwritten extension's applied styles.",
        'Re-apply'
      )
      .then(response => {
        if (response == 'Re-apply') {
          vscode.commands.executeCommand('material-code.applyStyles');
        }
      });
  }

  vscode.workspace.onDidChangeConfiguration(async event => {
    if (event.affectsConfiguration('material-code.customStyles')) {
      vscode.window
        .showInformationMessage('Custom styles setting modified.', 'Apply')
        .then(response => {
          if (response == 'Apply') {
            vscode.commands.executeCommand('material-code.applyStyles');
          }
        });
    }
    if (
      event.affectsConfiguration('material-code.blueIntensity') ||
      event.affectsConfiguration('material-code.lightness')
    ) {
      updateTheme();
    }
  });
};

const deactivate = () => {};

module.exports = {
  activate,
  deactivate
};

/*
todo: update checksums to fix installation corrupt warning.

const crypto = require('crypto');

const product_file = path.normalize(app_dir + '../product.json');

let product_content = JSON.parse(await fs.readFile(product_file, 'utf8'));
product_content.checksums['vs/code/electron-browser/workbench/workbench.html'] = crypto
  .createHash('md5')
  .update(Buffer.from(workbench_content))
  .digest('base64')
  .replace(/=+$/, '');
product_content = JSON.stringify(product_content, null, '\t');

try {
  await fs.writeFile(product_file, product_content);
} catch() {
  const temp_product = extension_dir + 'product.json';
  await fs.writeFile(temp_product, product_content);
  const command = `${windows ? 'move' : 'mv'} "${temp_workbench}" "${workbench_file}" && ${windows ? 'move' : 'mv'
}

fs.unlink(temp_product);
*/
