import { test, expect, beforeEach, afterEach } from 'bun:test'
import { mkdir, writeFile, rm, readFile } from 'fs/promises'
import { join } from 'path'
import { mergeTheme } from '../src/theme/utils'

const testDir = join(import.meta.dir, '.test-themes')

const createTestTheme = async (name: string, content: Record<string, any>) => {
  const path = join(testDir, name)
  await writeFile(path, JSON.stringify(content))
  return path
}

beforeEach(async () => {
  await mkdir(testDir, { recursive: true })
})

afterEach(async () => {
  await rm(testDir, { recursive: true, force: true })
})

test('should merge multiple levels of nested includes', async () => {
  // Level 1 (deepest)
  await createTestTheme('level1.json', {
    name: 'Level 1',
    colors: { 'editor.background': '#ffffff', 'editor.foreground': '#000000' },
    tokenColors: [{ scope: 'comment', settings: { foreground: '#008000' } }]
  })

  // Level 2 (middle)
  await createTestTheme('level2.json', {
    name: 'Level 2',
    include: './level1.json',
    colors: { 'editor.background': '#f0f0f0' },
    tokenColors: [{ scope: 'string', settings: { foreground: '#a31515' } }]
  })

  // Level 3 (top)
  await createTestTheme('level3.json', {
    name: 'Level 3',
    include: './level2.json',
    colors: { 'editor.foreground': '#333333' },
    tokenColors: [{ scope: 'keyword', settings: { foreground: '#0000ff' } }]
  })

  // Read and verify
  const level1 = JSON.parse(await readFile(join(testDir, 'level1.json'), 'utf-8'))
  const level2 = JSON.parse(await readFile(join(testDir, 'level2.json'), 'utf-8'))
  const level3 = JSON.parse(await readFile(join(testDir, 'level3.json'), 'utf-8'))

  // Simulate recursive merge: level1 < level2 < level3
  const merged12 = mergeTheme(level1, level2)
  const merged123 = mergeTheme(merged12, level3)

  // Verify colors merged with proper priority
  expect(merged123.colors['editor.background']).toBe('#f0f0f0') // from level2
  expect(merged123.colors['editor.foreground']).toBe('#333333') // from level3

  // Verify tokenColors array merged
  expect(merged123.tokenColors.length).toBe(3)
  expect(merged123.tokenColors.map((t: any) => t.scope)).toEqual(['comment', 'string', 'keyword'])
})
