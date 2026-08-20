import { useCallback, useEffect, useRef, useState } from 'react'

type SidebarResizeOptions = {
  minWidth: number
  maxWidthRatio: number
  handleClassName: string
  storageKey?: string
}

export const useSidebarResize = ({
  minWidth,
  maxWidthRatio,
  handleClassName,
  storageKey,
}: SidebarResizeOptions) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(() => {
    if (!storageKey) return minWidth
    const stored = window.localStorage.getItem(storageKey)
    const parsed = stored ? Number.parseInt(stored, 10) : NaN
    return Number.isFinite(parsed) ? Math.max(parsed, minWidth) : minWidth
  })

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      if (!event.target.classList.contains(handleClassName)) return

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const maxWidth = Math.floor(window.innerWidth * maxWidthRatio)
        const nextWidth = Math.min(Math.max(moveEvent.clientX, minWidth), maxWidth)
        setWidth(nextWidth)
        if (storageKey) {
          window.localStorage.setItem(storageKey, String(nextWidth))
        }
      }

      const handleMouseUp = () => {
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [handleClassName, maxWidthRatio, minWidth, storageKey],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [handleMouseDown])

  return { sidebarRef, width }
}
