import type { Notice } from './notice'
import type { Result } from './result'

export type ActionContext = {
  input: string
}

export type ActionEffect = {
  output?: string
  notice?: Notice
  tone?: 'success' | 'error'
}

export type Action = {
  id: string
  label: string
  isEnabled?: (context: ActionContext) => boolean
  execute: (context: ActionContext) => Result<ActionEffect>
}

export type ActionGroupId =
  | 'case'
  | 'string'
  | 'json'
  | 'array'
  | 'sql'
  | 'regex'
  | 'url'
  | 'cookie'
  | 'diff'

export type ActionGroup = {
  id: ActionGroupId
  title: string
  actions: Action[]
}
