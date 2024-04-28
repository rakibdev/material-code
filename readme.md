![Material Code Editor](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/editor.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/settings.png)

> Apple's SF Mono font used in screenshots

## Features

- Material You.
- Rounded corners.
- Ripple effect.
- Custom CSS.
- Separate syntax theme.

Let me know your suggestions, issues on [Github](https://github.com/rakibdev/material-code/issues)

## Usage

Material You theme works straight away.

Other features requires running "Material Code: Apply styles" from command palette, which injects custom code into vscode installation file "workbench.html". Therefore extension may ask for administrative privileges if needed.

After applying vscode will warn "Installation corrupted" notification. This can be safely ignored, click notification gear icon > "Don't show again".

To remove styles run "Material Code: Remove styles" from command palette which reverts "workbench.html" to original.

## Help

### Revert original files manually

In rare cases like [this](https://github.com/rakibdev/material-code/issues/2) where "Material Code: Remove styles" not working. Generally updating vscode version will revert itself including the styles. But if you need fix urgent:

- Open "workbench.html" file located in vscode installation folder.
  In my case (Linux) it's "/opt/visual-studio-code-insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html"
- Remove all code inside "<--material-code-->" block and save.
- To fix "Installation corrupted" warning, use [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums) extension.

### Custom CSS

You can define as many rules you want in "Custom CSS" input.

**Change whole UI font**<br>
`.mac, .windows, .linux { font-family: Google Sans; }`

**Change rounded corner radius**<br>
`body { --radius: 8px; }`

### Other settings you may like

`"editor.semanticHighlighting.enabled": true`<br>
`"window.dialogStyle": "custom"`<br>
`"window.menuBarVisibility": "hidden"` (Use command palette)

My vscode [settings.json](https://github.com/rakibdev/dotfiles/blob/main/home/rakib/.config/Code%20-%20Insiders/User/settings.json)
