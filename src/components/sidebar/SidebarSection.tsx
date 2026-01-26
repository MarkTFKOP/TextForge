import type { ReactNode } from 'react'

type SidebarSectionProps = {
  title: string
  hint?: string
  children: ReactNode
}

export const SidebarSection = ({ title, hint, children }: SidebarSectionProps) => (
  <div className="sidebar-section">
    <p className="section-title">{title}</p>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
    {children}
  </div>
)

