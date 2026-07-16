export type HabitType = "binary" | "numerical" | "time"

export interface Habit {
  id: string
  name: string
  type: HabitType
  color: string
  goal: number | null
  createdAt: string
}

export interface CreateHabitInput {
  name: string
  type: HabitType
  color: string
  goal?: number
}

export interface UpdateHabitInput {
  name?: string
  type?: HabitType
  color?: string
  goal?: number | null
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  value: number
}
