![Material Code Editor](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/editor.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/settings.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/light-theme.png)

## Features

- Material You (Dark & Light).
- Rounded corners.
- Click ripple effect.
- Inject inline CSS, JavaScript, HTML.
- Separate syntax theme.
- Follow system theme e.g. [Mutagen](https://github.com/InioX/matugen), [Pywal](https://github.com/dylanaraps/pywal).

Let me know your suggestions, issues on [Github](https://github.com/rakibdev/material-code/issues)

## Usage

Material You theming works straight away.

Other features requires running **Material Code: Apply styles** from command palette, which injects code into vscode installation file **workbench.html**. Therefore extension may ask for administrative privileges if needed.

After applying vscode will warn "Installation corrupted". This can be safely ignored. Click notification gear icon > **Don't show again**.

And to revert run **Material Code: Remove styles**.

### Follow system theme

Material Code's installation directory (e.g. `~/.vscode-insiders/extensions/rakib13332.material-code.../build/theme.js`). The **theme.js** file exports functions to control theme programmatically outside VS Code. So call these whenever your system theme changes. I use shell scripts to apply system-wide GTK and VS Code theme at once, see [vscode.js](https://github.com/rakibdev/dotfiles/blob/main/home/rakib/Downloads/apps-script/theme/vscode.js). Edit according to your system before using.

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

** Change background **<br>
// todo:

### Settings you might like

```json
"editor.semanticHighlighting.enabled": true,
"window.dialogStyle": "custom",
"window.menuBarVisibility": "hidden" // I'm using command palette instead.
```

My [settings.json](https://github.com/rakibdev/dotfiles/blob/main/home/rakib/.config/Code%20-%20Insiders/User/settings.json)
