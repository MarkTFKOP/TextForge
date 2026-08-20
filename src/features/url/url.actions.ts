import type { Action, ActionOutputView } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsonValue } from '@/features/json/json.parsers'

import { parseUrlParts, parseUrlQuery, queryJsonToString } from './url.parsers'

type UrlParts = Extract<ReturnType<typeof parseUrlParts>, { ok: true }>['value']

const success = (message: string, output: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

const urlTableView = (value: UrlParts): ActionOutputView => ({
  type: 'table',
  title: 'URL parts',
  rows: [
    { id: 'href', label: 'Full URL', value: value.href },
    { id: 'protocol', label: 'Protocol', value: value.protocol },
    { id: 'origin', label: 'Origin', value: value.origin },
    { id: 'host', label: 'Host', value: value.host },
    { id: 'hostname', label: 'Hostname', value: value.hostname },
    { id: 'port', label: 'Port', value: value.port },
    { id: 'pathname', label: 'Path', value: value.pathname },
    { id: 'search', label: 'Query string', value: value.search },
    { id: 'hash', label: 'Hash', value: value.hash },
  ],
})

const queryTableView = (value: Record<string, string | string[]>): ActionOutputView => ({
  type: 'table',
  title: 'Query parameters',
  rows: Object.entries(value).map(([key, item]) => ({
    id: key,
    label: key,
    value: Array.isArray(item) ? item.join(', ') : item,
  })),
})

export const buildUrlActions = (): Action[] => [
  {
    id: 'parse-url',
    label: 'Parse URL',
    execute: ({ input }) => {
      const parsed = parseUrlParts(input)
      if (!parsed.ok) return err(parsed.error)
      return ok({
        output: JSON.stringify(parsed.value, null, 2),
        view: urlTableView(parsed.value),
        notice: { message: 'Parsed URL.', tone: 'success' as const },
        tone: 'success' as const,
      })
    },
  },
  {
    id: 'url-query-to-json',
    label: 'Query → JSON',
    execute: ({ input }) => {
      const parsed = parseUrlQuery(input)
      if (!parsed.ok) return err(parsed.error)
      return ok({
        output: JSON.stringify(parsed.value, null, 2),
        view: queryTableView(parsed.value),
        notice: {
          message: 'Extracted URL query parameters.',
          tone: 'success' as const,
        },
        tone: 'success' as const,
      })
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
