import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsObjectInput, parseJsonValue } from './json.parsers'
import { findUnsupportedJsonValue } from './json.validators'

const success = (message: string, output?: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildJsonActions = (): Action[] => [
  {
    id: 'validate-json',
    label: 'Validate JSON',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Valid JSON.')
    },
  },
  {
    id: 'pretty-json',
    label: 'Pretty-print JSON',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Pretty-printed JSON.', JSON.stringify(parsed.value, null, 2))
    },
  },
  {
    id: 'minify-json',
    label: 'Minify JSON',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Minified JSON.', JSON.stringify(parsed.value))
    },
  },
  {
    id: 'json-to-js',
    label: 'JSON → JS Object',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      const formatted = `const data = ${JSON.stringify(parsed.value, null, 2)};`
      return success('Converted JSON to JS object literal.', formatted)
    },
  },
  {
    id: 'js-to-json',
    label: 'JS Object → JSON',
    execute: ({ input }) => {
      const parsed = parseJsObjectInput(input)
      if (!parsed.ok) return err(parsed.error)
      const unsupported = findUnsupportedJsonValue(parsed.value)
      if (unsupported) return err(new Error(unsupported))
      return success('Converted JS object to JSON.', JSON.stringify(parsed.value, null, 2))
    },
  },
]

