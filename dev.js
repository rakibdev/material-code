import esbuild from 'esbuild'
import inlineImport from 'esbuild-plugin-inline-import'

const ctx = await esbuild[process.env.DEV ? 'context' : 'build']({
  entryPoints: ['extension.js'],
  outfile: 'extension.pack.js',
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  plugins: [inlineImport()],
  minify: !process.env.DEV,
  legalComments: 'none'
})
if (process.env.DEV) ctx.watch()
