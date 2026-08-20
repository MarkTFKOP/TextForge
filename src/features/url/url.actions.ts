import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsonValue } from '@/features/json/json.parsers'

import { parseUrlParts, parseUrlQuery, queryJsonToString } from './url.parsers'

const success = (message: string, output: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildUrlActions = (): Action[] => [
  {
    id: 'parse-url',
    label: 'Parse URL',
    execute: ({ input }) => {
      const parsed = parseUrlParts(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Parsed URL.', JSON.stringify(parsed.value, null, 2))
    },
  },
  {
    id: 'url-query-to-json',
    label: 'Query → JSON',
    execute: ({ input }) => {
      const parsed = parseUrlQuery(input)
      if (!parsed.ok) return err(parsed.error)
      return success('Extracted URL query parameters.', JSON.stringify(parsed.value, null, 2))
    },
  },
  {
    id: 'json-to-url-query',
    label: 'JSON → Query',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      try {
        const query = queryJsonToString(parsed.value)
        if (!query.ok) return err(query.error)
        return success('Converted JSON to query string.', query.value)
      } catch (error) {
        return err(error instanceof Error ? error : new Error('Could not build query string.'))
      }
    },
  },
]
