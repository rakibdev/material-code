import { test, expect } from 'bun:test'
import { CSP_REGEX } from '../src/inject'

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

  const result = html.replace(CSP_REGEX, '')

  expect(result).toInclude('<meta charset="utf-8" />')
  expect(result).not.toInclude('Content-Security-Policy')
})
