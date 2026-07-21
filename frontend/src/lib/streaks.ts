import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from "date-fns"

export function todayIso() {
  return format(new Date(), "yyyy-MM-dd")
}

export function calcWeeklyCount(dates: string[]): number {
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 })
  const end = endOfWeek(now, { weekStartsOn: 1 })

  return dates.filter((date) => isWithinInterval(parseISO(date), { start, end })).length
}
