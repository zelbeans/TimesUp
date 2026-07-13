import { useCollection } from "@/hooks/useCollection"
import type { HabitEntry } from "@/lib/types"

export function useHabits() {
  return useCollection<HabitEntry>("/habits")
}
