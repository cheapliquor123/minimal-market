import { calculateStreaks, getTodayLogs } from "@/features/habits/hooks/use-habit-logs"
import type { Habit, HabitLog } from "@/features/habits/types"

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function todayStr(): string {
  return daysAgo(0)
}

describe("calculateStreaks", () => {
  it("returns 0 streak for habits with no logs", () => {
    const habits: Habit[] = [{ id: "h1", name: "Test", type: "binary", color: "#000", goal: null, createdAt: "" }]
    const streaks = calculateStreaks(habits, [])
    expect(streaks["h1"]).toBe(0)
  })

  it("calculates binary habit streak", () => {
    const habits: Habit[] = [{ id: "h1", name: "Meditate", type: "binary", color: "#000", goal: null, createdAt: "" }]
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 1 },
      { id: "l2", habitId: "h1", date: daysAgo(1), value: 1 },
      { id: "l3", habitId: "h1", date: daysAgo(2), value: 1 },
    ]
    const streaks = calculateStreaks(habits, logs)
    expect(streaks["h1"]).toBe(3)
  })

  it("calculates numerical habit streak when goal is met", () => {
    const habits: Habit[] = [{ id: "h1", name: "Pages", type: "numerical", color: "#000", goal: 10, createdAt: "" }]
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 15 },
      { id: "l2", habitId: "h1", date: daysAgo(1), value: 20 },
    ]
    const streaks = calculateStreaks(habits, logs)
    expect(streaks["h1"]).toBe(2)
  })

  it("breaks streak when numerical goal is not met", () => {
    const habits: Habit[] = [{ id: "h1", name: "Pages", type: "numerical", color: "#000", goal: 10, createdAt: "" }]
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 15 },
      { id: "l2", habitId: "h1", date: daysAgo(1), value: 5 },
      { id: "l3", habitId: "h1", date: daysAgo(2), value: 20 },
    ]
    const streaks = calculateStreaks(habits, logs)
    expect(streaks["h1"]).toBe(1)
  })

  it("breaks streak when no log for a day", () => {
    const habits: Habit[] = [{ id: "h1", name: "Meditate", type: "binary", color: "#000", goal: null, createdAt: "" }]
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 1 },
    ]
    const streaks = calculateStreaks(habits, logs)
    expect(streaks["h1"]).toBe(1)
  })

  it("handles time type with goal", () => {
    const habits: Habit[] = [{ id: "h1", name: "Exercise", type: "time", color: "#000", goal: 30, createdAt: "" }]
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 30 },
      { id: "l2", habitId: "h1", date: daysAgo(1), value: 45 },
    ]
    const streaks = calculateStreaks(habits, logs)
    expect(streaks["h1"]).toBe(2)
  })

  it("calculates streaks for multiple habits independently", () => {
    const habits: Habit[] = [
      { id: "h1", name: "Meditate", type: "binary", color: "#000", goal: null, createdAt: "" },
      { id: "h2", name: "Read", type: "binary", color: "#000", goal: null, createdAt: "" },
    ]
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 1 },
      { id: "l2", habitId: "h1", date: daysAgo(1), value: 1 },
    ]
    const streaks = calculateStreaks(habits, logs)
    expect(streaks["h1"]).toBe(2)
    expect(streaks["h2"]).toBe(0)
  })
})

describe("getTodayLogs", () => {
  it("returns empty map when no logs match today", () => {
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: "2020-01-01", value: 1 },
    ]
    const result = getTodayLogs(logs, todayStr())
    expect(result.size).toBe(0)
  })

  it("maps today logs by habitId", () => {
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 1 },
      { id: "l2", habitId: "h2", date: todayStr(), value: 5 },
    ]
    const result = getTodayLogs(logs, todayStr())
    expect(result.size).toBe(2)
    expect(result.get("h1")?.id).toBe("l1")
    expect(result.get("h2")?.id).toBe("l2")
  })

  it("keeps last log when multiple logs for same habit on same day", () => {
    const logs: HabitLog[] = [
      { id: "l1", habitId: "h1", date: todayStr(), value: 1 },
      { id: "l2", habitId: "h1", date: todayStr(), value: 2 },
    ]
    const result = getTodayLogs(logs, todayStr())
    expect(result.size).toBe(1)
    expect(result.get("h1")?.value).toBe(2)
  })

  it("returns empty map for empty logs", () => {
    const result = getTodayLogs([], todayStr())
    expect(result.size).toBe(0)
  })
})
