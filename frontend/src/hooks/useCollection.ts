import { useLocalStorage } from "@/hooks/useLocalStorage"

export function useCollection<T extends { id: string }>(key: string) {
  const [items, setItems] = useLocalStorage<T[]>(key, [])

  function add(item: Omit<T, "id">) {
    const newItem = { ...item, id: crypto.randomUUID() } as T
    setItems((prev) => [...prev, newItem])
    return newItem
  }

  function update(id: string, patch: Partial<T>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, add, update, remove }
}
