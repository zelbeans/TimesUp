export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string | null
}

export interface PomodoroSession {
  id: string
  taskId?: string
  startedAt: string
  durationMin: number
  completed: boolean
}

export type HabitType = "gym" | "walk" | "sleep" | "meal"

export interface HabitEntry {
  id: string
  type: HabitType
  date: string
  completed: boolean
}

export interface MoodEntry {
  id: string
  date: string
  score: 1 | 2 | 3 | 4 | 5
  note?: string
}

export interface SemesterEvent {
  id: string
  title: string
  date: string
  description?: string
}
