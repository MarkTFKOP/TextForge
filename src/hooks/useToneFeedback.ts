import { useCallback, useState } from 'react'

export const useToneFeedback = () => {
  const [tone, setTone] = useState<'success' | 'error' | null>(null)

  const trigger = useCallback((nextTone: 'success' | 'error') => {
    setTone(nextTone)
    window.setTimeout(() => setTone(null), 2000)
  }, [])

  const reset = useCallback(() => setTone(null), [])

  return { tone, trigger, reset }
}

