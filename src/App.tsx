import { useMemo, useState } from 'react'
import './App.css'

type Action = {
  id: string
  label: string
  run: () => void
}

const wordsFromText = (value: string) => {
  const cleaned = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .trim()

  return cleaned.length ? cleaned.split(/\s+/) : []
}

const toTitleCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

const toCamelCase = (value: string) => {
  const words = wordsFromText(value)
  if (!words.length) return ''
  const [first, ...rest] = words
  return (
    first.toLowerCase() +
    rest
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  )
}

const toPascalCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')

const toSnakeCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.toLowerCase())
    .join('_')

const toKebabCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.toLowerCase())
    .join('-')

const parseJsObjectInput = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error('Input is empty.')
  }

  const assignmentMatch = trimmed.match(
    /^(const|let|var)\s+\w+\s*=\s*([\s\S]+);?$/,
  )
  const expression = assignmentMatch ? assignmentMatch[2] : trimmed

  try {
    // Evaluate as an object literal or expression in a safe-ish sandboxed scope.
    return new Function(`"use strict"; return (${expression});`)()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JS object.'
    throw new Error(message)
  }
}

function App() {
  const [inputValue, setInputValue] = useState(
    'What i want to build is a simple util function',
  )
  const [outputValue, setOutputValue] = useState('')
  const [notice, setNotice] = useState('Ready.')
  const [inputCopyStatus, setInputCopyStatus] = useState('Copy')
  const [outputCopyStatus, setOutputCopyStatus] = useState('Copy')

  const setNoticeWithTimeout = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice('Ready.'), 3000)
  }

  const handleCopy = async (
    value: string,
    setLabel: (label: string) => void,
  ) => {
    try {
      await navigator.clipboard.writeText(value)
      setLabel('Copied')
      window.setTimeout(() => setLabel('Copy'), 1500)
    } catch (error) {
      setNoticeWithTimeout('Copy failed. Please try again.')
    }
  }

  const stringActions: Action[] = useMemo(
    () => [
      {
        id: 'upper',
        label: 'UPPERCASE',
        run: () => setOutputValue(inputValue.toUpperCase()),
      },
      {
        id: 'lower',
        label: 'lowercase',
        run: () => setOutputValue(inputValue.toLowerCase()),
      },
      {
        id: 'title',
        label: 'Title Case',
        run: () => setOutputValue(toTitleCase(inputValue)),
      },
      {
        id: 'camel',
        label: 'camelCase',
        run: () => setOutputValue(toCamelCase(inputValue)),
      },
      {
        id: 'pascal',
        label: 'PascalCase',
        run: () => setOutputValue(toPascalCase(inputValue)),
      },
      {
        id: 'snake',
        label: 'snake_case',
        run: () => setOutputValue(toSnakeCase(inputValue)),
      },
      {
        id: 'kebab',
        label: 'kebab-case',
        run: () => setOutputValue(toKebabCase(inputValue)),
      },
    ],
    [inputValue],
  )

  const jsonActions: Action[] = useMemo(
    () => [
      {
        id: 'validate-json',
        label: 'Validate JSON',
        run: () => {
          try {
            JSON.parse(inputValue)
            setNoticeWithTimeout('Valid JSON.')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            setNoticeWithTimeout(`Invalid JSON: ${message}`)
          }
        },
      },
      {
        id: 'pretty-json',
        label: 'Pretty-print JSON',
        run: () => {
          try {
            const parsed = JSON.parse(inputValue)
            setOutputValue(JSON.stringify(parsed, null, 2))
            setNoticeWithTimeout('Pretty-printed JSON.')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            setNoticeWithTimeout(`Invalid JSON: ${message}`)
          }
        },
      },
      {
        id: 'minify-json',
        label: 'Minify JSON',
        run: () => {
          try {
            const parsed = JSON.parse(inputValue)
            setOutputValue(JSON.stringify(parsed))
            setNoticeWithTimeout('Minified JSON.')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            setNoticeWithTimeout(`Invalid JSON: ${message}`)
          }
        },
      },
      {
        id: 'json-to-js',
        label: 'JSON → JS Object',
        run: () => {
          try {
            const parsed = JSON.parse(inputValue)
            const formatted = `const data = ${JSON.stringify(
              parsed,
              null,
              2,
            )};`
            setOutputValue(formatted)
            setNoticeWithTimeout('Converted JSON to JS object literal.')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            setNoticeWithTimeout(`Invalid JSON: ${message}`)
          }
        },
      },
      {
        id: 'js-to-json',
        label: 'JS Object → JSON',
        run: () => {
          try {
            const parsed = parseJsObjectInput(inputValue)
            setOutputValue(JSON.stringify(parsed, null, 2))
            setNoticeWithTimeout('Converted JS object to JSON.')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JS object.'
            setNoticeWithTimeout(`Invalid JS object: ${message}`)
          }
        },
      },
    ],
    [inputValue],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="eyebrow">Utilities</p>
          <h2>Function Library</h2>
          <p className="subtitle">
            Button-driven helpers for fast text transforms.
          </p>
        </div>
        <div className="sidebar-section">
          <p className="section-title">String</p>
          <div className="button-stack">
            {stringActions.map((action) => (
              <button
                key={action.id}
                className="action-button"
                onClick={action.run}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
        <div className="sidebar-section">
          <p className="section-title">JSON</p>
          <div className="button-stack">
            {jsonActions.map((action) => (
              <button
                key={action.id}
                className="action-button secondary"
                onClick={action.run}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="hero">
          <h1>Simple Utility Functions</h1>
          <p>
            What i want to build is a simple util function. It must be easy to
            use.
          </p>
          <div className="notice">{notice}</div>
        </header>

        <section className="field-block">
          <div className="field-header">
            <h3>Input</h3>
            <button
              className="ghost-button"
              type="button"
              onClick={() => handleCopy(inputValue, setInputCopyStatus)}
            >
              {inputCopyStatus}
            </button>
          </div>
          <textarea
            className="text-area"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Paste text, JSON, or a JS object here."
          />
        </section>

        <section className="field-block">
          <div className="field-header">
            <h3>Output</h3>
            <button
              className="ghost-button"
              type="button"
              onClick={() => handleCopy(outputValue, setOutputCopyStatus)}
            >
              {outputCopyStatus}
            </button>
          </div>
          <textarea
            className="text-area output"
            value={outputValue}
            onChange={(event) => setOutputValue(event.target.value)}
            placeholder="Results will appear here."
          />
        </section>
      </main>
    </div>
  )
}

export default App
