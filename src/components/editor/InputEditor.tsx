import { Textarea } from '@/components/ui/textarea'

import type { LengthStats } from '@/components/shared/types'
import { FieldHeader } from '@/components/shared/FieldHeader'

import { EditorFooter } from './EditorFooter'

type InputEditorProps = {
  value: string
  tone: 'success' | 'error' | null
  copyLabel: string
  onCopy: () => void
  onChange: (nextValue: string) => void
  stats: LengthStats
  autoFocus?: boolean
}

export const InputEditor = ({
  value,
  tone,
  copyLabel,
  onCopy,
  onChange,
  stats,
  autoFocus = false,
}: InputEditorProps) => (
  <section className="field-block">
    <FieldHeader title="Input" copyLabel={copyLabel} onCopy={onCopy} />
    <Textarea
      className={[
        'min-h-[180px] font-mono text-sm transition-colors',
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
    <EditorFooter stats={stats} />
  </section>
)

