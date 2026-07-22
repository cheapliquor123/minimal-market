import { vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/shared/hooks/use-debounce"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300))
    expect(result.current).toBe("hello")
  })

  it("does not update value before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 300 } },
    )

    rerender({ value: "second", delay: 300 })
    expect(result.current).toBe("first")

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe("first")
  })

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 300 } },
    )

    rerender({ value: "second", delay: 300 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe("second")
  })

  it("resets timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } },
    )

    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: "b", delay: 300 })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: "c", delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe("c")
  })

  it("handles numeric values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } },
    )

    rerender({ value: 42 })
    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe(42)
  })
})
