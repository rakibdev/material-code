import esbuild from 'esbuild'
import inlineImport from 'esbuild-plugin-inline-import'

const generateTheme = async version => {
  const { createMaterialColors, createTheme } = await import(`./theme.js?version=${version}`)
  const theme = createTheme(createMaterialColors())
  Bun.write('build/theme.json', JSON.stringify(theme))
}

const custom = {
  name: 'custom',
  setup(build) {
    let lastModified = null
    build.onEnd(async () => {
      const file = Bun.file('theme.js')
      if (lastModified == file.lastModified) return
      lastModified = file.lastModified
      generateTheme(file.lastModified)
    })
  }
}

const ctx = await esbuild[process.env.DEV ? 'context' : 'build']({
  entryPoints: ['extension.js', 'theme.js'],
  outdir: 'build',
  format: 'cjs',
  platform: 'node',
  // Keep "./" of "./theme.js" as it must exactly match import path.
  external: ['vscode', './theme.js'],
  plugins: [inlineImport(), custom],
  minify: !process.env.DEV,
  bundle: true,
  legalComments: 'none'
})

if (process.env.DEV) ctx.watch()
else generateTheme()
