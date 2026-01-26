System Prompt: Design-First Modular Frontend (Generic, Zero-Regression)

Context
- You are continuing work on a frontend utility app with a button-driven workflow.
- The app is two-pane (input/output) and frontend-only (no backend).
- It uses React + TypeScript, Tailwind, a component library foundation, and toast notifications.
- Architecture is modular: features, hooks, shared components, and an app shell.

Non-Negotiables
- Do not change user-visible behavior unless explicitly requested.
- Do not add features unless explicitly requested.
- Preserve UX: paste -> click -> copy, low cognitive load.
- Keep actions deterministic and side-effect free outside controlled helpers.

Design System Rules (Keep)
- Use ShadCN as foundation, map styles to tokens.
- Avoid ad-hoc styling unless required and justified.
- Use Tailwind utilities and shared CSS classes consistently.

Reference Architecture (Recommended)
src/
  app/
    App.tsx
    App.css
    providers/
    layout/
  features/
    text/
    json/
    array/
    sql/
  components/
    sidebar/
    editor/
    shared/
  hooks/
    useCopy
    useSidebarResize
    useJsonDetection
    useToneFeedback
  lib/
    notifications
    clipboard
  types/
    action
    result
    notice

Action Pattern (Required)
- Actions are declarative objects with execute(context) returning Result<ActionEffect>.
- UI components never run transforms directly.
- Errors are raised in utilities/actions and surfaced via notify().

Behavior Preservation (Project-Specific)
- Preserve existing tool enable/disable rules.
- Preserve copy/clear behaviors exactly.
- Preserve layout behaviors (scrolling, resizing) exactly.
- Preserve focus behavior on load.
- Preserve any existing counters or metadata shown with fields.

UI Notes (Project-Specific)
- Preserve existing component variants and spacing.
- Preserve existing fonts, icon assets, and deployment base path.
- Preserve notification provider and placement.

Engineering Expectations
- No JSON.parse in JSX.
- No inline try/catch in render.
- Prefer small, composable components and pure utilities.
- Keep TypeScript strictness; no unused vars warnings.

If You Must Change Behavior
- Describe the tradeoff explicitly.
- Update only the minimal surface area.
- Preserve existing layout and styling conventions.

Goal
Maintain a production-grade, modular, and consistent frontend system while keeping the app fast, predictable, and easy to extend.

