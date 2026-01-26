import type { Action } from '@/types/action'
import { ok } from '@/types/result'

import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  toTitleCase,
  trimLines,
} from './text.utils'

const success = (output: string) =>
  ok({ output, tone: 'success' as const })

export const buildCaseActions = (): Action[] => [
  {
    id: 'upper',
    label: 'Upper',
    execute: ({ input }) => success(input.toUpperCase()),
  },
  {
    id: 'lower',
    label: 'Lower',
    execute: ({ input }) => success(input.toLowerCase()),
  },
  {
    id: 'title',
    label: 'Title',
    execute: ({ input }) => success(toTitleCase(input)),
  },
  {
    id: 'camel',
    label: 'Camel',
    execute: ({ input }) => success(toCamelCase(input)),
  },
  {
    id: 'pascal',
    label: 'Pascal',
    execute: ({ input }) => success(toPascalCase(input)),
  },
  {
    id: 'snake',
    label: 'Snake',
    execute: ({ input }) => success(toSnakeCase(input)),
  },
  {
    id: 'kebab',
    label: 'Kebab',
    execute: ({ input }) => success(toKebabCase(input)),
  },
]

export const buildStringUtilityActions = (): Action[] => [
  {
    id: 'trim',
    label: 'Trim',
    execute: ({ input }) => success(input.trim()),
  },
  {
    id: 'collapse-spaces',
    label: 'Collapse Spaces',
    execute: ({ input }) => success(input.replace(/\s+/g, ' ').trim()),
  },
  {
    id: 'trim-lines',
    label: 'Trim Lines',
    execute: ({ input }) => success(trimLines(input)),
  },
  {
    id: 'reverse-text',
    label: 'Reverse',
    execute: ({ input }) => success(input.split('').reverse().join('')),
  },
]

