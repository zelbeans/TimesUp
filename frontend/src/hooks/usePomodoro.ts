import { useEffect, useRef, useState } from "react"
import { useCollection } from "@/hooks/useCollection"
import type { PomodoroSession } from "@/lib/types"

const WORK_MIN = 25
const BREAK_MIN = 5

export type PomodoroMode = "work" | "break"

export function usePomodoro() {
  const sessions = useCollection<PomodoroSession>("timesup:pomodoro")
  const [mode, setMode] = useState<PomodoroMode>("work")
  const [secondsLeft, setSecondsLeft] = useState(WORK_MIN * 60)
  const [isRunning, setIsRunning] = useState(false)
  const startedAtRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1

        if (mode === "work" && startedAtRef.current) {
          sessions.add({
            startedAt: startedAtRef.current,
            durationMin: WORK_MIN,
            completed: true,
          })
        }

        const nextMode = mode === "work" ? "break" : "work"
        startedAtRef.current = null
        setIsRunning(false)
        setMode(nextMode)
        return (nextMode === "work" ? WORK_MIN : BREAK_MIN) * 60
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, mode, sessions])

  function start() {
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString()
    setIsRunning(true)
  }

  function pause() {
    setIsRunning(false)
  }

  function reset() {
    setIsRunning(false)
    startedAtRef.current = null
    setMode("work")
    setSecondsLeft(WORK_MIN * 60)
  }

  return {
    mode,
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    sessions: sessions.items,
    workMin: WORK_MIN,
    breakMin: BREAK_MIN,
  }
}
