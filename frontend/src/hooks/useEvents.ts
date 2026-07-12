import { useCollection } from "@/hooks/useCollection"
import type { SemesterEvent } from "@/lib/types"

export function useEvents() {
  return useCollection<SemesterEvent>("timesup:events")
}
