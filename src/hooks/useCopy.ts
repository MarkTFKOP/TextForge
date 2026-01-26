import { useCallback, useEffect, useState } from 'react'

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
  const { autoReset = true, resetOnValueChange = false } = options
  const [label, setLabel] = useState('Copy')

  const copy = useCallback(async () => {
    const result = await writeClipboard(value)
    if (!result.ok) {
      notify('Copy failed. Please try again.', 'error')
      return
    }
    setLabel('Copied')
    if (autoReset) {
      window.setTimeout(() => setLabel('Copy'), 1500)
    }
  }, [autoReset, value])

  useEffect(() => {
    if (!resetOnValueChange) return
    setLabel('Copy')
  }, [resetOnValueChange, value])

  return { label, copy }
}

