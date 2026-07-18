import { toStartOfDay, formatDueDate, hasActiveFilters } from "@/features/tasks/utils"

describe("toStartOfDay", () => {
  it("sets hours, minutes, seconds, ms to zero", () => {
    const date = new Date(2025, 5, 15, 14, 30, 45, 999)
    const result = toStartOfDay(date)
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })

  it("does not mutate the original date", () => {
    const date = new Date(2025, 5, 15, 14, 30, 45)
    const original = date.getTime()
    toStartOfDay(date)
    expect(date.getTime()).toBe(original)
  })
})

describe("formatDueDate", () => {
  function todayStr(): string {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  function daysFromNow(n: number): string {
    const d = new Date()
    d.setDate(d.getDate() + n)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  it("returns 'Today' for today's date", () => {
    const result = formatDueDate(todayStr())
    expect(result.label).toBe("Today")
    expect(result.isToday).toBe(true)
    expect(result.isOverdue).toBe(false)
  })

  it("returns 'Tomorrow' for tomorrow's date", () => {
    const result = formatDueDate(daysFromNow(1))
    expect(result.label).toBe("Tomorrow")
    expect(result.isToday).toBe(false)
    expect(result.isOverdue).toBe(false)
  })

  it("returns 'In Xd' for future dates", () => {
    const result = formatDueDate(daysFromNow(5))
    expect(result.label).toBe("In 5d")
    expect(result.isToday).toBe(false)
    expect(result.isOverdue).toBe(false)
  })

  it("returns overdue label for past dates", () => {
    const result = formatDueDate(daysFromNow(-3))
    expect(result.label).toBe("3d overdue")
    expect(result.isOverdue).toBe(true)
    expect(result.isToday).toBe(false)
  })
})

describe("hasActiveFilters", () => {
  it("returns false for undefined", () => {
    expect(hasActiveFilters(undefined)).toBe(false)
  })

  it("returns false for empty filters", () => {
    expect(hasActiveFilters({})).toBe(false)
  })

  it("returns false when priority is 'all'", () => {
    expect(hasActiveFilters({ priority: "all" })).toBe(false)
  })

  it("returns true when search is present", () => {
    expect(hasActiveFilters({ search: "hello" })).toBe(true)
  })

  it("returns true when priority is not 'all'", () => {
    expect(hasActiveFilters({ priority: "high" })).toBe(true)
  })

  it("returns true when both search and priority are active", () => {
    expect(hasActiveFilters({ search: "test", priority: "low" })).toBe(true)
  })
})
