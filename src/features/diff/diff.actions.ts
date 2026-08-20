import type { Action } from '@/types/action'
import { err, ok } from '@/types/result'

import { parseJsonValue } from '@/features/json/json.parsers'

import { splitDiffBlocks } from './diff.parsers'

type JsonDiffEntry = {
  path: string
  value?: unknown
  before?: unknown
  after?: unknown
}

type JsonDiffResult = {
  added: JsonDiffEntry[]
  removed: JsonDiffEntry[]
  changed: JsonDiffEntry[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const pathForKey = (path: string, key: string) =>
  /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`

const pathForIndex = (path: string, index: number) => `${path}[${index}]`

const valuesEqual = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right)

export const diffJsonValues = (left: unknown, right: unknown): JsonDiffResult => {
  const result: JsonDiffResult = { added: [], removed: [], changed: [] }

  const visit = (leftValue: unknown, rightValue: unknown, path: string) => {
    if (valuesEqual(leftValue, rightValue)) return

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
      const maxLength = Math.max(leftValue.length, rightValue.length)
      for (let index = 0; index < maxLength; index += 1) {
        const nextPath = pathForIndex(path, index)
        if (index >= leftValue.length) {
          result.added.push({ path: nextPath, value: rightValue[index] })
        } else if (index >= rightValue.length) {
          result.removed.push({ path: nextPath, value: leftValue[index] })
        } else {
          visit(leftValue[index], rightValue[index], nextPath)
        }
      }
      return
    }

    if (isRecord(leftValue) && isRecord(rightValue)) {
      const keys = [...new Set([...Object.keys(leftValue), ...Object.keys(rightValue)])].sort()
      keys.forEach((key) => {
        const nextPath = pathForKey(path, key)
        if (!(key in leftValue)) {
          result.added.push({ path: nextPath, value: rightValue[key] })
        } else if (!(key in rightValue)) {
          result.removed.push({ path: nextPath, value: leftValue[key] })
        } else {
          visit(leftValue[key], rightValue[key], nextPath)
        }
      })
      return
    }

    result.changed.push({ path, before: leftValue, after: rightValue })
  }

  visit(left, right, '$')
  return result
}

const compareTextLines = (left: string, right: string) => {
  const leftLines = left.split(/\r?\n/)
  const rightLines = right.split(/\r?\n/)
  const maxLength = Math.max(leftLines.length, rightLines.length)
  const output: string[] = []

  for (let index = 0; index < maxLength; index += 1) {
    const leftLine = leftLines[index]
    const rightLine = rightLines[index]
    if (leftLine === rightLine) continue
    if (leftLine !== undefined) output.push(`- ${index + 1}: ${leftLine}`)
    if (rightLine !== undefined) output.push(`+ ${index + 1}: ${rightLine}`)
  }

  return output.length ? output.join('\n') : 'No differences found.'
}

const success = (message: string, output: string) =>
  ok({
    output,
    notice: { message, tone: 'success' as const },
    tone: 'success' as const,
  })

export const buildDiffActions = (): Action[] => [
  {
    id: 'json-diff',
    label: 'JSON Diff',
    execute: ({ input }) => {
      const blocks = splitDiffBlocks(input)
      if (!blocks.ok) return err(blocks.error)

      const left = parseJsonValue(blocks.value.left)
      if (!left.ok) return err(left.error)

      const right = parseJsonValue(blocks.value.right)
      if (!right.ok) return err(right.error)

      return success(
        'Compared JSON values.',
        JSON.stringify(diffJsonValues(left.value, right.value), null, 2),
      )
    },
  },
  {
    id: 'text-compare',
    label: 'Text Compare',
    execute: ({ input }) => {
      const blocks = splitDiffBlocks(input)
      if (!blocks.ok) return err(blocks.error)

      return success(
        'Compared text blocks.',
        compareTextLines(blocks.value.left, blocks.value.right),
      )
    },
  },
]
