import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key)
    if (!stored) return initialValue
    try {
      return JSON.parse(stored) as T
    } catch {
      return initialValue
    }
  })

  function set(next: T) {
    setValue(next)
    window.localStorage.setItem(key, JSON.stringify(next))
  }

  return [value, set] as const
}
