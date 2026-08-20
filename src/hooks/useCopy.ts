import { useCallback, useState } from 'react'

import { writeClipboard } from '@/lib/clipboard'
import { notify } from '@/lib/notifications'

type UseCopyOptions = {
  autoReset?: boolean
  resetOnValueChange?: boolean
}

export const useCopy = (
  value: string,
  options: UseCopyOptions = { autoReset: true, resetOnValueChange: false },
) => {
  const { autoReset = true } = options
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const label = copiedValue === value ? 'Copied' : 'Copy'

  const copy = useCallback(async () => {
    const result = await writeClipboard(value)
    if (!result.ok) {
      notify('Copy failed. Please try again.', 'error')
      return
    }
    setCopiedValue(value)
    if (autoReset) {
      window.setTimeout(() => setCopiedValue(null), 1500)
    }
  }, [autoReset, value])

  return { label, copy }
}
