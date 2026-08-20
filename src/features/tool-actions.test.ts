import { describe, expect, it } from 'vitest'

import { detectInputKind } from './input-analyzer'
import { buildCookieActions } from './cookie'
import { buildDiffActions } from './diff'
import { buildJsonActions } from './json'
import { buildRegexActions } from './regex'
import { buildUrlActions } from './url'

const runAction = (actions: ReturnType<typeof buildJsonActions>, id: string, input: string) => {
  const action = actions.find((item) => item.id === id)
  if (!action) throw new Error(`Missing action: ${id}`)
  return action.execute({ input })
}

describe('input analyzer', () => {
  it('routes common input types', () => {
    expect(detectInputKind('').kind).toBe('empty')
    expect(detectInputKind('{"a":1}').kind).toBe('json-object')
    expect(detectInputKind('[1,2]').kind).toBe('json-array')
    expect(detectInputKind('https://example.com?a=1').kind).toBe('url')
    expect(detectInputKind('sid=abc; theme=light').kind).toBe('cookie')
    expect(detectInputKind('/\\d+/g\n123').kind).toBe('regex')
    expect(detectInputKind('select * from users').kind).toBe('sql')
    expect(detectInputKind('left\n---\nright').kind).toBe('diff')
  })
})

describe('URL actions', () => {
  it('parses an absolute URL', () => {
    const result = runAction(
      buildUrlActions(),
      'parse-url',
      'https://example.com:443/path?a=1&a=2#top',
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(JSON.parse(result.value.output ?? '').query.a).toEqual(['1', '2'])
  })

  it('rejects invalid URLs', () => {
    const result = runAction(buildUrlActions(), 'parse-url', '/relative/path')
    expect(result.ok).toBe(false)
  })
})

describe('cookie actions', () => {
  it('parses and decodes cookie headers', () => {
    const result = runAction(buildCookieActions(), 'cookie-to-json', 'name=Mark%20P; mode=dark')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(JSON.parse(result.value.output ?? '')).toEqual({ name: 'Mark P', mode: 'dark' })
  })

  it('converts JSON to cookie header', () => {
    const result = runAction(buildCookieActions(), 'json-to-cookie', '{"name":"Mark P","active":true}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.output).toBe('name=Mark%20P; active=true')
  })
})

describe('JSON actions', () => {
  it('sorts, flattens, unflattens, and generates TypeScript', () => {
    const actions = buildJsonActions()
    const sorted = runAction(actions, 'sort-json-keys', '{"b":1,"a":{"d":2,"c":3}}')
    expect(sorted.ok).toBe(true)
    if (!sorted.ok) return
    expect(sorted.value.output).toContain('"a"')

    const flattened = runAction(actions, 'flatten-json', '{"user":{"name":"Mark"},"flags":[true]}')
    expect(flattened.ok).toBe(true)
    if (!flattened.ok) return
    expect(JSON.parse(flattened.value.output ?? '')).toEqual({
      'flags.0': true,
      'user.name': 'Mark',
    })

    const unflattened = runAction(actions, 'unflatten-json', '{"user.name":"Mark","flags.0":true}')
    expect(unflattened.ok).toBe(true)
    if (!unflattened.ok) return
    expect(JSON.parse(unflattened.value.output ?? '')).toEqual({
      flags: [true],
      user: { name: 'Mark' },
    })

    const typeResult = runAction(actions, 'json-to-typescript', '{"id":1,"name":"Mark"}')
    expect(typeResult.ok).toBe(true)
    if (!typeResult.ok) return
    expect(typeResult.value.output).toContain('export type JsonData')
  })
})

describe('diff actions', () => {
  it('reports JSON diff paths', () => {
    const result = runAction(buildDiffActions(), 'json-diff', '{"a":1,"b":2}\n---\n{"a":1,"b":3,"c":4}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const diff = JSON.parse(result.value.output ?? '')
    expect(diff.added[0].path).toBe('$.c')
    expect(diff.changed[0].path).toBe('$.b')
  })

  it('compares text lines', () => {
    const result = runAction(buildDiffActions(), 'text-compare', 'one\ntwo\n---\none\nthree')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.output).toContain('- 2: two')
    expect(result.value.output).toContain('+ 2: three')
  })
})

describe('regex actions', () => {
  it('extracts matches and rejects invalid patterns', () => {
    const actions = buildRegexActions()
    const extracted = runAction(actions, 'regex-extract', '/\\d+/i\nabc 123 def 456')
    expect(extracted.ok).toBe(true)
    if (!extracted.ok) return
    expect(JSON.parse(extracted.value.output ?? '')).toHaveLength(2)

    const invalid = runAction(actions, 'regex-extract', '/[/g\nabc')
    expect(invalid.ok).toBe(false)
  })
})
