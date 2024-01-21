import esbuild from 'esbuild'
import inlineImport from 'esbuild-plugin-inline-import'

const ctx = await esbuild[process.env.DEV ? 'context' : 'build']({
  entryPoints: ['extension.js'],
  outfile: 'main.build.js',
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  plugins: [inlineImport()],
  minify: !process.env.DEV,
  legalComments: 'none',
  define: {
    'process.env.DEV': `${process.env.DEV}`
  }
})

if (process.env.DEV) ctx.watch()
