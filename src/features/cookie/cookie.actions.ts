import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsonValue } from '@/features/json/json.parsers'

import { cookieJsonToHeader, parseCookieHeader } from './cookie.parsers'

const success = (message: string, output: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildCookieActions = (): Action[] => [
  {
    id: 'cookie-to-json',
    label: 'Cookie → JSON',
    execute: ({ input }) => {
      try {
        const parsed = parseCookieHeader(input)
        if (!parsed.ok) return err(parsed.error)
        return success('Parsed cookie header.', JSON.stringify(parsed.value, null, 2))
      } catch (error) {
        return err(error instanceof Error ? error : new Error('Could not parse cookie header.'))
      }
    },
  },
  {
    id: 'json-to-cookie',
    label: 'JSON → Cookie',
    execute: ({ input }) => {
      const parsed = parseJsonValue(input)
      if (!parsed.ok) return err(parsed.error)
      try {
        const header = cookieJsonToHeader(parsed.value)
        if (!header.ok) return err(header.error)
        return success('Converted JSON to cookie header.', header.value)
      } catch (error) {
        return err(error instanceof Error ? error : new Error('Could not build cookie header.'))
      }
    },
  },
]
