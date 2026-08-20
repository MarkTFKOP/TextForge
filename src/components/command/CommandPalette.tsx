import { useEffect, useMemo, useRef, useState } from 'react'

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
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen(true)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
          searchable: `${group.title} ${action.label}`.toLowerCase(),
        })),
      )
      .filter((item) => !normalizedQuery || item.searchable.includes(normalizedQuery))
  }, [actionGroups, query])

  if (!isOpen) {
    return (
      <button className="command-trigger" type="button" onClick={() => setIsOpen(true)}>
        <span>Search tools</span>
        <kbd>⌘K</kbd>
      </button>
    )
  }

  const firstAction = visibleActions[0]?.action
  const runAction = (action: Action) => {
    onAction(action)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="command-overlay" role="dialog" aria-modal="true">
      <form
        className="command-panel"
        onSubmit={(event) => {
          event.preventDefault()
          if (!firstAction) return
          runAction(firstAction)
        }}
      >
        <input
          ref={inputRef}
          className="command-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || !firstAction) return
            event.preventDefault()
            runAction(firstAction)
          }}
          placeholder="Type a tool name..."
        />
        <ul className="command-results">
          {visibleActions.map((item, index) => (
            <li key={item.action.id}>
              <button
                className={[
                  'command-result',
                  index === 0 ? 'command-result-active' : '',
                ].join(' ')}
                type="button"
                onClick={() => runAction(item.action)}
              >
                <span>{item.action.label}</span>
                <small>{item.groupTitle}</small>
              </button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  )
}
