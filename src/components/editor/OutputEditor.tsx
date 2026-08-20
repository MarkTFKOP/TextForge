import { Textarea } from '@/components/ui/textarea'

import type { LengthStats } from '@/components/shared/types'
import { FieldHeader } from '@/components/shared/FieldHeader'
import { StructuredOutput } from '@/components/output/StructuredOutput'
import type { ActionOutputView } from '@/types/action'

import { EditorFooter } from './EditorFooter'

type OutputEditorProps = {
  value: string
  view?: ActionOutputView | null
  copyLabel: string
  onCopy: () => void
  onClear: () => void
  onFullscreen: () => void
  onChange: (nextValue: string) => void
  stats: LengthStats
}

export const OutputEditor = ({
  value,
  view = null,
  copyLabel,
  onCopy,
  onClear,
  onFullscreen,
  onChange,
  stats,
}: OutputEditorProps) => (
  <section className="field-block">
    <FieldHeader
      title="Output"
      copyLabel={copyLabel}
      onCopy={onCopy}
      onClear={onClear}
    />
    {view ? (
      <StructuredOutput view={view} />
    ) : (
      <div className="editor-textarea">
        <Textarea
          className="min-h-[200px] text-sm bg-white"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Output appears here."
        />
        <button
          className="fullscreen-trigger"
          type="button"
          onClick={onFullscreen}
          aria-label="Open output in full screen"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3H3v4m14-4h4v4M7 21H3v-4m18 4h-4v-4" />
          </svg>
        </button>
      </div>
    )}
    <EditorFooter stats={stats} />
  </section>
)
