import type { ReactNode } from 'react'

type AppShellProps = {
  sidebarWidth: number
  sidebar: ReactNode
  main: ReactNode
}

export const AppShell = ({ sidebarWidth, sidebar, main }: AppShellProps) => (
  <div className="app-shell" style={{ gridTemplateColumns: `${sidebarWidth}px 1fr` }}>
    {sidebar}
    <main className="main-panel">{main}</main>
  </div>
)

