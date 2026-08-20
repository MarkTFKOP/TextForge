import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

interface RegexParts {
  pattern: string
  flags: string
  text: string
}

const parseRegexInput = (input: string): RegexParts | null => {
  const regexFormat = /^\/(.+)\/([gimsuvy]*)\n(.*)$/s
  const match = input.match(regexFormat)

  if (match) {
    return {
      pattern: match[1],
      flags: normalizeFlags(match[2] || 'g'),
      text: match[3],
    }
  }

  const lines = input.split('\n')
  if (lines.length >= 2) {
    return {
      pattern: lines[0],
      flags: 'g',
      text: lines.slice(1).join('\n'),
    }
  }

  return null
}

const normalizeFlags = (flags: string) => flags.includes('g') ? flags : `${flags}g`

const createRegex = (pattern: string, flags: string): RegExp | Error => {
  try {
    return new RegExp(pattern, flags)
  } catch (error) {
    return error instanceof Error ? error : new Error('Invalid regex pattern')
  }
}

const success = (message: string, output?: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildRegexActions = (): Action[] => [
  {
    id: 'regex-test',
    label: 'Test Regex',
    execute: ({ input }) => {
      const parts = parseRegexInput(input)
      if (!parts) {
        return err(
          new Error(
            'Expected format: /pattern/flags\\ntext or pattern\\ntext\n\nExample:\n/\\d+/g\nFind numbers: 123 and 456',
          ),
        )
      }

      const regex = createRegex(parts.pattern, parts.flags)
      if (regex instanceof Error) {
        return err(regex)
      }

      const matches = Array.from(parts.text.matchAll(regex))

      if (matches.length === 0) {
        return success('No matches found.', 'No matches found.')
      }

      const result = matches
        .map((match, index) => {
          const groups = match.length > 1
            ? match.slice(1).map((g, i) => `  Group ${i + 1}: ${g ?? '(empty)'}`).join('\n')
            : ''
          return `Match ${index + 1}:
  Full match: ${match[0]}
  Position: ${match.index} - ${(match.index ?? 0) + match[0].length}${groups ? '\n' + groups : ''}`
        })
        .join('\n\n')

      return success(`Found ${matches.length} match(es).`, result)
    },
  },
  {
    id: 'regex-extract',
    label: 'Extract Matches',
    execute: ({ input }) => {
      const parts = parseRegexInput(input)
      if (!parts) {
        return err(
          new Error(
            'Expected format: /pattern/flags\\ntext or pattern\\ntext\n\nExample:\n/\\d+/g\nFind numbers: 123 and 456',
          ),
        )
      }

      const regex = createRegex(parts.pattern, parts.flags)
      if (regex instanceof Error) {
        return err(regex)
      }

      const matches = Array.from(parts.text.matchAll(regex))

      if (matches.length === 0) {
        return success('No matches found.', '[]')
      }

      const extracted = matches.map((match) => {
        const result: Record<string, unknown> = {
          match: match[0],
          index: match.index,
        }

        if (match.length > 1) {
          const groups: Record<string, string | null> = {}
          match.slice(1).forEach((g, i) => {
            groups[`group${i + 1}`] = g ?? null
          })
          result.groups = groups
        }

        if (match.groups) {
          result.namedGroups = match.groups
        }
        
        return result
      })

      return success(
        `Extracted ${matches.length} match(es) as JSON.`,
        JSON.stringify(extracted, null, 2),
      )
    },
  },
  {
    id: 'regex-replace',
    label: 'Replace (Preview)',
    execute: ({ input }) => {
      const parts = parseRegexInput(input)
      if (!parts) {
        return err(
          new Error(
            'Expected format: /pattern/flags\\nreplacement\\ntext\n\nExample:\n/\\d+/g\nXXX\nFind numbers: 123 and 456',
          ),
        )
      }

      const lines = parts.text.split('\n')
      if (lines.length < 2) {
        return err(
          new Error(
            'Expected format: /pattern/flags\\nreplacement\\ntext\n\nExample:\n/\\d+/g\nXXX\nFind numbers: 123 and 456',
          ),
        )
      }

      const replacement = lines[0]
      const text = lines.slice(1).join('\n')

      const regex = createRegex(parts.pattern, parts.flags)
      if (regex instanceof Error) {
        return err(regex)
      }

      const result = text.replace(regex, replacement)
      const matchCount = (text.match(regex) || []).length

      return success(
        `Replaced ${matchCount} occurrence(s).`,
        result,
      )
    },
  },
  {
    id: 'regex-match-details',
    label: 'Match Details',
    execute: ({ input }) => {
      const parts = parseRegexInput(input)
      if (!parts) {
        return err(
          new Error(
            'Expected format: /pattern/flags\\ntext or pattern\\ntext\n\nExample:\n/\\d+/g\nFind numbers: 123 and 456',
          ),
        )
      }

      const regex = createRegex(parts.pattern, parts.flags)
      if (regex instanceof Error) {
        return err(regex)
      }

      const matches = Array.from(parts.text.matchAll(regex))

      if (matches.length === 0) {
        return success('No matches found.', 'No matches found.')
      }

      const details = matches.map((match, index) => {
        const detail: Record<string, unknown> = {
          matchIndex: index + 1,
          fullMatch: match[0],
          startIndex: match.index,
          endIndex: (match.index ?? 0) + match[0].length,
          length: match[0].length,
        }

        if (match.length > 1) {
          const groups: Record<string, string | null> = {}
          match.slice(1).forEach((group, i) => {
            groups[`group${i + 1}`] = group ?? null
          })
          detail.groups = groups
        }

        if (match.groups) {
          detail.namedGroups = match.groups
        }

        return detail
      })

      return success(
        `Found ${matches.length} match(es) with details.`,
        JSON.stringify(details, null, 2),
      )
    },
  },
]
