import { useMemo, useState, type FormEvent } from "react"
import { isAxiosError } from "axios"
import { format, parseISO } from "date-fns"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useEvents } from "@/hooks/useEvents"
import { api } from "@/lib/api"

export function Events() {
  const events = useEvents()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    events.add({ title: title.trim(), date })
    setTitle("")
    setDate("")
  }

  async function handleSync() {
    setIsSyncing(true)
    setSyncError(null)
    setSyncMessage(null)
    try {
      const res = await api.post<{ imported: number; updated: number }>(
        "/events/sync-google-calendar"
      )
      await events.refetch()
      setSyncMessage(`Imported ${res.data.imported}, updated ${res.data.updated}.`)
    } catch (err) {
      const detail =
        isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : "Sync failed — is the backend running?"
      setSyncError(detail)
    } finally {
      setIsSyncing(false)
    }
  }

  const sorted = [...events.items].sort((a, b) => a.date.localeCompare(b.date))
  const eventDates = useMemo(() => sorted.map((event) => parseISO(event.date)), [sorted])

  const selectedIso = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null
  const visible = selectedIso ? sorted.filter((event) => event.date === selectedIso) : sorted

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Things to look forward to</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="flex-1"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="sm:w-44"
            />
            <Button type="submit">Add</Button>
          </form>

          <div className="flex flex-col gap-1 border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="self-start"
            >
              {isSyncing ? "Syncing…" : "Sync from Google Calendar"}
            </Button>
            {syncMessage && <p className="text-xs text-muted-foreground">{syncMessage}</p>}
            {syncError && <p className="text-xs text-destructive">{syncError}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="w-fit">
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasEvent: eventDates }}
              modifiersClassNames={{
                hasEvent:
                  "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "EEEE, MMM d") : "All events"}</CardTitle>
            {selectedDate && (
              <CardAction>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>
                  Show all
                </Button>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {visible.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(event.date), "EEEE, MMM d yyyy")}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => events.remove(event.id)}>
                    Remove
                  </Button>
                </li>
              ))}
              {visible.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {events.isLoading
                    ? "Loading…"
                    : selectedIso
                      ? "No events on this day."
                      : "No events yet — add something to look forward to."}
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
