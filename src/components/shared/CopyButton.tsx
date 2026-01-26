import { Button } from '@/components/ui/button'

type CopyButtonProps = {
  label: string
  onCopy: () => void
}

export const CopyButton = ({ label, onCopy }: CopyButtonProps) => (
  <Button variant="ghost" size="sm" type="button" onClick={onCopy}>
    {label}
  </Button>
)

