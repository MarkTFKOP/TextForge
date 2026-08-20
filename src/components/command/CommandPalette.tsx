import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Action, ActionGroup } from '@/types/action'

type CommandPaletteProps = {
  actionGroups: ActionGroup[]
  onAction: (action: Action) => void
}

export const CommandPalette = ({
  actionGroups,
  onAction,
}: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const closePalette = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const openPalette = useCallback(() => {
    setIsOpen(true)
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openPalette()
      }
      if (event.key === 'Escape') {
        closePalette()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closePalette, openPalette])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const visibleActions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return actionGroups
      .flatMap((group) =>
        group.actions.map((action) => ({
          action,
          groupTitle: group.title,
          searchable: `${group.title} ${action.label} ${action.id}`.toLowerCase(),
        })),
      )
      .filter((item) => !normalizedQuery || item.searchable.includes(normalizedQuery))
  }, [actionGroups, query])

  if (!isOpen) {
    return (
      <button className="command-trigger" type="button" onClick={openPalette}>
        <span>Search tools</span>
        <kbd>⌘K</kbd>
      </button>
    )
  }

  const activeIndex =
    visibleActions.length === 0
      ? 0
      : Math.min(selectedIndex, visibleActions.length - 1)
  const selectedAction = visibleActions[activeIndex]?.action
  const runAction = (action: Action) => {
    onAction(action)
    closePalette()
  }

  return (
    <div
      className="command-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePalette()
      }}
    >
      <form
        className="command-panel"
        onSubmit={(event) => {
          event.preventDefault()
          if (!selectedAction) return
          runAction(selectedAction)
        }}
      >
        <input
          ref={inputRef}
          aria-activedescendant={selectedAction ? `command-${selectedAction.id}` : undefined}
          className="command-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSelectedIndex(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              if (visibleActions.length === 0) return
              setSelectedIndex((index) => (index + 1) % visibleActions.length)
              return
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              if (visibleActions.length === 0) return
              setSelectedIndex(
                (index) => (index - 1 + visibleActions.length) % visibleActions.length,
              )
              return
            }
            if (event.key === 'Escape') {
              event.preventDefault()
              closePalette()
              return
            }
            if (event.key !== 'Enter' || !selectedAction) return
            event.preventDefault()
            runAction(selectedAction)
          }}
          placeholder="Type a tool name..."
        />
        <ul className="command-results" role="listbox">
          {visibleActions.map((item, index) => (
            <li key={item.action.id}>
              <button
                id={`command-${item.action.id}`}
                aria-selected={index === activeIndex}
                className={[
                  'command-result',
                  index === activeIndex ? 'command-result-active' : '',
                ].join(' ')}
                role="option"
                type="button"
                onClick={() => runAction(item.action)}
              >
                <span>{item.action.label}</span>
                <small>{item.groupTitle}</small>
              </button>
            </li>
          ))}
        </ul>
        {visibleActions.length === 0 ? (
          <p className="command-empty">No tools found.</p>
        ) : null}
      </form>
    </div>
  )
}
