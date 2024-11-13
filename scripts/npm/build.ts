import { generate } from '@stacksjs/dtsx'
import { $, type BuildConfig } from 'bun'
import packageJson from '../../package.json'

const options: BuildConfig = {
  outdir: 'build/npm',
  minify: true,
  format: 'esm',
  entrypoints: ['./theme/theme.ts']
}
await Bun.build(options)

const { name, description, version, author } = packageJson
Bun.write(
  `${options.outdir}/package.json`,
  JSON.stringify({
    name,
    description,
    version,
    author,
    exports: {
      theme: {
        import: './theme.js',
        types: './theme.d.ts'
      }
    }
  })
)

await generate({
  root: './',
  entrypoints: ['./theme/theme.ts'],
  outdir: options.outdir,
  tsconfigPath: './scripts/npm/tsconfig.json',
  clean: false
})

process.chdir(options.outdir!)
await $`bun pm pack`
