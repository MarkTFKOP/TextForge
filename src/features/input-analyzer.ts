import type { ActionGroupId } from '@/types/action'

import { hasDiffSeparator } from './diff/diff.parsers'
import { parseJsonValue } from './json/json.parsers'

export type InputKind =
  | 'empty'
  | 'diff'
  | 'json-array'
  | 'json-object'
  | 'url'
  | 'cookie'
  | 'regex'
  | 'sql'
  | 'text'

export type InputAnalysis = {
  kind: InputKind
  groupId: ActionGroupId | null
  label: string
}

const isAbsoluteUrl = (value: string) => {
  try {
    const url = new URL(value)
    return Boolean(url.protocol && url.hostname)
  } catch {
    return false
  }
}

const isCookieHeader = (value: string) => {
  if (!value.includes('=')) return false
  if (/^https?:\/\//i.test(value)) return false

  const segments = value.split(';').map((segment) => segment.trim())
  return segments.every((segment) => /^[^=;\s]+=[^;]*$/.test(segment))
}

const isRegexInput = (value: string) => /^\/.+\/[gimsuvy]*\n[\s\S]+$/.test(value)

const isSqlInput = (value: string) =>
  /^(select|insert|update|delete|with|create|alter|drop)\b/i.test(value)

export const detectInputKind = (input: string): InputAnalysis => {
  const trimmed = input.trim()
  if (!trimmed) return { kind: 'empty', groupId: null, label: 'Empty input' }

  if (hasDiffSeparator(trimmed)) {
    return { kind: 'diff', groupId: 'diff', label: 'Compare input' }
  }

  const parsed = parseJsonValue(trimmed)
  if (parsed.ok && Array.isArray(parsed.value)) {
    return { kind: 'json-array', groupId: 'array', label: 'JSON array' }
  }
  if (
    parsed.ok &&
    typeof parsed.value === 'object' &&
    parsed.value !== null &&
    !Array.isArray(parsed.value)
  ) {
    return { kind: 'json-object', groupId: 'json', label: 'JSON object' }
  }

  if (isAbsoluteUrl(trimmed)) {
    return { kind: 'url', groupId: 'url', label: 'URL' }
  }

  if (isCookieHeader(trimmed)) {
    return { kind: 'cookie', groupId: 'cookie', label: 'Cookie header' }
  }

  if (isRegexInput(trimmed)) {
    return { kind: 'regex', groupId: 'regex', label: 'Regex input' }
  }

  if (isSqlInput(trimmed)) {
    return { kind: 'sql', groupId: 'sql', label: 'SQL' }
  }

  return { kind: 'text', groupId: 'string', label: 'Plain text' }
}
