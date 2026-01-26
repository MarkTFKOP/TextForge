import { CopyButton } from './CopyButton'
import { Button } from '@/components/ui/button'

type FieldHeaderProps = {
  title: string
  copyLabel: string
  onCopy: () => void
  onClear: () => void
}

export const FieldHeader = ({
  title,
  copyLabel,
  onCopy,
  onClear,
}: FieldHeaderProps) => (
  <div className="field-header">
    <h3>{title}</h3>
    <div className="flex items-center gap-2">
      <CopyButton label={copyLabel} onCopy={onCopy} />
      <Button variant="outline" size="sm" type="button" onClick={onClear}>
        Clear
      </Button>
    </div>
  </div>
)

