import vscode from 'vscode'

const extension = vscode.extensions.getExtension('rakib13332.material-code')
export const extensionUri = extension!.extensionUri
export const buildDir = vscode.Uri.joinPath(extensionUri, 'build')
export const packageJson = extension!.packageJSON

// Note: vscode.workspace.getConfiguration returns a cached version of the configuration.
// So, using it in a non-function variable will cause issues if the configuration is changed.
export const settings = () => vscode.workspace.getConfiguration('material-code')
