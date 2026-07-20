import { differenceInCalendarDays, parseISO } from "date-fns"

// Placeholder until the backend exposes a real semester/term record.
export const SEMESTER_START = "2026-05-01"
export const SEMESTER_END = "2026-08-15"

export function getSemesterProgress() {
  const start = parseISO(SEMESTER_START)
  const end = parseISO(SEMESTER_END)
  const now = new Date()

  const totalDays = differenceInCalendarDays(end, start)
  const elapsedDays = differenceInCalendarDays(now, start)
  const daysLeft = Math.max(differenceInCalendarDays(end, now), 0)
  const percent = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)

  return { daysLeft, percent }
}
