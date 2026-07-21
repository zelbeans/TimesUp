import { useCollection } from "@/hooks/useCollection"
import type { Habit } from "@/lib/types"

export function useHabits() {
  return useCollection<Habit>("/habits")
}
