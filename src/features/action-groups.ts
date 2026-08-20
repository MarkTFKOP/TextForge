import type { ActionGroup, ActionGroupId } from '@/types/action'

import { buildArrayActions } from './array'
import { buildCookieActions } from './cookie'
import { buildDiffActions } from './diff'
import { buildJsonActions } from './json'
import { buildRegexActions } from './regex'
import { buildSqlActions } from './sql'
import { buildCaseActions, buildStringUtilityActions } from './text'
import { buildUrlActions } from './url'

export const buildActionGroups = (): ActionGroup[] => [
  { id: 'json', title: 'JSON', actions: buildJsonActions() },
  { id: 'diff', title: 'Diff', actions: buildDiffActions() },
  { id: 'url', title: 'URL', actions: buildUrlActions() },
  { id: 'cookie', title: 'Cookie', actions: buildCookieActions() },
  { id: 'regex', title: 'Regex', actions: buildRegexActions() },
  { id: 'array', title: 'Array', actions: buildArrayActions() },
  { id: 'sql', title: 'SQL', actions: buildSqlActions() },
  { id: 'case', title: 'Case', actions: buildCaseActions() },
  { id: 'string', title: 'String', actions: buildStringUtilityActions() },
]

const groupOrderByDetectedGroup: Record<ActionGroupId, ActionGroupId[]> = {
  json: ['json', 'diff', 'url', 'cookie', 'array', 'regex', 'sql', 'case', 'string'],
  diff: ['diff', 'json', 'string', 'regex', 'url', 'cookie', 'array', 'sql', 'case'],
  url: ['url', 'json', 'cookie', 'string', 'regex', 'diff', 'array', 'sql', 'case'],
  cookie: ['cookie', 'json', 'url', 'string', 'regex', 'diff', 'array', 'sql', 'case'],
  regex: ['regex', 'string', 'case', 'diff', 'json', 'url', 'cookie', 'array', 'sql'],
  array: ['array', 'json', 'diff', 'string', 'case', 'regex', 'url', 'cookie', 'sql'],
  sql: ['sql', 'string', 'regex', 'json', 'array', 'diff', 'url', 'cookie', 'case'],
  case: ['case', 'string', 'regex', 'diff', 'json', 'url', 'cookie', 'array', 'sql'],
  string: ['string', 'case', 'regex', 'diff', 'url', 'cookie', 'json', 'array', 'sql'],
}

export const orderActionGroups = (
  groups: ActionGroup[],
  detectedGroupId: ActionGroupId | null,
) => {
  if (!detectedGroupId) return groups

  const order = groupOrderByDetectedGroup[detectedGroupId]
  return [...groups].sort(
    (left, right) => order.indexOf(left.id) - order.indexOf(right.id),
  )
}
