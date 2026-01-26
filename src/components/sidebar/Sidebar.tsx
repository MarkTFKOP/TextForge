import { forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import type { Action } from '@/types/action'

import { SidebarResizeHandle } from './SidebarResizeHandle'
import { SidebarSection } from './SidebarSection'

type SidebarProps = {
  caseActions: Action[]
  stringActions: Action[]
  sqlActions: Action[]
  arrayActions: Action[]
  jsonActions: Action[]
  isJson: boolean
  isArray: boolean
  onAction: (action: Action) => void
}

const renderActions = (
  actions: Action[],
  onAction: (action: Action) => void,
  disabled: boolean,
  variant: 'secondary' | 'outline' = 'secondary',
) => (
  <div className="button-wrap">
    {actions.map((action) => (
      <Button
        key={action.id}
        className="sidebar-button"
        onClick={() => onAction(action)}
        type="button"
        variant={variant}
        disabled={disabled}
      >
        {action.label}
      </Button>
    ))}
  </div>
)

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      caseActions,
      stringActions,
      sqlActions,
      arrayActions,
      jsonActions,
      isJson,
      isArray,
      onAction,
    },
    ref,
  ) => (
    <aside className="sidebar" ref={ref}>
      <div className="sidebar-header">
        <p className="eyebrow">Utilities</p>
        <p className="subtitle">Paste, click, copy. Fast text and JSON utilities.</p>
      </div>

      <SidebarSection
        title="Case"
        hint={isJson ? 'JSON detected. String tools are disabled.' : undefined}
      >
        {renderActions(caseActions, onAction, isJson)}
      </SidebarSection>

      <SidebarSection title="String">
        {renderActions(stringActions, onAction, isJson)}
      </SidebarSection>

      <SidebarSection title="SQL">
        {renderActions(sqlActions, onAction, false)}
      </SidebarSection>

    <SidebarSection title="JSON">
      {renderActions(jsonActions, onAction, !isJson)}
    </SidebarSection>

    <SidebarSection title="Array">
      {renderActions(arrayActions, onAction, !isArray)}
    </SidebarSection>

      <SidebarResizeHandle />
    </aside>
  ),
)

Sidebar.displayName = 'Sidebar'

