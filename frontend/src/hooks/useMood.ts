import { useCollection } from "@/hooks/useCollection"
import type { MoodEntry } from "@/lib/types"

export function useMood() {
  return useCollection<MoodEntry>("timesup:mood")
}
