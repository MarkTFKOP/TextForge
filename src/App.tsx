import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

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

const findUnsupportedJsonValue = (
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): string | null => {
  if (
    value === undefined ||
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  ) {
    return 'JSON cannot serialize functions, undefined, symbols, or BigInt.'
  }

  if (value && typeof value === 'object') {
    if (seen.has(value)) {
      return 'Circular references cannot be converted to JSON.'
    }
    seen.add(value)

    if (Array.isArray(value)) {
      for (const item of value) {
        const issue = findUnsupportedJsonValue(item, seen)
        if (issue) return issue
      }
      return null
    }

    for (const item of Object.values(value as Record<string, unknown>)) {
      const issue = findUnsupportedJsonValue(item, seen)
      if (issue) return issue
    }
  }

  return null
}

function App() {
  const [inputValue, setInputValue] = useState(
    'Button-driven helpers for fast text transforms.',
  )
  const [outputValue, setOutputValue] = useState('')
  const [inputTone, setInputTone] = useState<'success' | 'error' | null>(null)
  const [inputCopyStatus, setInputCopyStatus] = useState('Copy')
  const [outputCopyStatus, setOutputCopyStatus] = useState('Copy')

  const isJsonInput = useMemo(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) return false
    try {
      JSON.parse(trimmed)
      return true
    } catch (error) {
      return false
    }
  }, [inputValue])

  const notify = (
    message: string,
    tone: 'info' | 'success' | 'error' = 'info',
  ) => {
    if (tone === 'success') {
      toast.success(message)
      return
    }
    if (tone === 'error') {
      toast.error(message)
      return
    }
    toast(message)
  }

  const handleCopy = async (
    value: string,
    setLabel: (label: string) => void,
    options: { autoReset?: boolean } = { autoReset: true },
  ) => {
    try {
      await navigator.clipboard.writeText(value)
      setLabel('Copied')
      if (options.autoReset) {
        window.setTimeout(() => setLabel('Copy'), 1500)
      }
    } catch (error) {
      notify('Copy failed. Please try again.', 'error')
    }
  }

  useEffect(() => {
    setOutputCopyStatus('Copy')
  }, [outputValue])

  const setInputToneWithTimeout = (tone: 'success' | 'error') => {
    setInputTone(tone)
    window.setTimeout(() => setInputTone(null), 2000)
  }

  const caseActions: Action[] = useMemo(
    () => [
      {
        id: 'upper',
        label: 'Upper',
        run: () => {
          setOutputValue(inputValue.toUpperCase())
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'lower',
        label: 'Lower',
        run: () => {
          setOutputValue(inputValue.toLowerCase())
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'title',
        label: 'Title',
        run: () => {
          setOutputValue(toTitleCase(inputValue))
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'camel',
        label: 'Camel',
        run: () => {
          setOutputValue(toCamelCase(inputValue))
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'pascal',
        label: 'Pascal',
        run: () => {
          setOutputValue(toPascalCase(inputValue))
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'snake',
        label: 'Snake',
        run: () => {
          setOutputValue(toSnakeCase(inputValue))
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'kebab',
        label: 'Kebab',
        run: () => {
          setOutputValue(toKebabCase(inputValue))
          setInputToneWithTimeout('success')
        },
      },
    ],
    [inputValue],
  )

  const stringUtilityActions: Action[] = useMemo(
    () => [
      {
        id: 'trim',
        label: 'Trim',
        run: () => {
          setOutputValue(inputValue.trim())
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'collapse-spaces',
        label: 'Collapse Spaces',
        run: () => {
          setOutputValue(inputValue.replace(/\s+/g, ' ').trim())
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'trim-lines',
        label: 'Trim Lines',
        run: () => {
          setOutputValue(
            inputValue
              .split('\n')
              .map((line) => line.trim())
              .join('\n'),
          )
          setInputToneWithTimeout('success')
        },
      },
      {
        id: 'reverse-text',
        label: 'Reverse',
        run: () => {
          setOutputValue(inputValue.split('').reverse().join(''))
          setInputToneWithTimeout('success')
        },
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
            notify('Valid JSON.', 'success')
            setInputToneWithTimeout('success')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            notify(`Invalid JSON: ${message}`, 'error')
            setInputToneWithTimeout('error')
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
            notify('Pretty-printed JSON.', 'success')
            setInputToneWithTimeout('success')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            notify(`Invalid JSON: ${message}`, 'error')
            setInputToneWithTimeout('error')
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
            notify('Minified JSON.', 'success')
            setInputToneWithTimeout('success')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            notify(`Invalid JSON: ${message}`, 'error')
            setInputToneWithTimeout('error')
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
            notify('Converted JSON to JS object literal.', 'success')
            setInputToneWithTimeout('success')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JSON.'
            notify(`Invalid JSON: ${message}`, 'error')
            setInputToneWithTimeout('error')
          }
        },
      },
      {
        id: 'js-to-json',
        label: 'JS Object → JSON',
        run: () => {
          try {
            const parsed = parseJsObjectInput(inputValue)
            const unsupported = findUnsupportedJsonValue(parsed)
            if (unsupported) {
              notify(unsupported, 'error')
              setInputToneWithTimeout('error')
              return
            }
            setOutputValue(JSON.stringify(parsed, null, 2))
            notify('Converted JS object to JSON.', 'success')
            setInputToneWithTimeout('success')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Invalid JS object.'
            notify(`Invalid JS object: ${message}`, 'error')
            setInputToneWithTimeout('error')
          }
        },
      },
    ],
    [inputValue],
  )

  return (
    <>
      <Toaster />
      <div className="app-shell">
        <aside className="sidebar">
        <div className="sidebar-header">
          <p className="eyebrow">Utilities</p>
          <h2>Utility Library</h2>
          <p className="subtitle">
            Paste, click, copy. Fast text and JSON utilities.
          </p>
        </div>
        <div className="sidebar-section">
          <p className="section-title">Case</p>
          {isJsonInput && (
            <p className="text-xs text-slate-400">
              JSON detected. String tools are disabled.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {caseActions.map((action) => (
              <Button
                key={action.id}
                className="w-full justify-start"
                onClick={action.run}
                type="button"
                variant="secondary"
                disabled={isJsonInput}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="sidebar-section">
          <p className="section-title">String</p>
          <div className="grid grid-cols-2 gap-2">
            {stringUtilityActions.map((action) => (
              <Button
                key={action.id}
                className="w-full justify-start"
                onClick={action.run}
                type="button"
                variant="secondary"
                disabled={isJsonInput}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="sidebar-section">
          <p className="section-title">JSON</p>
          <div className="button-stack">
            {jsonActions.map((action) => (
              <Button
                key={action.id}
                className="w-full justify-start"
                onClick={action.run}
                type="button"
                variant="outline"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </aside>

        <main className="main-panel">
        <header className="hero">
          <h1>Function Utility</h1>
          <pre>{"Button Driven Functional Utilities For Developers"}</pre>
        </header>

        <section className="field-block">
          <div className="field-header">
            <h3>Input</h3>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => handleCopy(inputValue, setInputCopyStatus)}
            >
              {inputCopyStatus}
            </Button>
          </div>
          <Textarea
            className={[
              'min-h-[180px] font-mono text-sm transition-colors',
              inputTone === 'success'
                ? 'border-emerald-300 focus-visible:ring-emerald-300'
                : inputTone === 'error'
                  ? 'border-red-300 focus-visible:ring-red-300'
                  : '',
            ].join(' ')}
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
              setInputTone(null)
            }}
            placeholder="Paste text, JSON, or a JS object here."
          />
          <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
            <span>Length: {inputValue.length}</span>
            <span>Chars: {inputValue.length}</span>
          </div>
        </section>

        <section className="field-block">
          <div className="field-header">
            <h3>Output</h3>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                handleCopy(outputValue, setOutputCopyStatus, {
                  autoReset: false,
                })
              }
            >
              {outputCopyStatus}
            </Button>
          </div>
          <Textarea
            className="min-h-[180px] font-mono text-sm bg-white"
            value={outputValue}
            onChange={(event) => setOutputValue(event.target.value)}
            placeholder="Results will appear here."
          />
          <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
            <span>Length: {outputValue.length}</span>
            <span>Chars: {outputValue.length}</span>
          </div>
        </section>
        </main>
      </div>
    </>
  )
}

export default App
