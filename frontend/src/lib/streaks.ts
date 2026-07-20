import { format, subDays } from "date-fns"

export function todayIso() {
  return format(new Date(), "yyyy-MM-dd")
}

export function calcStreak(dates: string[]): number {
  const set = new Set(dates)
  let cursor = new Date()
  if (!set.has(format(cursor, "yyyy-MM-dd"))) {
    cursor = subDays(cursor, 1)
  }

  let streak = 0
  while (set.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1
    cursor = subDays(cursor, 1)
  }
  return streak
}
