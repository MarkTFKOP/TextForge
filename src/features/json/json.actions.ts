import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsObjectInput, parseJsonValue } from './json.parsers'
import {
  flattenJson,
  inspectJson,
  jsonToTypeScript,
  listJsonPaths,
  sortJsonKeys,
  unflattenJson,
} from './json.utils'
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
    label: 'Prettify JSON',
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
  {
    id: 'inspect-json',
    label: 'Inspect JSON',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Inspected JSON.', JSON.stringify(inspectJson(parsed.value), null, 2))
    },
  },
  {
    id: 'sort-json-keys',
    label: 'Sort Keys',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Sorted JSON keys.', JSON.stringify(sortJsonKeys(parsed.value), null, 2))
    },
  },
  {
    id: 'flatten-json',
    label: 'Flatten JSON',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      try {
        return success('Flattened JSON.', JSON.stringify(flattenJson(parsed.value), null, 2))
      } catch (error) {
        return err(error instanceof Error ? error : new Error('Could not flatten JSON.'))
      }
    },
  },
  {
    id: 'unflatten-json',
    label: 'Unflatten JSON',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      try {
        return success('Unflattened JSON.', JSON.stringify(unflattenJson(parsed.value), null, 2))
      } catch (error) {
        return err(error instanceof Error ? error : new Error('Could not unflatten JSON.'))
      }
    },
  },
  {
    id: 'json-paths',
    label: 'List Paths',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Listed JSON paths.', listJsonPaths(parsed.value).join('\n'))
    },
  },
  {
    id: 'json-to-typescript',
    label: 'To TypeScript',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Generated TypeScript type.', jsonToTypeScript(parsed.value))
    },
  },
]
