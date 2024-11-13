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
    files: ['**/*.js', '**/*.d.ts'],
    exports: {
      // Use `.theme` not `theme`. Otherwise VS Code don't resolve import types.
      '.theme': {
        import: './theme.js',
        types: './theme.d.ts'
      }
    }
  })
)

await $`tsc --project ./scripts/npm/tsconfig.json`

process.chdir(options.outdir!)
await $`bun pm pack`