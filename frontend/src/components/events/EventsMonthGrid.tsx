import { useMemo, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SemesterEvent } from "@/lib/types"

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MAX_VISIBLE_PER_DAY = 3

export function EventsMonthGrid({ events }: { events: SemesterEvent[] }) {
  const [month, setMonth] = useState(() => new Date())

  const eventsByDate = useMemo(() => {
    const map = new Map<string, SemesterEvent[]>()
    for (const event of events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    return map
  }, [events])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    return eachDayOfInterval({ start, end })
  }, [month])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{format(month, "MMMM yyyy")}</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-lg border-t border-l border-border">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-r border-b border-border p-2 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd")
          const dayEvents = eventsByDate.get(iso) ?? []
          const inMonth = isSameMonth(day, month)

          return (
            <div
              key={iso}
              className={cn(
                "flex min-h-24 flex-col gap-1 border-r border-b border-border p-1.5",
                !inMonth && "bg-muted/30"
              )}
            >
              <span
                className={cn(
                  "self-end text-xs",
                  inMonth ? "text-foreground" : "text-muted-foreground",
                  isToday(day) &&
                    "flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, MAX_VISIBLE_PER_DAY).map((event) => (
                  <span
                    key={event.id}
                    title={event.title}
                    className="truncate rounded bg-muted px-1 py-0.5 text-[11px] text-foreground"
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > MAX_VISIBLE_PER_DAY && (
                  <span className="text-[11px] text-muted-foreground">
                    +{dayEvents.length - MAX_VISIBLE_PER_DAY} more
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
