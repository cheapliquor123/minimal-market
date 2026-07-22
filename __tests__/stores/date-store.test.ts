import { vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useDateStore, useToday, startTodayRefresh, stopTodayRefresh } from "@/stores/date-store"

function todayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

beforeEach(() => {
  stopTodayRefresh()
  useDateStore.setState({ today: todayString() })
})

describe("date-store", () => {
  it("today is formatted as yyyy-MM-dd", () => {
    const today = useDateStore.getState().today
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("today matches current date", () => {
    expect(useDateStore.getState().today).toBe(todayString())
  })

  it("refresh updates today to current date", () => {
    useDateStore.setState({ today: "2020-01-01" })
    useDateStore.getState().refresh()
    expect(useDateStore.getState().today).toBe(todayString())
  })
})

describe("useToday hook", () => {
  it("returns today string", () => {
    const { result } = renderHook(() => useToday())
    expect(result.current).toBe(todayString())
  })
})

describe("startTodayRefresh / stopTodayRefresh", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    stopTodayRefresh()
  })

  it("starts interval and fires on date change", () => {
    const callback = vi.fn()
    startTodayRefresh(callback)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    vi.setSystemTime(tomorrow)

    vi.advanceTimersByTime(60_000)

    expect(callback).toHaveBeenCalled()
  })

  it("stopTodayRefresh prevents further callbacks", () => {
    const callback = vi.fn()
    startTodayRefresh(callback)
    stopTodayRefresh()

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    vi.setSystemTime(tomorrow)

    vi.advanceTimersByTime(120_000)

    expect(callback).not.toHaveBeenCalled()
  })

  it("does not start a second interval", () => {
    startTodayRefresh()
    startTodayRefresh()
    vi.advanceTimersByTime(120_000)
    stopTodayRefresh()
  })
})
