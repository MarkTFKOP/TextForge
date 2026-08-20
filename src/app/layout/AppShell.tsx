import type { CSSProperties, ReactNode } from 'react'

type AppShellProps = {
  sidebarWidth: number
  sidebar: ReactNode
  main: ReactNode
}

export const AppShell = ({ sidebarWidth, sidebar, main }: AppShellProps) => (
  <div
    className="app-shell"
    style={{ '--sidebar-width': `${sidebarWidth}px` } as CSSProperties}
  >
    {sidebar}
    <main className="main-panel">{main}</main>
  </div>
)
