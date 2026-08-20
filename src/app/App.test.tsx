import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

const inputEditor = () =>
  screen.getByPlaceholderText('Paste JSON, URL, cookie header, SQL, regex, or text.')

const outputEditor = () => screen.getByPlaceholderText('Output appears here.')

const detectedLabel = (container: HTMLElement) =>
  container.querySelector('.main-header p')?.textContent

const sidebarGroups = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.section-title')).map(
    (title) => title.textContent,
  )

const activeCommandLabel = (container: HTMLElement) =>
  container.querySelector('.command-result-active span')?.textContent

describe('App', () => {
  it('opens Cmd+K command field', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.getByPlaceholderText('Type a tool name...')).toBeInTheDocument()
  })

  it('runs the first Cmd+K result with Enter', () => {
    render(<App />)
    fireEvent.change(inputEditor(), { target: { value: 'https://example.com?a=1' } })
    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    const commandInput = screen.getByPlaceholderText('Type a tool name...')
    fireEvent.change(commandInput, { target: { value: 'parse url' } })
    fireEvent.keyDown(commandInput, { key: 'Enter' })

    expect(screen.getByText('URL parts')).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /Hostname example.com/i })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Output appears here.')).not.toBeInTheDocument()
  })

  it('renders cookie parser output as a table', () => {
    render(<App />)
    fireEvent.change(inputEditor(), { target: { value: 'sid=abc; theme=dark' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cookie → JSON' }))

    expect(screen.getByText('Cookie values')).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /sid abc/i })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /theme dark/i })).toBeInTheDocument()
  })

  it('navigates Cmd+K results with arrow keys and runs the selected action', () => {
    const { container } = render(<App />)
    fireEvent.change(inputEditor(), { target: { value: ' hello   world ' } })
    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    const commandInput = screen.getByPlaceholderText('Type a tool name...')
    expect(activeCommandLabel(container)).toBe('Trim')

    fireEvent.keyDown(commandInput, { key: 'ArrowDown' })
    expect(activeCommandLabel(container)).toBe('Collapse Spaces')

    fireEvent.keyDown(commandInput, { key: 'Enter' })
    expect(outputEditor()).toHaveValue('hello world')
  })

  it('shows empty Cmd+K state and clears query after Escape', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    const commandInput = screen.getByPlaceholderText('Type a tool name...')
    fireEvent.change(commandInput, { target: { value: 'zzzz-no-tool' } })
    expect(screen.getByText('No tools found.')).toBeInTheDocument()

    fireEvent.keyDown(commandInput, { key: 'Escape' })
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.getByPlaceholderText('Type a tool name...')).toHaveValue('')
  })

  it('updates detected input label', () => {
    const { container } = render(<App />)
    fireEvent.change(inputEditor(), { target: { value: '{"a":1}' } })
    expect(detectedLabel(container)).toBe('JSON object')

    fireEvent.change(inputEditor(), { target: { value: 'https://example.com?a=1' } })
    expect(detectedLabel(container)).toBe('URL')

    fireEvent.change(inputEditor(), { target: { value: 'sid=abc; theme=dark' } })
    expect(detectedLabel(container)).toBe('Cookie header')
  })

  it('renders dense grouped sidebar actions', () => {
    const { container } = render(<App />)
    expect(container.querySelectorAll('.sidebar-action-list').length).toBeGreaterThan(4)
    expect(screen.getByRole('button', { name: 'Parse URL' })).toBeInTheDocument()
  })

  it('searches sidebar tools', () => {
    render(<App />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tools' }), {
      target: { value: 'cookie' },
    })

    expect(screen.getByRole('button', { name: 'Cookie → JSON' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'JSON → Cookie' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Parse URL' })).not.toBeInTheDocument()
  })

  it('filters sidebar tools by group', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Filter tools' }))
    fireEvent.click(screen.getByRole('button', { name: 'URL' }))

    expect(screen.getByRole('button', { name: 'Parse URL' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cookie → JSON' })).not.toBeInTheDocument()
  })

  it('orders sidebar groups by detected input', () => {
    const { container } = render(<App />)

    fireEvent.change(inputEditor(), { target: { value: '{"a":1}' } })
    expect(sidebarGroups(container).slice(0, 3)).toEqual(['JSON', 'Diff', 'URL'])

    fireEvent.change(inputEditor(), { target: { value: 'https://example.com?a=1' } })
    expect(sidebarGroups(container).slice(0, 3)).toEqual(['URL', 'JSON', 'Cookie'])

    fireEvent.change(inputEditor(), { target: { value: 'sid=abc; theme=dark' } })
    expect(sidebarGroups(container).slice(0, 3)).toEqual(['Cookie', 'JSON', 'URL'])

    fireEvent.change(inputEditor(), { target: { value: 'plain text' } })
    expect(sidebarGroups(container).slice(0, 3)).toEqual(['String', 'Case', 'Regex'])
  })

  it('runs paste to action to output flow', () => {
    render(<App />)
    fireEvent.change(inputEditor(), { target: { value: '{"b":1,"a":2}' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sort Keys' }))
    expect(outputEditor()).toHaveValue('{\n  "a": 2,\n  "b": 1\n}')
  })
})
