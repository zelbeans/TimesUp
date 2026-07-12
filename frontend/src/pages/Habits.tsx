import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/useHabits"
import { calcStreak, todayIso } from "@/lib/streaks"
import type { HabitType } from "@/lib/types"

const HABIT_TYPES: HabitType[] = ["gym", "walk", "sleep", "meal"]
const HABIT_LABELS: Record<HabitType, string> = {
  gym: "Gym",
  walk: "Walk",
  sleep: "Sleep",
  meal: "Meals",
}

export function Habits() {
  const habits = useHabits()
  const today = todayIso()

  function toggleToday(type: HabitType) {
    const existing = habits.items.find((h) => h.type === type && h.date === today)
    if (existing) {
      habits.update(existing.id, { completed: !existing.completed })
    } else {
      habits.add({ type, date: today, completed: true })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
          <CardDescription>Log what you got done today</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {HABIT_TYPES.map((type) => {
            const entry = habits.items.find((h) => h.type === type && h.date === today)
            const done = entry?.completed ?? false
            const streak = calcStreak(
              habits.items.filter((h) => h.type === type && h.completed).map((h) => h.date)
            )
            return (
              <div
                key={type}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4"
              >
                <span className="text-sm font-medium">{HABIT_LABELS[type]}</span>
                <span className="text-xs text-muted-foreground">{streak} day streak</span>
                <Button
                  variant={done ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleToday(type)}
                >
                  {done ? "Done today" : "Mark done"}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
