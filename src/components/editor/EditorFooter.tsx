import type { LengthStats } from '@/components/shared/types'

type EditorFooterProps = {
  stats: LengthStats
}

export const EditorFooter = ({ stats }: EditorFooterProps) => (
  <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
    {stats.arrayLength !== null && (
      <span>Array length: {stats.arrayLength}</span>
    )}
    <span>Length: {stats.total}</span>
    <span>Chars: {stats.total}</span>
  </div>
)

