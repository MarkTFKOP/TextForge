import { err, ok, type Result } from '@/types/result'

export type DiffBlocks = {
  left: string
  right: string
}

export const splitDiffBlocks = (input: string): Result<DiffBlocks> => {
  const lines = input.split(/\r?\n/)
  const separatorIndexes = lines
    .map((line, index) => (line.trim() === '---' ? index : -1))
    .filter((index) => index !== -1)

  if (separatorIndexes.length !== 1) {
    return err('Expected exactly one separator line containing ---.')
  }

  const separatorIndex = separatorIndexes[0]
  const left = lines.slice(0, separatorIndex).join('\n').trim()
  const right = lines.slice(separatorIndex + 1).join('\n').trim()

  if (!left || !right) {
    return err('Both sides of the comparison must contain text.')
  }

  return ok({ left, right })
}

export const hasDiffSeparator = (input: string) =>
  input.split(/\r?\n/).filter((line) => line.trim() === '---').length === 1
