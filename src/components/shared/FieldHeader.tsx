import { CopyButton } from './CopyButton'

type FieldHeaderProps = {
  title: string
  copyLabel: string
  onCopy: () => void
}

export const FieldHeader = ({ title, copyLabel, onCopy }: FieldHeaderProps) => (
  <div className="field-header">
    <h3>{title}</h3>
    <CopyButton label={copyLabel} onCopy={onCopy} />
  </div>
)

