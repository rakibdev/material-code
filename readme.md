![Material Code Editor](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/editor.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/settings.png)
![Material Code Settings](https://raw.githubusercontent.com/rakibdev/material-code/main/screenshots/light-theme.png)

## Features

- Material You (Dark & Light).
- Rounded corners.
- Click ripple effect.
- Seperate syntax theming.
- Inject custom code (CSS, JavaScript, HTML) via inline text, local file path, or URL.
- Follow system theme e.g. [Mutagen](https://github.com/InioX/matugen), [Pywal](https://github.com/dylanaraps/pywal).

Let me know your suggestions, issues on [Github](https://github.com/rakibdev/material-code/issues)

## Usage

Material You theming works straight away.

Other features requires running **Material Code: Apply styles** from command palette, which injects code into vscode installation file **workbench.html**. Therefore extension may ask for administrative privileges if needed.

After applying vscode will warn "Installation corrupted". This can be safely ignored. Click notification gear icon > **Don't show again**.

And to revert run **Material Code: Remove styles**.

### Follow system theme

Use node package for full theme control outside VS Code.

```bash
bun add https://github.com/rakibdev/material-code/releases/latest/download/npm.tgz
```

You can automatically update VS Code theme whenever your system theme changes using script:

```typescript
import { createTheme, createVsCodeTheme, themeOptions } from 'material-code/theme'
import { readdir } from 'node:fs/promises'

// I'm using custom color generator, not Pywal.
const systemFile = Bun.env.HOME + '/.config/system-ui/app-data.json'
const systemTheme = await Bun.file(systemFile).json()

// Find installed extension folder
const vscodeDir = Bun.env.HOME + '/.vscode-insiders/extensions/'
const targetExtension = (await readdir(vscodeDir)).find(dir => dir.includes('material-code'))
const extensionDir = vscodeDir + targetExtension + '/build'

const theme = createTheme({
  // Defaults
  ...themeOptions,

  // Overrides
  darkMode: systemTheme.darkMode,
  primary: systemTheme.primary
  // ...more colors. TypeScript provides autocomplete
})

const vscodeTheme = createVsCodeTheme(theme)

// Saving as dark variant
await Bun.write(`${extensionDir}/dark.json`, JSON.stringify(vscodeTheme))
```

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
  font-family: Google Sans !important;
}
```

**Change rounded corner radius**<br>

```css
body {
  --radius: 8px;
}
```

** Change background **<br>
todo: add css

### Settings you might like

```json
"editor.semanticHighlighting.enabled": true,
"window.dialogStyle": "custom",
"window.menuBarVisibility": "hidden" // Use command palette instead.
```
