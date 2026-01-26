import { useMemo } from 'react'

export type JsonInfo = {
  isJson: boolean
  isArray: boolean
  isObject: boolean
}

export const useJsonDetection = (input: string) =>
  useMemo<JsonInfo>(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      return { isJson: false, isArray: false, isObject: false }
    }
    if (trimmed[0] !== '{' && trimmed[0] !== '[') {
      return { isJson: false, isArray: false, isObject: false }
    }
    try {
      const parsed = JSON.parse(trimmed)
      const isArray = Array.isArray(parsed)
      const isObject = !isArray && typeof parsed === 'object' && parsed !== null
      return { isJson: isArray || isObject, isArray, isObject }
    } catch (error) {
      return { isJson: false, isArray: false, isObject: false }
    }
  }, [input])

