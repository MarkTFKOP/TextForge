import { useCallback, useEffect, useRef, useState } from 'react'

type SidebarResizeOptions = {
  minWidth: number
  maxWidthRatio: number
  handleClassName: string
}

export const useSidebarResize = ({
  minWidth,
  maxWidthRatio,
  handleClassName,
}: SidebarResizeOptions) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(minWidth)

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const maxWidth = Math.floor(window.innerWidth * maxWidthRatio)
      const nextWidth = Math.min(Math.max(event.clientX, minWidth), maxWidth)
      setWidth(nextWidth)
    },
    [maxWidthRatio, minWidth],
  )

  const handleMouseUp = useCallback(() => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      if (!event.target.classList.contains(handleClassName)) return
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [handleClassName, handleMouseMove, handleMouseUp],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp])

  return { sidebarRef, width }
}

