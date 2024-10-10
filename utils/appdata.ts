import vscode from 'vscode'
import { errorNotification } from './extension'
import { readFile, writeFile } from './file'

export class AppData {
  private content: Record<string, any> = {}
  dir: vscode.Uri
  file: vscode.Uri

  constructor(context: vscode.ExtensionContext) {
    this.dir = context.globalStorageUri
    this.file = vscode.Uri.joinPath(this.dir, 'storage.json')
  }

  async initialize() {
    try {
      await vscode.workspace.fs.stat(this.file)
      this.content = JSON.parse(await readFile(this.file))
    } catch (error: any) {
      if (error.code == 'FileNotFound') await vscode.workspace.fs.createDirectory(this.dir)
      else errorNotification(error.message)
    }
  }

  get(key?: string) {
    return key ? this.content[key] : this.content
  }

  set(key: string, value: any) {
    this.content[key] = value
    return writeFile(this.file, JSON.stringify(this.content))
  }
}
