import { err, ok, type Result } from '@/types/result'

const decodePart = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    throw new Error('Cookie contains invalid percent-encoding.')
  }
}

export const parseCookieHeader = (input: string): Result<Record<string, string>> => {
  const trimmed = input.trim()
  if (!trimmed) return err('Input is empty.')

  const result: Record<string, string> = {}
  const segments = trimmed.split(';').map((segment) => segment.trim())

  for (const segment of segments) {
    const separatorIndex = segment.indexOf('=')
    if (separatorIndex <= 0) {
      return err('Expected cookie pairs in key=value format.')
    }

    const key = decodePart(segment.slice(0, separatorIndex).trim())
    const value = decodePart(segment.slice(separatorIndex + 1).trim())
    if (!key) return err('Cookie keys cannot be empty.')
    if (result[key] !== undefined) return err(`Duplicate cookie key: ${key}`)
    result[key] = value
  }

  return ok(result)
}

export const cookieJsonToHeader = (value: unknown): Result<string> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return err('Expected a JSON object of cookie values.')
  }

  const pairs = Object.entries(value).map(([key, item]) => {
    if (item === null || typeof item === 'object') {
      throw new Error('Cookie values must be strings, numbers, or booleans.')
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
  })

  return ok(pairs.join('; '))
}
