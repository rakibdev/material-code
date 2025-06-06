import vscode from 'vscode'

const extension = vscode.extensions.getExtension('rakib13332.material-code')
export const extensionUri = extension!.extensionUri
export const buildDir = vscode.Uri.joinPath(extensionUri, 'build')
export const packageJson = extension!.packageJSON

// Using `settings().get()`, not `settings.get()` to avoid cache.
export const settings = () => vscode.workspace.getConfiguration('material-code')
