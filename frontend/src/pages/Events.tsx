import { useState, type FormEvent } from "react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEvents } from "@/hooks/useEvents"

export function Events() {
  const events = useEvents()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    events.add({ title: title.trim(), date })
    setTitle("")
    setDate("")
  }

  const sorted = [...events.items].sort((a, b) => a.date.localeCompare(b.date))

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

          <ul className="flex flex-col gap-2">
            {sorted.map((event) => (
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
            {sorted.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No events yet — add something to look forward to.
              </p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
