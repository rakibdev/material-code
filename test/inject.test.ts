import { test, expect } from 'bun:test'

// Without UTF-8 meta tag, Windsurf side chat displays blank
test('should preserve UTF-8 meta tag when removing CSP', () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'" />
      </head>
    </html>
  `

  const result = html.replace(/<meta\s+http-equiv="Content-Security-Policy"[^>]*>/s, '')

  expect(result).toInclude('<meta charset="utf-8" />')
  expect(result).not.toInclude('Content-Security-Policy')
})
