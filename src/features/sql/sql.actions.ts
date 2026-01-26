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
]

