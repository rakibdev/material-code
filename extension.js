import vscode from 'vscode';
import path from 'path';
import sudo from 'sudo-prompt';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import { Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

const app_dir = path.dirname(require.main.filename);
const workbench_file = path.normalize(
  app_dir + '/vs/code/electron-browser/workbench/workbench.html'
);
const product_file = path.normalize(app_dir + '/../product.json');
let extension_dir = '';

const storage = {
  async get(key) {
    try {
      const data = JSON.parse(await fs.readFile(extension_dir + 'storage.json', 'utf8'));
      return key ? data[key] : data;
    } catch (error) {
      return {};
    }
  },
  async set(key, value) {
    const data = await storage.get();
    data[key] = value;
    return fs.writeFile(extension_dir + 'storage.json', JSON.stringify(data));
  }
};

const settings = {
  get(key) {
    return vscode.workspace.getConfiguration('material-code')[key];
  }
  // update(key, value) {
  //   return settings.get().update(key, value, vscode.ConfigurationTarget.Global);
  // }
};

// todo: secondary button color when visible while deleting a file.
const updateTheme = async () => {
  const colorfulness = {
    high: 40,
    medium: 20,
    low: 8
  };
  const brightness = {
    high: 3,
    medium: 0,
    low: -3
  };

  const hexTone = (hct, tone) => {
    const shift = brightness[settings.get('brightness')];
    return hexFromArgb(Hct.from(hct.hue, hct.chroma, tone + shift).toInt());
  };

  const primary = Hct.fromInt(argbFromHex('#00adff'));
  const red = Hct.fromInt(argbFromHex('#ff002b'));
  const green = Hct.fromInt(argbFromHex('#00ffac'));
  const pink = Hct.fromInt(argbFromHex('#ff00bb'));
  const yellow = Hct.fromInt(argbFromHex('#fff700'));
  const neutral = Hct.from(primary.hue, colorfulness[settings.get('colorfulness')], primary.tone);

  const colors = {
    neutral: hexTone(neutral, 60),
    primary: hexTone(primary, 60),
    foreground: hexTone(neutral, 80),
    background: hexTone(neutral, 5),
    surface: hexTone(neutral, 10),
    surface2: hexTone(neutral, 16),
    red: hexTone(red, 60),
    green: hexTone(green, 60),
    pink: hexTone(pink, 60),
    yellow: hexTone(yellow, 70),
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

  // fixes installation corrupt warning.
  // requires editor full restart to see effect not just reload window.
  let product_content = JSON.parse(await fs.readFile(product_file, 'utf8'));
  product_content.checksums[path.normalize('vs/code/electron-browser/workbench/workbench.html')] =
    crypto
      .createHash('md5')
      .update(Buffer.from(workbench_content))
      .digest('base64')
      .replace(/=+$/, '');
  product_content = JSON.stringify(product_content, null, '\t');

  try {
    await fs.writeFile(workbench_file, workbench_content);
    await fs.writeFile(product_file, product_content);
    onUpdated();
  } catch (error) {
    const temp_workbench = extension_dir + 'workbench.html';
    const temp_product = extension_dir + 'product.json';
    await fs.writeFile(temp_workbench, workbench_content);
    await fs.writeFile(temp_product, product_content);
    const move_command = process.platform.includes('win') ? 'move' : 'mv';
    const command = `${move_command} "${temp_workbench}" "${workbench_file}" && ${move_command} "${temp_product}" "${product_file}"`;
    sudo.exec(command, { name: 'Material Code' }, error => {
      if (error) {
        fs.unlink(temp_workbench);
        fs.unlink(temp_product);
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
    border-radius: 20px;
  }
  
  /* icon button */
  .codicon {
    border-radius: 20px !important;
  }

  .monaco-editor .suggest-widget, /* autocomplete */
  .quick-input-widget, /* command pallete */
  .notification-toast {
    border-radius: 20px;
    overflow: hidden;
  }
  
  input,
  select,
  .monaco-inputbox,
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
  const custom = settings.get('customCSS');
  for (const selector in custom) {
    css += selector + '{' + custom[selector] + '}';
  }
  const font = settings.get('font');
  if (font) {
    css += `.mac, .windows, .linux { font-family: ${font}; }`;
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

    // editor context menu rounded corner, inject in shadow root.
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
      .replace(/<meta http-equiv="Content-Security-Policy".*>/g, '') // allows running inline script tag.
      .replace(/<!--material-code-->.*?<!--material-code-->/s, '')
      .replace('</html>', '') +
    code +
    '</html>';
  updateWorkbenchFile(html);
};

const activate = async context => {
  extension_dir = path.normalize(context.extensionPath + '/');

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', async () => {
      await storage.set('styles_applied', true);
      applyStyles();
    }),
    vscode.commands.registerCommand('material-code.removeStyles', async () => {
      await storage.set('styles_applied', false);
      removeStyles();
    })
  ];
  commands.forEach(command => context.subscriptions.push(command));

  /*
  const extensionUpdated = async () => {
    if (version != previous_version) {
      if (typeof previous_version == 'undefined') {
        onInstall();
      } else {
        onUpdate();
      }
    }
    const version = context.extension.packageJSON.version;
    const last_version = context.globalState.get('version') ?? '';
    context.globalState.update('version', version);
    const version_parts = version.split('.');
    const last_version_parts = last_version.split('.');
    for (let i = 0; i < version_parts.length; i++) {
      if (parseInt(version_parts[i]) > parseInt(last_version_parts[i])) return true;
    }
  };
  */

  const new_installed = typeof (await storage.get('styles_applied')) != 'boolean';
  if (new_installed) {
    await storage.set('styles_applied', false);
    vscode.window
      .showInformationMessage(
        'Inject styles to get rounded corners, ripple effect and more? This will modify installation files.',
        'Apply'
      )
      .then(action => {
        if (action == 'Apply') {
          vscode.commands.executeCommand('material-code.applyStyles');
        }
      });
  }

  const workbench_html = await fs.readFile(workbench_file, 'utf8');
  const styles_applied = await storage.get('styles_applied');
  const injected = workbench_html.includes('material-code');
  if (styles_applied && !injected) {
    vscode.window
      .showInformationMessage(
        "Visual Studio Code overwritten extension's injected styles.",
        'Re-apply'
      )
      .then(action => {
        if (action == 'Re-apply') {
          vscode.commands.executeCommand('material-code.applyStyles');
        }
      });
  }

  vscode.workspace.onDidChangeConfiguration(event => {
    if (
      event.affectsConfiguration('material-code.colorfulness') ||
      event.affectsConfiguration('material-code.brightness')
    ) {
      updateTheme();
    }

    if (
      event.affectsConfiguration('material-code.font') ||
      event.affectsConfiguration('material-code.customCSS')
    ) {
      vscode.window.showInformationMessage('Style settings changed.', 'Apply').then(action => {
        if (action == 'Apply') vscode.commands.executeCommand('material-code.applyStyles');
      });
    }
  });

  // "reload extension host" to see effect.
  if (process.env.DEV_MODE) updateTheme();
};

const deactivate = () => {};

module.exports = {
  activate,
  deactivate
};
