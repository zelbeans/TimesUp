import { useCollection } from "@/hooks/useCollection"
import type { HabitEntry } from "@/lib/types"

export function useHabitEntries() {
  return useCollection<HabitEntry>("/habit-entries")
}
