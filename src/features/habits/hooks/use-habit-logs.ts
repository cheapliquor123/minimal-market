import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { habitLogsApi } from "../api/habit-logs"
import type { Habit, HabitLog } from "../types"

const QUERY_KEY = ["habit-logs"]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function useHabitLogs(habitId?: string) {
  return useQuery({
    queryKey: habitId ? [...QUERY_KEY, habitId] : QUERY_KEY,
    queryFn: () => habitLogsApi.list(habitId),
  })
}

export function useHabitLogsForDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, startDate, endDate],
    queryFn: () => habitLogsApi.list(undefined, startDate, endDate),
  })
}

export function useLogHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: { habitId: string; date: string; value: number }) =>
      habitLogsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteLog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => habitLogsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

function calculateStreak(logs: HabitLog[], habitId: string, type: Habit["type"], goal: number | null): number {
  const logMap = new Map<string, number>()
  for (const log of logs) {
    if (log.habitId === habitId) {
      const existing = logMap.get(log.date) ?? 0
      logMap.set(log.date, Math.max(existing, log.value))
    }
  }

  let streak = 0

  for (let i = 0; i < 365; i++) {
    const dateStr = daysAgo(i)
    const value = logMap.get(dateStr)

    let completed = false
    if (type === "binary") {
      completed = value !== undefined
    } else if (type === "numerical" || type === "time") {
      completed = value !== undefined && goal !== null && value >= goal
    }

    if (completed) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function calculateStreaks(habits: Habit[], logs: HabitLog[]): Record<string, number> {
  const streaks: Record<string, number> = {}
  for (const habit of habits) {
    streaks[habit.id] = calculateStreak(logs, habit.id, habit.type, habit.goal)
  }
  return streaks
}

export function getTodayLogs(logs: HabitLog[], today: string): Map<string, HabitLog> {
  const todayLogMap = new Map<string, HabitLog>()
  for (const log of logs) {
    if (log.date === today) {
      todayLogMap.set(log.habitId, log)
    }
  }
  return todayLogMap
}
