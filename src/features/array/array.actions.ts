import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsonArrayInput } from '@/features/json/json.parsers'

const success = (message: string, output?: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildArrayActions = (): Action[] => [
  {
    id: 'array-reverse',
    label: 'Reverse',
    execute: ({ input }) => {
      const parsed = parseJsonArrayInput(input)
      if (!parsed.ok) return err(parsed.error)
      return success(
        'Reversed array.',
        JSON.stringify([...parsed.value].reverse(), null, 2),
      )
    },
  },
  {
    id: 'array-sort',
    label: 'Sort',
    execute: ({ input }) => {
      const parsed = parseJsonArrayInput(input)
      if (!parsed.ok) return err(parsed.error)
      const sorted = [...parsed.value].sort((a, b) =>
        String(a).localeCompare(String(b)),
      )
      return success('Sorted array.', JSON.stringify(sorted, null, 2))
    },
  },
  {
    id: 'array-unique',
    label: 'Unique',
    execute: ({ input }) => {
      const parsed = parseJsonArrayInput(input)
      if (!parsed.ok) return err(parsed.error)
      const seen = new Set<string>()
      const unique = parsed.value.filter((item) => {
        const key = JSON.stringify(item)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return success('Removed duplicate items.', JSON.stringify(unique, null, 2))
    },
  },
  {
    id: 'array-to-lines',
    label: 'To Lines',
    execute: ({ input }) => {
      const parsed = parseJsonArrayInput(input)
      if (!parsed.ok) return err(parsed.error)
      return success(
        'Converted array to lines.',
        parsed.value.map((item) => String(item)).join('\n'),
      )
    },
  },
]

