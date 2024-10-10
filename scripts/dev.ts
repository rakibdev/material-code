import { build, context, type Plugin, type BuildOptions } from 'esbuild'
import { colors } from './utils'

const options: BuildOptions = {
  outdir: 'build',
  minify: !process.env.DEV,
  bundle: true
}

const importUncached = (module: string) => {
  const path = Bun.resolveSync(module, import.meta.dir)
  delete require.cache[path]
  return import(path)
}

const themeGenerator: Plugin = {
  name: 'themeGenerator',
  setup(build) {
    const generate = async () => {
      const { createTheme, createMaterialColors } = (await importUncached(
        `../${options.outdir}/theme/theme.js`
      )) as typeof import('../theme/theme')

      await Bun.write(`${options.outdir}/dark.json`, JSON.stringify(createTheme(createMaterialColors())))
      await Bun.write(
        `${options.outdir}/light.json`,
        JSON.stringify(createTheme(createMaterialColors({ darkMode: false })))
      )

      console.log(colors.green + 'Themes generated.' + colors.reset)
    }
    let lastModified: number
    build.onEnd(async () => {
      const file = Bun.file('./theme/theme.ts')
      if (lastModified == file.lastModified) return
      lastModified = file.lastModified
      generate()
    })
  }
}

const extension: BuildOptions = {
  ...options,
  entryPoints: ['extension.ts', './theme/theme.ts'],
  format: 'cjs',
  platform: 'node',
  plugins: [themeGenerator],
  sourcemap: process.env.DEV ? 'inline' : undefined,
  // External path must exactly march the import path.
  external: ['vscode', './theme/theme']
}

const inject: BuildOptions = {
  ...options,
  entryPoints: ['inject/inject.ts'],
  format: 'esm'
}

if (process.env.DEV) {
  const extensionBuild = await context(extension)
  await extensionBuild.watch()
  const injectBuild = await context(inject)
  await injectBuild.watch()
} else {
  await build(extension)
  await build(inject)
}
