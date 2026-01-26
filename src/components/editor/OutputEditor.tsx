import { Textarea } from '@/components/ui/textarea'

import type { LengthStats } from '@/components/shared/types'
import { FieldHeader } from '@/components/shared/FieldHeader'

import { EditorFooter } from './EditorFooter'

type OutputEditorProps = {
  value: string
  copyLabel: string
  onCopy: () => void
  onChange: (nextValue: string) => void
  stats: LengthStats
}

export const OutputEditor = ({
  value,
  copyLabel,
  onCopy,
  onChange,
  stats,
}: OutputEditorProps) => (
  <section className="field-block">
    <FieldHeader title="Output" copyLabel={copyLabel} onCopy={onCopy} />
    <Textarea
      className="min-h-[180px] font-mono text-sm bg-white"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Results will appear here."
    />
    <EditorFooter stats={stats} />
  </section>
)

