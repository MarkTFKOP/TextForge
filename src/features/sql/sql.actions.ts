import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

const success = (message: string, output: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildSqlActions = (): Action[] => [
  {
    id: 'sql-in-list',
    label: 'IN List',
    execute: ({ input }) => {
      const trimmed = input.trim()
      if (!trimmed) return err('Input is empty.')

      const items = trimmed
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)

      if (!items.length) return err('No values found to format.')

      const quoted = items.map((item) => `'${item.replace(/'/g, "''")}'`)
      return success('Formatted IN clause.', `IN (${quoted.join(', ')})`)
    },
  },
  {
    id: 'sql-single-line',
    label: 'Single Line',
    execute: ({ input }) => {
      const trimmed = input.trim()
      if (!trimmed) return err('Input is empty.')
      const singleLine = input.replace(/\s+/g, ' ').trim()
      return success('Converted SQL to a single line.', singleLine)
    },
  },
  {
    id: 'sql-format',
    label: 'Format SQL',
    execute: ({ input }) => {
      const trimmed = input.trim()
      if (!trimmed) return err('Input is empty.')
      const tokens = input
        .replace(/\s+/g, ' ')
        .trim()
        .split(/\s+/)
        .map((token) => token.toUpperCase())

      const breakBefore = new Set([
        'SELECT',
        'FROM',
        'WHERE',
        'GROUP',
        'ORDER',
        'HAVING',
        'LIMIT',
        'JOIN',
        'INNER',
        'LEFT',
        'RIGHT',
        'FULL',
        'CROSS',
        'UNION',
        'VALUES',
        'SET',
        'ON',
      ])

      const formatted = tokens
        .map((token, index) => {
          if (breakBefore.has(token)) {
            return `${index === 0 ? '' : '\n'}${token}`
          }
          if (token === 'BY' && index > 0) {
            const prev = tokens[index - 1]
            if (prev === 'GROUP' || prev === 'ORDER') {
              return ` ${token}`
            }
          }
          return ` ${token}`
        })
        .join('')
        .trim()

      return success('Formatted SQL.', formatted)
    },
  },
]

