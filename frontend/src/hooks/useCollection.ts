import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"

export function useCollection<T extends { id: string }>(resource: string) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = useCallback(() => {
    return api.get<T[]>(resource).then((res) => setItems(res.data))
  }, [resource])

  useEffect(() => {
    fetchItems().finally(() => setIsLoading(false))
  }, [fetchItems])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchItems()
    setIsLoading(false)
  }, [fetchItems])

  async function add(item: Omit<T, "id">) {
    const res = await api.post<T>(resource, item)
    setItems((prev) => [...prev, res.data])
    return res.data
  }

  async function update(id: string, patch: Partial<T>) {
    const res = await api.patch<T>(`${resource}/${id}`, patch)
    setItems((prev) => prev.map((item) => (item.id === id ? res.data : item)))
  }

  async function remove(id: string) {
    await api.delete(`${resource}/${id}`)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, isLoading, add, update, remove, refetch }
}
