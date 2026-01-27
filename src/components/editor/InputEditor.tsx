import { Textarea } from '@/components/ui/textarea'

import type { LengthStats } from '@/components/shared/types'
import { FieldHeader } from '@/components/shared/FieldHeader'

import { EditorFooter } from './EditorFooter'

type InputEditorProps = {
  value: string
  tone: 'success' | 'error' | null
  copyLabel: string
  onCopy: () => void
  onClear: () => void
  onFullscreen: () => void
  onChange: (nextValue: string) => void
  stats: LengthStats
  autoFocus?: boolean
}

export const InputEditor = ({
  value,
  tone,
  copyLabel,
  onCopy,
  onClear,
  onFullscreen,
  onChange,
  stats,
  autoFocus = false,
}: InputEditorProps) => (
  <section className="field-block">
    <FieldHeader
      title="Input"
      copyLabel={copyLabel}
      onCopy={onCopy}
      onClear={onClear}
    />
    <div className="editor-textarea">
      <Textarea
        className={[
          'min-h-[200px] font-mono text-sm transition-colors',
          tone === 'success'
            ? 'border-emerald-300 focus-visible:ring-emerald-300'
            : tone === 'error'
              ? 'border-red-300 focus-visible:ring-red-300'
              : '',
        ].join(' ')}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste text, JSON, or a JS object here."
      />
      <button
        className="fullscreen-trigger"
        type="button"
        onClick={onFullscreen}
        aria-label="Open input in full screen"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3H3v4m14-4h4v4M7 21H3v-4m18 4h-4v-4" />
        </svg>
      </button>
    </div>
    <EditorFooter stats={stats} />
  </section>
)

