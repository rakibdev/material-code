import vscode from 'vscode'
import sudo from '@vscode/sudo-prompt'
import path from 'path'
import crypto from 'crypto'
import { promises as fs } from 'fs'

const app_dir = path.dirname(require.main.filename)
const workbench_file = path.normalize(app_dir + '/vs/code/electron-sandbox/workbench/workbench.html')
const workbench_file_relative = path.normalize('vs/code/electron-sandbox/workbench/workbench.html')
const product_file = path.normalize(app_dir + '/../product.json')

const storage = {
  dir: '',
  data: {},
  async initialize(extension_context) {
    storage.dir = path.normalize(extension_context.globalStorageUri.path + '/')
    await fs.mkdir(storage.dir, { recursive: true })
    try {
      storage.data = JSON.parse(await fs.readFile(storage.dir + 'storage.json', 'utf8'))
    } catch {}
  },
  get(key) {
    return key ? storage.data[key] : storage.data
  },
  set(key, value) {
    storage.data[key] = value
    return fs.writeFile(storage.dir + 'storage.json', JSON.stringify(storage.data))
  }
}

const settings = {
  get(key) {
    return vscode.workspace.getConfiguration('material-code')[key]
  }
}

const updateWorkbenchFile = async workbench_html => {
  const onSuccess = () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow')
      }

  // updates checksums to fix installation corrupt warning.
  // requires editor full restart to see effect not just reload window.
  let product_json = JSON.parse(await fs.readFile(product_file, 'utf8'))
  product_json.checksums[workbench_file_relative] = crypto
      .createHash('md5')
    .update(Buffer.from(workbench_html))
      .digest('base64')
    .replace(/=+$/, '')
  product_json = JSON.stringify(product_json, null, '\t')

  try {
    await fs.writeFile(workbench_file, workbench_html)
    await fs.writeFile(product_file, product_json)
    onSuccess()
  } catch (error) {
    const temp_workbench = storage.dir + 'workbench.html'
    const temp_product = storage.dir + 'product.json'
    await fs.writeFile(temp_workbench, workbench_html)
    await fs.writeFile(temp_product, product_json)
    const move_command = process.platform.includes('win') ? 'move' : 'mv'
    const command = `${move_command} "${temp_workbench}" "${workbench_file}" && ${move_command} "${temp_product}" "${product_file}"`
    sudo.exec(command, { name: 'Material Code' }, error => {
      if (error) {
        fs.unlink(temp_workbench)
        fs.unlink(temp_product)
        const message = /EPERM|EACCES|ENOENT/.test(error.code)
          ? 'Permission denied. Run editor as admin and try again.'
          : error.message
        vscode.window.showErrorMessage(message, 'Report on GitHub').then(async action => {
          if (action == 'Report on GitHub') return '' // todo: create issue with prefilled text
        })
      } else onSuccess()
    })
      }
  }

const removeInjectedCode = workbench_html => workbench_html.replace(/<!--material-code-->.*?<!--material-code-->/s, '')

const removeStyles = async () => {
  const html = await fs.readFile(workbench_file, 'utf8')
  updateWorkbenchFile(removeInjectedCode(html))
}

const applyStyles = async () => {
  let css = `
  body {
    --radius: 20px;
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
    border-radius: var(--radius) !important;
  }
  
  /* icon button */
  .codicon {
    border-radius: 20px !important;
  }

  .monaco-editor .suggest-widget, /* autocomplete */
  .quick-input-widget, /* command pallete */
  .notification-toast {
    border-radius: var(--radius) !important;
    overflow: hidden;
  }
  
  /* icon button */
  .codicon {
    border-radius: var(--radius);
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
      element.addEventListener(event, func, options[event])
    })
  }
  
  const removeListeners = (element, events, func) => {
    events.split(' ').forEach(event => {
      element.removeEventListener(event, func)
    })
  }

  const showRipple = (element, event) => {
    const rect = element.getBoundingClientRect()
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2
    const corners = [
      { x: 0, y: 0 },
      { x: rect.width, y: 0 },
      { x: 0, y: rect.height },
      { x: rect.width, y: rect.height }
    ]
    let radius = 0
    corners.forEach(corner => {
      const x_delta = x - corner.x
      const y_delta = y - corner.y
      const corner_distance = Math.sqrt(x_delta * x_delta + y_delta * y_delta)
      if (corner_distance > radius) {
        radius = corner_distance
      }
    })
    // ripple soft edge size 65% of container.
    radius += radius * (65 / 100)
    const ripple = document.createElement('div')
    ripple.className = 'ripple'
    ripple.style.width = radius * 2 + 'px'
    ripple.style.height = ripple.style.width
    ripple.style.left = x - radius + 'px'
    ripple.style.top = y - radius + 'px'
  
    const container = document.createElement('div')
    container.className = 'ripple-container'
    container.appendChild(ripple)
    element.appendChild(container)
    
    const ripple_animation = ripple.animate({ transform: ['scale(0.1)', 'scale(1)'] }, 400)
    const hideRipple = async () => {
      removeListeners(element, 'pointerup pointerleave', hideRipple)
      await ripple_animation.finished
      const hide_animation = ripple.animate(
        { opacity: [getComputedStyle(ripple).opacity, 0] },
        { duration: 100, fill: 'forwards' }
      )
      await hide_animation.finished
      ripple.remove()
      container.remove()
    }
    addListeners(element, 'pointerup pointerleave', hideRipple)
  }

  const findParent = (element, selector) => {
    const max_depth = 5
    let count = 0
    while (element) {
      if (element.matches(selector)) return element
      element = element.parentElement
      if (++count > max_depth) return
      }
  }

  const applyContextMenuStyles = () => {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync('.monaco-menu-container { border-radius: var(--radius) !important; overflow: hidden; }')
    const host = document.querySelector('.shadow-root-host')
    if (host?.shadowRoot) host.shadowRoot.adoptedStyleSheets = [sheet]
  }

  document.body.addEventListener('pointerdown', event => {
    const mouse_right_click = event.button == 2
    if (mouse_right_click) return setTimeout(applyContextMenuStyles, 30)

    const ripple_element = findParent(
      event.target,
      '[role=button], [role=tab], [role=listitem], [role=treeitem], [role=menuitem], [role=option], .scrollbar > .slider'
    )
    if (ripple_element) {
      if (getComputedStyle(ripple_element).position == 'static') ripple_element.style.position = 'relative'
      showRipple(ripple_element, event)
    }
  })
  `

  let html = await fs.readFile(workbench_file, 'utf8')
  html = removeInjectedCode(html)
    .replace(/<meta.*http-equiv="Content-Security-Policy".*?>/s, '')
    .replace(
      '</html>',
      `<!--material-code--><style>${css}</style><script>${script}</script><!--material-code-->\n</html>`
    )
  updateWorkbenchFile(html)
  }

const isNewVersion = (current, previous) => {
  current = current.split('.')
  previous = previous.split('.')
  for (let i = 0; i < current.length; i++) {
    if (parseInt(current[i]) > parseInt(previous[i])) return true
  }
    }

module.exports.activate = async context => {
  await storage.initialize(context)

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', async () => {
      await storage.set('styles_enabled', true)
      applyStyles()
    }),
    vscode.commands.registerCommand('material-code.removeStyles', async () => {
      await storage.set('styles_enabled', false)
      removeStyles()
    })
  ]
  commands.forEach(command => context.subscriptions.push(command))

  const version = storage.get().version
  const package_version = context.extension.packageJSON.version
  if (version != package_version) {
    storage.set('version', package_version)
    if (version) {
      if (isNewVersion(package_version, version)) {
    vscode.window
      .showInformationMessage(
            `Material Code was updated from v${version} to v${package_version}!`,
            'Open changelog'
      )
      .then(action => {
            if (action == 'Open changelog') return '' // todo: open github releases page
          })
        }
    } else {
    vscode.window
      .showInformationMessage(
          'Material Code is installed! Apply styles from command palette to get rounded corners, ripple effect.',
          ['Open GitHub README']
      )
      .then(action => {
          if (action == 'Open GitHub README') return '' // todo: open github readme page
        })
        }
  }

  const workbench_html = await fs.readFile(workbench_file, 'utf8')
  const code_injected = workbench_html.includes('material-code')
  const styles_enabled = storage.get('styles_enabled')
  if (styles_enabled && !code_injected) {
    vscode.window
      .showInformationMessage("Visual Studio Code update reverted Material Code's styles.", 'Re-apply')
      .then(action => {
        if (action == 'Re-apply') vscode.commands.executeCommand('material-code.applyStyles')
      })
    }
    }

module.exports.deactivate = () => {}
