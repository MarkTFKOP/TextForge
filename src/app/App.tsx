import { useMemo, useState } from 'react'

import '@/app/App.css'

import { AppProviders } from '@/app/providers/AppProviders'
import { AppShell } from '@/app/layout/AppShell'
import { CommandPalette } from '@/components/command/CommandPalette'
import { FullscreenEditorModal } from '@/components/editor/FullscreenEditorModal'
import { InputEditor } from '@/components/editor/InputEditor'
import { OutputEditor } from '@/components/editor/OutputEditor'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { buildActionGroups, orderActionGroups } from '@/features/action-groups'
import { detectInputKind } from '@/features/input-analyzer'
import { parseJsonArrayLength } from '@/features/json'
import { useCopy } from '@/hooks/useCopy'
import { useSidebarResize } from '@/hooks/useSidebarResize'
import { useToneFeedback } from '@/hooks/useToneFeedback'
import { notify } from '@/lib/notifications'
import type { Action, ActionEffect, ActionOutputView } from '@/types/action'

const applyEffect = (
  effect: ActionEffect,
  setOutputValue: (value: string) => void,
  setOutputView: (view: ActionOutputView | null) => void,
  triggerTone: (tone: 'success' | 'error') => void,
) => {
  if (effect.output !== undefined) {
    setOutputValue(effect.output)
  }
  setOutputView(effect.view ?? null)
  if (effect.notice) {
    notify(effect.notice.message, effect.notice.tone)
  }
  if (effect.tone) {
    triggerTone(effect.tone)
  }
}

function App() {
  const [inputValue, setInputValue] = useState(
    'Button-driven helpers for fast text transforms.',
  )
  const [outputValue, setOutputValue] = useState('')
  const [outputView, setOutputView] = useState<ActionOutputView | null>(null)
  const [fullscreenTarget, setFullscreenTarget] = useState<
    'input' | 'output' | null
  >(null)

  const { tone, trigger, reset } = useToneFeedback()
  const { label: inputCopyLabel, copy: copyInput } = useCopy(inputValue, {
    autoReset: true,
  })
  const { label: outputCopyLabel, copy: copyOutput } = useCopy(outputValue, {
    autoReset: false,
    resetOnValueChange: true,
  })

  const { sidebarRef, width } = useSidebarResize({
    minWidth: 320,
    maxWidthRatio: 0.45,
    handleClassName: 'sidebar-resize-handle',
    storageKey: 'textforge.sidebarWidth',
  })

  const actionGroups = useMemo(() => buildActionGroups(), [])
  const inputAnalysis = useMemo(() => detectInputKind(inputValue), [inputValue])
  const orderedActionGroups = useMemo(
    () => orderActionGroups(actionGroups, inputAnalysis.groupId),
    [actionGroups, inputAnalysis.groupId],
  )

  const executeAction = (action: Action) => {
    const result = action.execute({ input: inputValue })
    if (!result.ok) {
      notify(result.error.message, 'error')
      trigger('error')
      return
    }
    applyEffect(result.value, setOutputValue, setOutputView, trigger)
  }

  const inputStats = {
    total: inputValue.length,
    arrayLength: parseJsonArrayLength(inputValue),
  }
  const outputStats = {
    total: outputValue.length,
    arrayLength: parseJsonArrayLength(outputValue),
  }

  const isInputFullscreen = fullscreenTarget === 'input'
  const isOutputFullscreen = fullscreenTarget === 'output'

  return (
    <AppProviders>
      <AppShell
        sidebarWidth={width}
        sidebar={
          <Sidebar
            ref={sidebarRef}
            actionGroups={orderedActionGroups}
            detectedGroupId={inputAnalysis.groupId}
            onAction={executeAction}
          />
        }
        main={
          <>
            <header className="main-header">
              <div>
                <h1>TextForge</h1>
                <p>{inputAnalysis.label}</p>
              </div>
              <CommandPalette
                actionGroups={orderedActionGroups}
                onAction={executeAction}
              />
            </header>
            <InputEditor
              value={inputValue}
              tone={tone}
              copyLabel={inputCopyLabel}
              onCopy={copyInput}
              onClear={() => {
                setInputValue('')
                setOutputValue('')
                setOutputView(null)
                reset()
              }}
              onFullscreen={() => setFullscreenTarget('input')}
              onChange={(nextValue) => {
                setInputValue(nextValue)
                reset()
              }}
              stats={inputStats}
              autoFocus
            />
            <OutputEditor
              value={outputValue}
              view={outputView}
              copyLabel={outputCopyLabel}
              onCopy={copyOutput}
              onClear={() => {
                setOutputValue('')
                setOutputView(null)
              }}
              onFullscreen={() => setFullscreenTarget('output')}
              onChange={setOutputValue}
              stats={outputStats}
            />
          </>
        }
      />
      {isInputFullscreen && (
        <FullscreenEditorModal
          title="Utility Functions - Input"
          value={inputValue}
          tone={tone}
          copyLabel={inputCopyLabel}
          onCopy={copyInput}
          onClear={() => {
            setInputValue('')
            setOutputValue('')
            setOutputView(null)
            reset()
          }}
          onClose={() => setFullscreenTarget(null)}
          onChange={(nextValue) => {
            setInputValue(nextValue)
            reset()
          }}
        />
      )}
      {isOutputFullscreen && (
        <FullscreenEditorModal
          title="Utility Functions - Output"
          value={outputValue}
          copyLabel={outputCopyLabel}
          onCopy={copyOutput}
          onClear={() => {
            setOutputValue('')
            setOutputView(null)
          }}
          onClose={() => setFullscreenTarget(null)}
          onChange={setOutputValue}
        />
      )}
    </AppProviders>
  )
}

export default App
