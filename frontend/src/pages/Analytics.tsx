import { useMemo } from "react"
import { format, parseISO, subDays } from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMood } from "@/hooks/useMood"
import { useTasks } from "@/hooks/useTasks"
import { usePomodoro } from "@/hooks/usePomodoro"

const DAYS_WINDOW = 14

const tooltipContentStyle = {
  backgroundColor: "var(--popover)",
  borderColor: "var(--border)",
  borderRadius: 8,
  fontSize: 12,
}
const tooltipLabelStyle = { color: "var(--foreground)" }
const axisTick = { fontSize: 12, fill: "var(--muted-foreground)" }

function lastNDays(n: number) {
  return Array.from({ length: n }, (_, i) => format(subDays(new Date(), n - 1 - i), "yyyy-MM-dd"))
}

export function Analytics() {
  const mood = useMood()
  const tasks = useTasks()
  const pomodoro = usePomodoro()

  const days = useMemo(() => lastNDays(DAYS_WINDOW), [])

  const moodData = useMemo(() => {
    const byDate = new Map(mood.items.map((m) => [m.date, m.score]))
    return days.map((date) => ({
      date: format(parseISO(date), "MMM d"),
      score: byDate.get(date) ?? null,
    }))
  }, [mood.items, days])

  const taskData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const task of tasks.items) {
      if (!task.completed || !task.completedAt) continue
      const date = format(parseISO(task.completedAt), "yyyy-MM-dd")
      counts.set(date, (counts.get(date) ?? 0) + 1)
    }
    return days.map((date) => ({
      date: format(parseISO(date), "MMM d"),
      completed: counts.get(date) ?? 0,
    }))
  }, [tasks.items, days])

  const pomodoroData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const session of pomodoro.sessions) {
      if (!session.completed) continue
      const date = format(parseISO(session.startedAt), "yyyy-MM-dd")
      counts.set(date, (counts.get(date) ?? 0) + 1)
    }
    return days.map((date) => ({
      date: format(parseISO(date), "MMM d"),
      sessions: counts.get(date) ?? 0,
    }))
  }, [pomodoro.sessions, days])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mood Trend</CardTitle>
          <CardDescription>Last {DAYS_WINDOW} days</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={axisTick} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis domain={[1, 5]} tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--chart-1)" }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Completed</CardTitle>
          <CardDescription>Per day, last {DAYS_WINDOW} days</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={axisTick} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Bar dataKey="completed" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus Sessions</CardTitle>
          <CardDescription>Pomodoro sessions per day</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pomodoroData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={axisTick} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} />
              <Bar dataKey="sessions" fill="var(--chart-5)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Productivity Forecast</CardTitle>
          <CardDescription>Coming in Phase 4</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Once the FastAPI backend is live, this card will show a Scikit-learn model's
            prediction of your energy and productivity based on mood, habits, and focus session
            history.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
