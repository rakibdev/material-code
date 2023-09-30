## Features

- Material You.
- Rounded corners.
- Ripple effect.
- Custom CSS.

![Material Code Editor](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/editor.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/settings.png)

> Apple's `SF Mono` font used in screenshots.

Let me know your suggestions or issues in [Github](https://github.com/rakibdev/material-code)

## Usage

Theme works straight away.

Additional styling (Rounded corners, ripple effect custom CSS) requires running `"Material Code: Apply styles"` from command palette, which injects custom code into vscode installation files `workbench.html` and `product.json`. Therefore extension may ask for administrative privileges everytime you do this or you can manually run vscode as administrator once.

After applied vscode will show `"Installation corrupted"` notification. This can be safely ignored. Click notification gear icon > `Don't show again`.

To remove styles run `"Material Code: Remove styles"` from command palette which reverts those files to original.

## Help

### Revert original files manually

In rare cases like [this](https://github.com/rakibdev/material-code/issues/2) where `"Material Code: Remove styles"` not working. Generally updating vscode version will revert itself including the styles. But if you need fix urgent:

- Open `workbench.html` file located in vscode installation folder.
  In my case it's `/opt/visual-studio-code-insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html`
- Remove all code inside `<!--material-code-->` and save.
- To revert `product.json` which fixes `Installation corrupted` warning, use [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums) extension.

### Custom CSS samples

Change whole UI font

`"material-code.customCSS": ".mac, .windows, .linux { font-family: Google Sans; }"`

Change round radius

`"material-code.customCSS": "body { --radius: 8px; }"`

### Settings you may like

`"editor.semanticHighlighting.enabled": true`

`"window.dialogStyle": "custom"`

`"window.menuBarVisibility": "hidden"` (Command palette can do everything top menu does)

My [settings.json](https://github.com/rakibdev/dotfiles/blob/main/home/rakib/.config/Code%20-%20Insiders/User/settings.json) file.
