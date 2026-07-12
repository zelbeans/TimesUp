import { useState, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useTasks } from "@/hooks/useTasks"
import { usePomodoro } from "@/hooks/usePomodoro"

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function Tasks() {
  const tasks = useTasks()
  const pomodoro = usePomodoro()
  const [title, setTitle] = useState("")

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    tasks.add({ title: trimmed, completed: false, createdAt: new Date().toISOString() })
    setTitle("")
  }

  function toggleComplete(id: string, completed: boolean) {
    tasks.update(id, {
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    })
  }

  const openTasks = tasks.items.filter((t) => !t.completed)
  const completedTasks = tasks.items.filter((t) => t.completed)

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Add, complete, and clear your to-dos</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
            />
            <Button type="submit">Add</Button>
          </form>

          <ul className="flex flex-col gap-2">
            {openTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-md border border-border p-2"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => toggleComplete(task.id, checked === true)}
                />
                <span className="flex-1 text-sm">{task.title}</span>
                <Button variant="ghost" size="sm" onClick={() => tasks.remove(task.id)}>
                  Delete
                </Button>
              </li>
            ))}
            {openTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No open tasks.</p>
            )}
          </ul>

          {completedTasks.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
              <ul className="flex flex-col gap-2">
                {completedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 rounded-md border border-border p-2 opacity-60"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => toggleComplete(task.id, checked === true)}
                    />
                    <span className="flex-1 text-sm line-through">{task.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => tasks.remove(task.id)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full lg:w-80">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>{pomodoro.mode === "work" ? "Focus session" : "Break"}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <span className="text-4xl font-semibold tabular-nums">
            {formatTime(pomodoro.secondsLeft)}
          </span>
          <div className="flex gap-2">
            {pomodoro.isRunning ? (
              <Button onClick={pomodoro.pause}>Pause</Button>
            ) : (
              <Button onClick={pomodoro.start}>Start</Button>
            )}
            <Button variant="outline" onClick={pomodoro.reset}>
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {pomodoro.sessions.filter((s) => s.completed).length} focus sessions logged
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
