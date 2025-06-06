import { build, context, type BuildOptions, type Plugin } from 'esbuild'
import * as materialColors from 'material-colors'
import { colors } from './config'

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
      const { createEditorTheme, createSemanticColors, themeOptions } = (await importUncached(
        `../src/theme/create`
      )) as typeof import('../src/theme/create')
      const darkColors = materialColors.flatten(materialColors.generate(themeOptions))
      const lightColors = materialColors.flatten(materialColors.generate({ ...themeOptions, darkMode: false }))

      const darkTheme = createEditorTheme(createSemanticColors(darkColors))
      const lightTheme = createEditorTheme(createSemanticColors(lightColors))

      await Bun.write(`${options.outdir}/dark.json`, JSON.stringify(darkTheme))
      await Bun.write(`${options.outdir}/light.json`, JSON.stringify(lightTheme))
      console.log(colors.green + 'Themes generated.' + colors.reset)
    }
    let lastModified: number
    build.onEnd(async () => {
      const file = Bun.file('./src/theme/create.ts')
      if (lastModified == file.lastModified) return
      lastModified = file.lastModified
      generate()
    })
  }
}

const extension: BuildOptions = {
  ...options,
  entryPoints: ['./src/extension.ts'],
  format: 'cjs',
  platform: 'node',
  plugins: [themeGenerator],
  sourcemap: process.env.DEV ? 'inline' : undefined,
  // External path must exactly march the import path.
  external: ['vscode']
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
