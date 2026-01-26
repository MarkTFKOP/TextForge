export const findUnsupportedJsonValue = (
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): string | null => {
  if (
    value === undefined ||
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  ) {
    return 'JSON cannot serialize functions, undefined, symbols, or BigInt.'
  }

  if (value && typeof value === 'object') {
    if (seen.has(value)) {
      return 'Circular references cannot be converted to JSON.'
    }
    seen.add(value)

    if (Array.isArray(value)) {
      for (const item of value) {
        const issue = findUnsupportedJsonValue(item, seen)
        if (issue) return issue
      }
      return null
    }

    for (const item of Object.values(value as Record<string, unknown>)) {
      const issue = findUnsupportedJsonValue(item, seen)
      if (issue) return issue
    }
  }

  return null
}

export const parseJsonArrayLength = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed.startsWith('[')) return null
  try {
    const parsed = JSON.parse(trimmed)
    return Array.isArray(parsed) ? parsed.length : null
  } catch (error) {
    return null
  }
}

