const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const assertSafePathKey = (key: string) => {
  if (!key || key.includes('.')) {
    throw new Error('JSON flattening does not support empty keys or keys containing dots.')
  }
}

export const sortJsonKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortJsonKeys)
  if (!isRecord(value)) return value

  return Object.keys(value)
    .sort((left, right) => left.localeCompare(right))
    .reduce<Record<string, unknown>>((sorted, key) => {
      sorted[key] = sortJsonKeys(value[key])
      return sorted
    }, {})
}

export const flattenJson = (value: unknown) => {
  const flattened: Record<string, unknown> = {}

  const visit = (current: unknown, path: string[]) => {
    if (Array.isArray(current)) {
      current.forEach((item, index) => visit(item, [...path, String(index)]))
      return
    }

    if (isRecord(current)) {
      Object.entries(current).forEach(([key, item]) => {
        assertSafePathKey(key)
        visit(item, [...path, key])
      })
      return
    }

    flattened[path.join('.')] = current
  }

  visit(value, [])
  return flattened
}

const isIndex = (segment: string) => /^\d+$/.test(segment)

export const unflattenJson = (value: unknown): unknown => {
  if (!isRecord(value)) {
    throw new Error('Unflatten expects a JSON object with dot-path keys.')
  }

  const entries = Object.entries(value)
  if (!entries.length) return {}

  const root: unknown[] | Record<string, unknown> = isIndex(entries[0][0].split('.')[0])
    ? []
    : {}

  entries.forEach(([path, item]) => {
    const segments = path.split('.')
    if (segments.some((segment) => !segment)) {
      throw new Error('Unflatten paths cannot contain empty segments.')
    }

    let current = root
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1
      const nextSegment = segments[index + 1]
      const nextValue = nextSegment && isIndex(nextSegment) ? [] : {}

      if (Array.isArray(current)) {
        if (!isIndex(segment)) {
          throw new Error('Array paths must use numeric segments.')
        }
        const arrayIndex = Number(segment)
        current[arrayIndex] = isLast ? item : current[arrayIndex] ?? nextValue
        current = current[arrayIndex] as unknown[] | Record<string, unknown>
        return
      }

      current[segment] = isLast ? item : current[segment] ?? nextValue
      current = current[segment] as unknown[] | Record<string, unknown>
    })
  })

  return root
}

export const listJsonPaths = (value: unknown) => {
  const paths: string[] = []

  const visit = (current: unknown, path: string) => {
    if (Array.isArray(current)) {
      if (!current.length) paths.push(path)
      current.forEach((item, index) => visit(item, `${path}[${index}]`))
      return
    }

    if (isRecord(current)) {
      const entries = Object.entries(current)
      if (!entries.length) paths.push(path)
      entries.forEach(([key, item]) => visit(item, `${path}.${key}`))
      return
    }

    paths.push(path)
  }

  visit(value, '$')
  return paths
}

const safeTypeKey = (key: string) =>
  /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)

const mergeTypes = (types: string[]) => [...new Set(types)].sort().join(' | ')

const toTypeScriptType = (value: unknown, depth = 0): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (!value.length) return 'unknown[]'
    return `Array<${mergeTypes(value.map((item) => toTypeScriptType(item, depth + 1)))}>`
  }
  if (isRecord(value)) {
    const indent = '  '.repeat(depth + 1)
    const closeIndent = '  '.repeat(depth)
    const fields = Object.entries(value)
      .map(([key, item]) => `${indent}${safeTypeKey(key)}: ${toTypeScriptType(item, depth + 1)}`)
      .join('\n')
    return fields ? `{\n${fields}\n${closeIndent}}` : 'Record<string, never>'
  }

  const primitiveType = typeof value
  if (primitiveType === 'string' || primitiveType === 'number' || primitiveType === 'boolean') {
    return primitiveType
  }
  return 'unknown'
}

export const jsonToTypeScript = (value: unknown) =>
  `export type JsonData = ${toTypeScriptType(value)}`

export const inspectJson = (value: unknown) => {
  const rootType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value
  return {
    rootType,
    arrayLength: Array.isArray(value) ? value.length : null,
    objectKeys: isRecord(value) ? Object.keys(value).length : null,
    paths: listJsonPaths(value),
  }
}
