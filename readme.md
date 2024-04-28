![Material Code Editor](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/editor.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/settings.png)

> Apple's SF Mono font used in screenshots

## Features

- Material You.
- Custom CSS.
- Rounded corners.
- Click ripple effect.
- Separate syntax theme.
- Follow system theme e.g. [Mutagen](https://github.com/InioX/matugen), [Pywal](https://github.com/dylanaraps/pywal).

Let me know your suggestions, issues on [Github](https://github.com/rakibdev/material-code/issues)

## Usage

Material You theming works straight away.

Other features requires running **Material Code: Apply styles** from command palette, which injects code into vscode installation file **workbench.html**. Therefore extension may ask for administrative privileges if needed.

After applying vscode will warn "Installation corrupted". This can be safely ignored. Click notification gear icon > **Don't show again**.

And to revert run **Material Code: Remove styles**.

### Follow system theme

Extension's folder, in my case located inside `~/.vscode-insiders/extensions` includes a file named **theme.js**. This file exports functions to update theme programmatically, outside VS Code. I wrote a script [vscode.js](https://github.com/rakibdev/dotfiles/blob/main/home/rakib/Downloads/apps-script/theme/vscode.js) to automate the process. It reads colors from a file (custom color generator, I don't use Pywal) and applies them. Edit the file according to your system before using.

## Help

### Revert original files manually

In rare cases like [this](https://github.com/rakibdev/material-code/issues/2) where "Material Code: Remove styles" not working. Generally updating vscode version will revert itself including the styles but if you need fix urgent:

- Open **workbench.html** file located in vscode installation folder.
  In my case (Linux) it's `/opt/visual-studio-code-insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html`
- Remove all code inside `<--material-code-->` block and save.
- To fix "Installation corrupted" warning, use [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums) extension.

### Custom CSS

**Change VS Code font**<br>

```css
.mac,
.windows,
.linux {
  font-family: Google Sans;
}
```

**Change rounded corner radius**<br>

```css
body {
  --radius: 8px;
}
```

### Settings you may like

```json
"editor.semanticHighlighting.enabled": true,
"window.dialogStyle": "custom",
"window.menuBarVisibility": "hidden" // I'm using command palette instead.
```

My [settings.json](https://github.com/rakibdev/dotfiles/blob/main/home/rakib/.config/Code%20-%20Insiders/User/settings.json)
