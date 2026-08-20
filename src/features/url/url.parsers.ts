import { err, ok, type Result } from '@/types/result'

const parseAbsoluteUrl = (input: string): Result<URL> => {
  const trimmed = input.trim()
  if (!trimmed) return err('Input is empty.')

  try {
    const url = new URL(trimmed)
    if (!url.protocol || !url.hostname) {
      return err('Expected an absolute URL with a hostname.')
    }
    return ok(url)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid URL.'
    return err(`Invalid URL: ${message}`)
  }
}

const paramsToObject = (params: URLSearchParams) => {
  const query: Record<string, string | string[]> = {}

  params.forEach((value, key) => {
    const existing = query[key]
    if (existing === undefined) {
      query[key] = value
      return
    }
    query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value]
  })

  return query
}

export const parseUrlParts = (input: string) => {
  const parsed = parseAbsoluteUrl(input)
  if (!parsed.ok) return parsed

  const url = parsed.value
  return ok({
    href: url.href,
    protocol: url.protocol.replace(/:$/, ''),
    origin: url.origin,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    query: paramsToObject(url.searchParams),
  })
}

export const parseUrlQuery = (input: string) => {
  const parsed = parseAbsoluteUrl(input)
  if (!parsed.ok) return parsed
  return ok(paramsToObject(parsed.value.searchParams))
}

export const queryJsonToString = (value: unknown): Result<string> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return err('Expected a JSON object of query parameters.')
  }

  const params = new URLSearchParams()
  Object.entries(value).forEach(([key, item]) => {
    if (Array.isArray(item)) {
      item.forEach((arrayItem) => params.append(key, String(arrayItem)))
      return
    }
    if (item === null || typeof item === 'object') {
      throw new Error('Query parameter values must be strings, numbers, booleans, or arrays.')
    }
    params.set(key, String(item))
  })

  const queryString = params.toString()
  return ok(queryString ? `?${queryString}` : '')
}
