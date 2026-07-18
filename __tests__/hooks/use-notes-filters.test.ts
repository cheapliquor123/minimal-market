import { renderHook, act } from "@testing-library/react"
import { useNotesFilters } from "@/features/notes/hooks/use-notes-filters"

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe("useNotesFilters", () => {
  it("initializes with empty search and null color filter", () => {
    const { result } = renderHook(() => useNotesFilters())

    expect(result.current.search).toBe("")
    expect(result.current.colorFilter).toBeNull()
  })

  it("setSearch updates search immediately", () => {
    const { result } = renderHook(() => useNotesFilters())

    act(() => {
      result.current.setSearch("test query")
    })

    expect(result.current.search).toBe("test query")
  })

  it("debouncedSearch updates after delay", () => {
    const { result } = renderHook(() => useNotesFilters())

    act(() => {
      result.current.setSearch("test")
    })

    expect(result.current.debouncedSearch).toBe("")

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.debouncedSearch).toBe("test")
  })

  it("debouncedSearch does not update before delay", () => {
    const { result } = renderHook(() => useNotesFilters())

    act(() => {
      result.current.setSearch("test")
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current.debouncedSearch).toBe("")
  })

  it("setColorFilter updates color filter", () => {
    const { result } = renderHook(() => useNotesFilters())

    act(() => {
      result.current.setColorFilter("#ff0000")
    })

    expect(result.current.colorFilter).toBe("#ff0000")
  })

  it("setColorFilter to null clears filter", () => {
    const { result } = renderHook(() => useNotesFilters())

    act(() => {
      result.current.setColorFilter("#ff0000")
    })
    act(() => {
      result.current.setColorFilter(null)
    })

    expect(result.current.colorFilter).toBeNull()
  })
})
