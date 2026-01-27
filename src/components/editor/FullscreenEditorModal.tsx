import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type FullscreenEditorModalProps = {
  title: string
  value: string
  tone?: 'success' | 'error' | null
  copyLabel: string
  onCopy: () => void
  onClear: () => void
  onClose: () => void
  onChange: (nextValue: string) => void
}

export const FullscreenEditorModal = ({
  title,
  value,
  tone = null,
  copyLabel,
  onCopy,
  onClear,
  onClose,
  onChange,
}: FullscreenEditorModalProps) => (
  <div className="fullscreen-overlay" role="dialog" aria-modal="true">
    <div className="fullscreen-panel">
      <div className="fullscreen-header">
        <h3>{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onCopy}>
            {copyLabel}
          </Button>
          <Button variant="outline" size="sm" type="button" onClick={onClear}>
            Clear
          </Button>
          <button
            className="fullscreen-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>
      </div>
      <Textarea
        className={[
          'flex-1 min-h-0 font-mono text-sm',
          tone === 'success'
            ? 'border-emerald-300 focus-visible:ring-emerald-300'
            : tone === 'error'
              ? 'border-red-300 focus-visible:ring-red-300'
              : '',
        ].join(' ')}
        value={value}
        autoFocus
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  </div>
)

