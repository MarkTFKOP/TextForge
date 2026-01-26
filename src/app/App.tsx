import { useMemo, useState } from 'react'

import '@/app/App.css'

import { AppProviders } from '@/app/providers/AppProviders'
import { AppShell } from '@/app/layout/AppShell'
import { InputEditor } from '@/components/editor/InputEditor'
import { OutputEditor } from '@/components/editor/OutputEditor'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { buildArrayActions } from '@/features/array'
import { buildJsonActions, parseJsonArrayLength } from '@/features/json'
import { buildSqlActions } from '@/features/sql'
import { buildCaseActions, buildStringUtilityActions } from '@/features/text'
import { useCopy } from '@/hooks/useCopy'
import { useJsonDetection } from '@/hooks/useJsonDetection'
import { useSidebarResize } from '@/hooks/useSidebarResize'
import { useToneFeedback } from '@/hooks/useToneFeedback'
import { notify } from '@/lib/notifications'
import type { Action, ActionEffect } from '@/types/action'

const applyEffect = (
  effect: ActionEffect,
  setOutputValue: (value: string) => void,
  triggerTone: (tone: 'success' | 'error') => void,
) => {
  if (effect.output !== undefined) {
    setOutputValue(effect.output)
  }
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

  const { tone, trigger, reset } = useToneFeedback()
  const { label: inputCopyLabel, copy: copyInput } = useCopy(inputValue, {
    autoReset: true,
  })
  const { label: outputCopyLabel, copy: copyOutput } = useCopy(outputValue, {
    autoReset: false,
    resetOnValueChange: true,
  })

  const jsonInfo = useJsonDetection(inputValue)
  const { sidebarRef, width } = useSidebarResize({
    minWidth: 320,
    maxWidthRatio: 0.45,
    handleClassName: 'sidebar-resize-handle',
    storageKey: 'textforge.sidebarWidth',
  })

  const caseActions = useMemo(() => buildCaseActions(), [])
  const stringActions = useMemo(() => buildStringUtilityActions(), [])
  const sqlActions = useMemo(() => buildSqlActions(), [])
  const arrayActions = useMemo(() => buildArrayActions(), [])
  const jsonActions = useMemo(() => buildJsonActions(), [])

  const executeAction = (action: Action) => {
    const result = action.execute({ input: inputValue })
    if (!result.ok) {
      notify(result.error.message, 'error')
      trigger('error')
      return
    }
    applyEffect(result.value, setOutputValue, trigger)
  }

  const inputStats = {
    total: inputValue.length,
    arrayLength: parseJsonArrayLength(inputValue),
  }
  const outputStats = {
    total: outputValue.length,
    arrayLength: parseJsonArrayLength(outputValue),
  }

  return (
    <AppProviders>
      <AppShell
        sidebarWidth={width}
        sidebar={
          <Sidebar
            ref={sidebarRef}
            caseActions={caseActions}
            stringActions={stringActions}
            sqlActions={sqlActions}
            arrayActions={arrayActions}
            jsonActions={jsonActions}
            isJson={jsonInfo.isJson}
            isArray={jsonInfo.isArray}
            onAction={executeAction}
          />
        }
        main={
          <>
            <header className="hero">
              <h1>Function Utility</h1>
              <pre>{'Button Driven Functional Utilities For Developers'}</pre>
            </header>
            <InputEditor
              value={inputValue}
              tone={tone}
              copyLabel={inputCopyLabel}
              onCopy={copyInput}
              onChange={(nextValue) => {
                setInputValue(nextValue)
                reset()
              }}
              stats={inputStats}
              autoFocus
            />
            <OutputEditor
              value={outputValue}
              copyLabel={outputCopyLabel}
              onCopy={copyOutput}
              onChange={setOutputValue}
              stats={outputStats}
            />
          </>
        }
      />
    </AppProviders>
  )
}

export default App

