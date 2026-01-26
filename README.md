# TextForge

TextForge is a lightweight, frontend-only utility for transforming text and working with JSON through a simple, two-pane interface.

It is designed for fast, predictable transformations with minimal cognitive overhead: paste input, click an action, copy output.

---

## Features

### Core UI
- Two large text fields:
  - **Input** (top)
  - **Output** (bottom)
- Copy button for both input and output
- All operations are **button-driven**
- No configuration panels or hidden behavior

---

### String Utilities

Common, high-frequency string transformations:

- Case conversions:
  - camelCase
  - PascalCase
  - snake_case
  - kebab-case
  - UPPERCASE
  - lowercase
  - Title Case
- Whitespace normalization (trim, collapse spaces)

---

### JSON Utilities

Essential JSON operations for everyday development:

- Validate JSON
- Pretty-print JSON
- Minify JSON
- Convert:
  - JSON → JavaScript object
  - JavaScript object → JSON

Errors are surfaced clearly without breaking the UI.

---

## Design Principles

- **Simplicity first**  
  Paste → click → copy.

- **Button-driven UX**  
  No commands, no magic behavior.

- **Frontend-only**  
  No backend, no network calls.

- **Deterministic output**  
  Same input always produces the same result.

- **Design-system–ready**  
  UI components are structured to follow a shared design system.

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **ShadCN UI** (component foundation)
- ESLint for static analysis

---

## Project Setup

This project is bootstrapped using **Vite** with a React + TypeScript setup and Hot Module Replacement (HMR).

### Available React Plugins

Two official Vite plugins are supported:

- `@vitejs/plugin-react`  
  Uses Babel (or oxc when used with rolldown-vite) for Fast Refresh.

- `@vitejs/plugin-react-swc`  
  Uses SWC for Fast Refresh.

Choose based on build performance and tooling compatibility.

---

## React Compiler

The React Compiler is currently **not compatible with SWC**.  
Progress is tracked in the official Vite plugin issue.

---

## ESLint Configuration

For production-grade development, type-aware linting is recommended.

Example configuration:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // or:
      // tseslint.configs.strictTypeChecked,
      // tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
