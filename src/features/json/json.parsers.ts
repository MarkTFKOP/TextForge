import { err, ok, type Result } from '@/types/result'

export const parseJsonValue = (value: string): Result<unknown> => {
  const trimmed = value.trim()
  if (!trimmed) return err('Input is empty.')
  try {
    return ok(JSON.parse(trimmed))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON.'
    return err(`Invalid JSON: ${message}`)
  }
}

export const parseJsonArrayInput = (value: string): Result<unknown[]> => {
  const parsed = parseJsonValue(value)
  if (!parsed.ok) return parsed
  if (!Array.isArray(parsed.value)) {
    return err('Input is not a JSON array.')
  }
  return ok(parsed.value)
}

export const parseJsObjectInput = (value: string): Result<unknown> => {
  const trimmed = value.trim()
  if (!trimmed) {
    return err('Input is empty.')
  }

  const assignmentMatch = trimmed.match(
    /^(const|let|var)\s+\w+\s*=\s*([\s\S]+);?$/,
  )
  const expression = assignmentMatch ? assignmentMatch[2] : trimmed

  try {
    // Evaluate as an object literal or expression in a safe-ish sandboxed scope.
    const parsed = new Function(`"use strict"; return (${expression});`)()
    return ok(parsed)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JS object.'
    return err(message)
  }
}

