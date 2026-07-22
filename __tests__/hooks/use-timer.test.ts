import { vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTimer } from "@/features/habits/hooks/use-timer"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("useTimer", () => {
  const goalMinutes = 1
  const goalSeconds = 60

  it("initializes with correct default state", () => {
    const { result } = renderHook(() =>
      useTimer({ goalMinutes, onLog: vi.fn() }),
    )

    expect(result.current.running).toBe(false)
    expect(result.current.remaining).toBe(goalSeconds)
    expect(result.current.goalSeconds).toBe(goalSeconds)
    expect(result.current.progress).toBe(0)
  })

  describe("start", () => {
    it("sets running to true and resets remaining", () => {
      const { result } = renderHook(() =>
        useTimer({ goalMinutes, onLog: vi.fn() }),
      )

      act(() => {
        result.current.start()
      })

      expect(result.current.running).toBe(true)
      expect(result.current.remaining).toBe(goalSeconds)
    })

    it("counts down each second", () => {
      const { result } = renderHook(() =>
        useTimer({ goalMinutes, onLog: vi.fn() }),
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(result.current.remaining).toBe(goalSeconds - 3)
      expect(result.current.running).toBe(true)
    })

    it("calculates progress correctly", () => {
      const { result } = renderHook(() =>
        useTimer({ goalMinutes: 1, onLog: vi.fn() }),
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(result.current.progress).toBeCloseTo(50, 0)
    })
  })

  describe("auto-completion", () => {
    it("calls onLog with goalMinutes when timer reaches zero", () => {
      const onLog = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ goalMinutes: 1, onLog }),
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(60_000)
      })

      expect(onLog).toHaveBeenCalledWith(1)
      expect(result.current.running).toBe(false)
      expect(result.current.remaining).toBe(goalSeconds)
    })
  })

  describe("stop", () => {
    it("stop(true) logs full goal minutes", () => {
      const onLog = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ goalMinutes: 5, onLog }),
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(10_000)
      })

      act(() => {
        result.current.stop(true)
      })

      expect(onLog).toHaveBeenCalledWith(5)
      expect(result.current.running).toBe(false)
      expect(result.current.remaining).toBe(300)
    })

    it("stop(false) logs partial minutes", () => {
      const onLog = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ goalMinutes: 10, onLog }),
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(120_000)
      })

      act(() => {
        result.current.stop(false)
      })

      expect(onLog).toHaveBeenCalledWith(2)
      expect(result.current.running).toBe(false)
    })

    it("stop(false) logs at least 1 minute", () => {
      const onLog = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ goalMinutes: 10, onLog }),
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      act(() => {
        result.current.stop(false)
      })

      expect(onLog).toHaveBeenCalledWith(1)
    })
  })

  describe("cleanup", () => {
    it("clears interval on unmount", () => {
      const onLog = vi.fn()
      const { result, unmount } = renderHook(() =>
        useTimer({ goalMinutes: 1, onLog }),
      )

      act(() => {
        result.current.start()
      })

      unmount()

      act(() => {
        vi.advanceTimersByTime(60_000)
      })

      expect(onLog).not.toHaveBeenCalled()
    })
  })
})
