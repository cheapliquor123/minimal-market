import { renderHook, act } from "@testing-library/react"
import { useDeleteConfirmation } from "@/shared/hooks/use-delete-confirmation"

describe("useDeleteConfirmation", () => {
  it("initializes with no delete id and closed state", () => {
    const { result } = renderHook(() => useDeleteConfirmation())
    expect(result.current.deleteId).toBeNull()
    expect(result.current.isOpen).toBe(false)
  })

  it("confirm sets deleteId and opens dialog", () => {
    const { result } = renderHook(() => useDeleteConfirmation())

    act(() => {
      result.current.confirm("item-123")
    })

    expect(result.current.deleteId).toBe("item-123")
    expect(result.current.isOpen).toBe(true)
  })

  it("cancel clears deleteId and closes dialog", () => {
    const { result } = renderHook(() => useDeleteConfirmation())

    act(() => {
      result.current.confirm("item-123")
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.cancel()
    })

    expect(result.current.deleteId).toBeNull()
    expect(result.current.isOpen).toBe(false)
  })

  it("confirm overwrites previous deleteId", () => {
    const { result } = renderHook(() => useDeleteConfirmation())

    act(() => {
      result.current.confirm("first")
    })
    act(() => {
      result.current.confirm("second")
    })

    expect(result.current.deleteId).toBe("second")
    expect(result.current.isOpen).toBe(true)
  })
})
