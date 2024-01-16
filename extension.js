import injectCss from 'inline:./inject.css'
import injectJs from 'inline:./inject.js'

import vscode from 'vscode'
import sudo from '@vscode/sudo-prompt'
import path from 'path'
import crypto from 'crypto'
import os from 'os'
import { promises as fs } from 'fs'
import { createTheme } from './theme.js'

const app_dir = path.dirname(require.main.filename)
const workbench_file = path.normalize(app_dir + '/vs/code/electron-sandbox/workbench/workbench.html')
const product_file = path.normalize(app_dir + '/../product.json')
let packageJson = null

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

const showErrorNotification = message => {
  vscode.window.showErrorMessage(message, 'Report on GitHub').then(async action => {
    if (action == 'Report on GitHub') {
      const body = `**OS:** ${os.platform()} ${os.release()}\n**Visual Studio Code:** ${
        vscode.version
      }\n**Error:** \`${message}\``
      vscode.env.openExternal(
        vscode.Uri.parse(packageJson.repository.url + `/issues/new?body=${encodeURIComponent(body)}`)
      )
    }
  })
}

const updateWorkbenchFile = async workbench_html => {
  const onSuccess = () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow')
  }

  // updates checksums to fix installation corrupt warning.
  // requires editor full restart to see effect not just reload window.
  let product_json = JSON.parse(await fs.readFile(product_file, 'utf8'))
  const workbench_file_relative = workbench_file.slice(1)
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
  } catch {
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
        showErrorNotification(message)
      } else onSuccess()
    })
  }
}

const stripInjectCode = workbench_html =>
  workbench_html.replace(/\n*?<!--material-code-->.*?<!--material-code-->\n*?/s, '\n\n')

const onRemoveStylesCommand = async () => {
  const html = await fs.readFile(workbench_file, 'utf8')
  updateWorkbenchFile(stripInjectCode(html))
}

const onApplyStylesCommand = async () => {
  const customCss = settings.get('customCSS')

  let html = await fs.readFile(workbench_file, 'utf8')
  html = stripInjectCode(html)
    .replace(/<meta.*http-equiv="Content-Security-Policy".*?>/s, '')
    .replace(
      /\n*?<\/html>/,
      `\n\n<!--material-code-->\n<style>\n${
        injectCss + customCss
      }</style>\n<script>\n${injectJs}</script>\n<!--material-code-->\n\n</html>`
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
  packageJson = context.extension.packageJSON
  await storage.initialize(context)

  const commands = [
    vscode.commands.registerCommand('material-code.applyStyles', async () => {
      await storage.set('styles_enabled', true)
      onApplyStylesCommand()
    }),
    vscode.commands.registerCommand('material-code.removeStyles', async () => {
      await storage.set('styles_enabled', false)
      onRemoveStylesCommand()
    })
  ]
  commands.forEach(command => context.subscriptions.push(command))

  const version = storage.get().version
  if (version != packageJson.version) {
    storage.set('version', packageJson.version)
    if (version) {
      if (isNewVersion(packageJson.version, version)) {
        vscode.window
          .showInformationMessage(
            `Material Code was updated to v${packageJson.version} from v${version}!`,
            'Open changelog'
          )
          .then(action => {
            if (action == 'Open changelog') {
              const releases = `${packageJson.repository.url}/releases`
              vscode.env.openExternal(vscode.Uri.parse(releases))
            }
          })
      }
    } else {
      vscode.window.showInformationMessage('Material Code is installed!', ['Open GitHub README']).then(action => {
        if (action == 'Open GitHub README') {
          vscode.env.openExternal(vscode.Uri.parse(packageJson.repository.url))
        }
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

  vscode.workspace.onDidChangeConfiguration(async event => {
    const primaryColorChanged = event.affectsConfiguration('material-code.primaryColor')
    const lightnessChanged = event.affectsConfiguration('material-code.lightness')

    if (primaryColorChanged || lightnessChanged) {
      const options = { primary: settings.get('primaryColor') }
      if (lightnessChanged) options.lightness = settings.get('lightness')
      await createTheme(context.extensionPath + '/themes/dark.json', options)

      vscode.window.showInformationMessage('Theme updated. Reload window to see.', 'Reload').then(action => {
        if (action == 'Reload') vscode.commands.executeCommand('workbench.action.reloadWindow')
      })
    }
  })
}

module.exports.deactivate = () => {}
