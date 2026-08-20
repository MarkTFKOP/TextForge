import { forwardRef, useMemo, useState } from 'react'

import type { Action, ActionGroup, ActionGroupId } from '@/types/action'

import { SidebarResizeHandle } from './SidebarResizeHandle'

type SidebarProps = {
  actionGroups: ActionGroup[]
  detectedGroupId: ActionGroupId | null
  onAction: (action: Action) => void
}

type SidebarFilterId = 'all' | ActionGroupId

const normalizeSearch = (value: string) => value.trim().toLowerCase()

const filterActionGroups = (
  actionGroups: ActionGroup[],
  search: string,
  filterId: SidebarFilterId,
) => {
  const normalizedSearch = normalizeSearch(search)

  return actionGroups
    .filter((group) => filterId === 'all' || group.id === filterId)
    .map((group) => {
      if (!normalizedSearch) return group

      const groupMatches = group.title.toLowerCase().includes(normalizedSearch)
      const actions = groupMatches
        ? group.actions
        : group.actions.filter((action) =>
            `${action.label} ${action.id}`.toLowerCase().includes(normalizedSearch),
          )

      return { ...group, actions }
    })
    .filter((group) => group.actions.length > 0)
}

const renderActionGroup = (
  group: ActionGroup,
  detectedGroupId: ActionGroupId | null,
  onAction: (action: Action) => void,
) => (
  <li
    className={[
      'sidebar-group',
      group.id === detectedGroupId ? 'sidebar-group-active' : '',
    ].join(' ')}
    key={group.id}
  >
    <p className="section-title">{group.title}</p>
    <ul className="sidebar-action-list">
      {group.actions.map((action) => (
        <li key={action.id}>
          <button
            className="sidebar-action"
            onClick={() => onAction(action)}
            type="button"
          >
            {action.label}
          </button>
        </li>
      ))}
    </ul>
  </li>
)

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ actionGroups, detectedGroupId, onAction }, ref) => {
    const [search, setSearch] = useState('')
    const [filterId, setFilterId] = useState<SidebarFilterId>('all')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const visibleActionGroups = useMemo(
      () => filterActionGroups(actionGroups, search, filterId),
      [actionGroups, filterId, search],
    )

    return (
      <aside className="sidebar" ref={ref}>
        <div className="sidebar-header">
          <p className="eyebrow">Utilities</p>
          <p className="subtitle">Paste, detect, run.</p>
          <div className="utility-search-row">
            <input
              aria-label="Search tools"
              className="utility-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tools"
              type="search"
              value={search}
            />
            <button
              aria-label="Filter tools"
              aria-expanded={isFilterOpen}
              className={[
                'utility-filter',
                isFilterOpen || filterId !== 'all' ? 'utility-filter-active' : '',
              ].join(' ')}
              onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </button>
          </div>
          {isFilterOpen ? (
            <ul className="utility-filter-menu">
              <li>
                <button
                  className={[
                    'utility-filter-option',
                    filterId === 'all' ? 'utility-filter-option-active' : '',
                  ].join(' ')}
                  onClick={() => {
                    setFilterId('all')
                    setIsFilterOpen(false)
                  }}
                  type="button"
                >
                  All tools
                </button>
              </li>
              {actionGroups.map((group) => (
                <li key={group.id}>
                  <button
                    className={[
                      'utility-filter-option',
                      filterId === group.id ? 'utility-filter-option-active' : '',
                    ].join(' ')}
                    onClick={() => {
                      setFilterId(group.id)
                      setIsFilterOpen(false)
                    }}
                    type="button"
                  >
                    {group.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <ul className="sidebar-groups">
          {visibleActionGroups.map((group) =>
            renderActionGroup(group, detectedGroupId, onAction),
          )}
        </ul>
        {visibleActionGroups.length === 0 ? (
          <p className="sidebar-empty">No tools match.</p>
        ) : null}

        <SidebarResizeHandle />
      </aside>
    )
  },
)

Sidebar.displayName = 'Sidebar'
