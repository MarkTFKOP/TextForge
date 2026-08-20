import { Button } from '@/components/ui/button'
import { writeClipboard } from '@/lib/clipboard'
import { notify } from '@/lib/notifications'
import type { ActionOutputView, TableOutputRow } from '@/types/action'

type StructuredOutputProps = {
  view: ActionOutputView
}

const displayValue = (value: string) => (value === '' ? '(empty)' : value)

const copyRowValue = async (row: TableOutputRow) => {
  const result = await writeClipboard(row.value)
  if (!result.ok) {
    notify('Copy failed. Please try again.', 'error')
    return
  }
  notify(`Copied ${row.label}.`, 'success')
}

export const StructuredOutput = ({ view }: StructuredOutputProps) => (
  <div className="structured-output">
    <div className="structured-output-header">
      <h4>{view.title}</h4>
      <span>{view.rows.length} rows</span>
    </div>
    <div className="structured-output-table-wrap">
      <table className="structured-output-table">
        <thead>
          <tr>
            <th scope="col">Field</th>
            <th scope="col">Value</th>
            <th scope="col">Copy</th>
          </tr>
        </thead>
        <tbody>
          {view.rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              <td>{displayValue(row.value)}</td>
              <td>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => void copyRowValue(row)}
                >
                  Copy
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
