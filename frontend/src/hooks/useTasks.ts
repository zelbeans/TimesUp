import { useCollection } from "@/hooks/useCollection"
import type { Task } from "@/lib/types"

export function useTasks() {
  return useCollection<Task>("/tasks")
}
