import esbuild from 'esbuild'
import inlineImport from 'esbuild-plugin-inline-import'

const custom = {
  name: 'custom',
  setup(build) {
    let lastModified = null
    build.onEnd(async () => {
      const file = Bun.file('theme.js')
      if (lastModified == file.lastModified) return
      lastModified = file.lastModified

      const { createTheme } = await import(`./theme.js?version=${lastModified}`)
      const theme = createTheme({})
      Bun.write('./themes/editor.json', JSON.stringify(theme))
    })
  }
}

const ctx = await esbuild[process.env.DEV ? 'context' : 'build']({
  entryPoints: ['extension.js'],
  outfile: 'main.build.js',
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  plugins: [inlineImport(), custom],
  minify: !process.env.DEV,
  legalComments: 'none',
  define: {
    'process.env.DEV': `${process.env.DEV}`
  }
})

if (process.env.DEV) ctx.watch()
