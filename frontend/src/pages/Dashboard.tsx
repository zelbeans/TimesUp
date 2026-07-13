import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useMood } from "@/hooks/useMood"
import { useHabits } from "@/hooks/useHabits"
import { useTasks } from "@/hooks/useTasks"
import { getSemesterProgress } from "@/lib/semester"
import { calcStreak, todayIso } from "@/lib/streaks"
import type { HabitType, MoodEntry } from "@/lib/types"

const HABIT_TYPES: HabitType[] = ["gym", "walk", "sleep", "meal"]
const MOOD_SCORES: MoodEntry["score"][] = [1, 2, 3, 4, 5]

export function Dashboard() {
  const mood = useMood()
  const habits = useHabits()
  const tasks = useTasks()

  const today = todayIso()
  const semester = useMemo(() => getSemesterProgress(), [])
  const todaysMood = mood.items.find((entry) => entry.date === today)

  const streaks = useMemo(
    () =>
      HABIT_TYPES.map((type) => ({
        type,
        streak: calcStreak(
          habits.items.filter((h) => h.type === type && h.completed).map((h) => h.date)
        ),
      })),
    [habits.items]
  )

  const openTasks = tasks.items.filter((t) => !t.completed).slice(0, 5)

  function setMoodScore(score: MoodEntry["score"]) {
    if (todaysMood) {
      mood.update(todaysMood.id, { score })
    } else {
      mood.add({ date: today, score })
    }
  }

  return (
    <>
      <section className="-mx-6 -mt-8 flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
        <div>
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Semester Countdown
          </p>
          <p className="mt-4 text-8xl font-semibold text-foreground tabular-nums">
            {semester.daysLeft}
          </p>
          <p className="mt-1 text-lg text-muted-foreground">days left</p>
        </div>
        <div className="w-full max-w-2xl">
          <Progress value={semester.percent} className="h-5" />
          <p className="mt-3 text-sm text-muted-foreground">
            {semester.percent.toFixed(0)}% of the semester complete
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Today's Mood</CardTitle>
            <CardDescription>How's your energy right now?</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            {MOOD_SCORES.map((score) => (
              <Button
                key={score}
                variant={todaysMood?.score === score ? "default" : "outline"}
                size="icon"
                onClick={() => setMoodScore(score)}
              >
                {score}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habit Streaks</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {streaks.map(({ type, streak }) => (
              <div
                key={type}
                className="flex flex-col items-center gap-1 rounded-lg border border-border p-3"
              >
                <span className="text-2xl font-semibold">{streak}</span>
                <span className="text-xs text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Up Next</CardTitle>
            <CardDescription>Your open tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {openTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tasks.isLoading ? "Loading…" : "No open tasks — nice."}
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {openTasks.map((task) => (
                  <li key={task.id} className="text-sm">
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
