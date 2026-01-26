import { err, ok, type Result } from '@/types/result'

export const writeClipboard = async (value: string): Promise<Result<void>> => {
  try {
    await navigator.clipboard.writeText(value)
    return ok(undefined)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Copy failed.'
    return err(new Error(message))
  }
}

