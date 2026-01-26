export const wordsFromText = (value: string) => {
  const cleaned = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .trim()

  return cleaned.length ? cleaned.split(/\s+/) : []
}

export const toTitleCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export const toCamelCase = (value: string) => {
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

export const toPascalCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')

export const toSnakeCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.toLowerCase())
    .join('_')

export const toKebabCase = (value: string) =>
  wordsFromText(value)
    .map((word) => word.toLowerCase())
    .join('-')

export const trimLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

