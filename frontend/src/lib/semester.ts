import { differenceInCalendarDays, parseISO } from "date-fns"

// Default end date until the user sets their own via the dashboard.
export const SEMESTER_START = "2026-05-01"
export const DEFAULT_SEMESTER_END = "2026-08-15"

export function getSemesterProgress(endDateIso: string) {
  const start = parseISO(SEMESTER_START)
  const end = parseISO(endDateIso)
  const now = new Date()

  const totalDays = differenceInCalendarDays(end, start)
  const elapsedDays = differenceInCalendarDays(now, start)
  const daysLeft = Math.max(differenceInCalendarDays(end, now), 0)
  const percent = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)

  return { daysLeft, percent }
}
