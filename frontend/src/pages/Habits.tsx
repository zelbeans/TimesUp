import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Minus, Pencil, Plus, Trash2 } from "lucide-react"
import { useHabits } from "@/hooks/useHabits"
import { useHabitEntries } from "@/hooks/useHabitEntries"
import { calcWeeklyCount, todayIso } from "@/lib/streaks"
import type { Habit } from "@/lib/types"

export function Habits() {
  const habits = useHabits()
  const entries = useHabitEntries()
  const today = todayIso()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [draftName, setDraftName] = useState("")
  const [draftTarget, setDraftTarget] = useState(7)

  function openAdd() {
    setEditingHabit(null)
    setDraftName("")
    setDraftTarget(7)
    setIsDialogOpen(true)
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit)
    setDraftName(habit.name)
    setDraftTarget(habit.weeklyTarget)
    setIsDialogOpen(true)
  }

  function saveHabit() {
    const name = draftName.trim()
    if (!name) return
    if (editingHabit) {
      habits.update(editingHabit.id, { name, weeklyTarget: draftTarget })
    } else {
      habits.add({ name, weeklyTarget: draftTarget })
    }
    setIsDialogOpen(false)
  }

  function incrementToday(habitId: string) {
    entries.add({ habitId, date: today, completed: true })
  }

  function decrementToday(habitId: string) {
    const todayEntries = entries.items.filter(
      (e) => e.habitId === habitId && e.date === today && e.completed
    )
    const last = todayEntries[todayEntries.length - 1]
    if (last) {
      entries.remove(last.id)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Habits</CardTitle>
          <CardDescription>Log what you got done today</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button variant="outline" size="sm" onClick={openAdd} className="self-start">
            Add habit
          </Button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {habits.items.map((habit) => {
              const todayCount = entries.items.filter(
                (e) => e.habitId === habit.id && e.date === today && e.completed
              ).length
              const weekCount = calcWeeklyCount(
                entries.items
                  .filter((e) => e.habitId === habit.id && e.completed)
                  .map((e) => e.date)
              )

              return (
                <div
                  key={habit.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{habit.name}</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(habit)}
                        aria-label={`Edit ${habit.name}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => habits.remove(habit.id)}
                        aria-label={`Delete ${habit.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <Progress
                      value={Math.min(100, (weekCount / habit.weeklyTarget) * 100)}
                      className="h-2"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {weekCount}/{habit.weeklyTarget} this week
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => decrementToday(habit.id)}
                      disabled={todayCount === 0}
                      aria-label={`Remove one ${habit.name} completion today`}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="text-sm tabular-nums">{todayCount} today</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => incrementToday(habit.id)}
                      aria-label={`Add one ${habit.name} completion today`}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {habits.items.length === 0 && !habits.isLoading && (
              <p className="text-sm text-muted-foreground">
                No habits yet — add one to start tracking.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Edit habit" : "Add habit"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="e.g. Gym"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="habit-target">Times per week</Label>
              <Input
                id="habit-target"
                type="number"
                min={1}
                max={7}
                value={draftTarget}
                onChange={(e) => setDraftTarget(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveHabit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
