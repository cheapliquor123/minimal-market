import { renderHook, act } from "@testing-library/react"
import { useEntityFormSubmit } from "@/shared/hooks/use-entity-form-submit"

function createMockMutation() {
  return {
    mutate: jest.fn(),
    isPending: false,
  }
}

describe("useEntityFormSubmit", () => {
  describe("create mode (editing is null)", () => {
    it("calls create.mutate with input", () => {
      const create = createMockMutation()
      const update = createMockMutation()
      const onSuccess = jest.fn()

      const { result } = renderHook(() =>
        useEntityFormSubmit({
          editing: null,
          create,
          update,
          onSuccess,
        }),
      )

      act(() => {
        result.current.handleSubmit({ title: "New item" })
      })

      expect(create.mutate).toHaveBeenCalledWith(
        { title: "New item" },
        { onSuccess },
      )
      expect(update.mutate).not.toHaveBeenCalled()
    })
  })

  describe("edit mode (editing has id)", () => {
    it("calls update.mutate with id and input", () => {
      const create = createMockMutation()
      const update = createMockMutation()
      const onSuccess = jest.fn()

      const { result } = renderHook(() =>
        useEntityFormSubmit({
          editing: { id: "item-1" },
          create,
          update,
          onSuccess,
        }),
      )

      act(() => {
        result.current.handleSubmit({ title: "Updated" })
      })

      expect(update.mutate).toHaveBeenCalledWith(
        { id: "item-1", input: { title: "Updated" } },
        { onSuccess },
      )
      expect(create.mutate).not.toHaveBeenCalled()
    })
  })

  describe("isPending", () => {
    it("returns false when neither mutation is pending", () => {
      const create = createMockMutation()
      const update = createMockMutation()

      const { result } = renderHook(() =>
        useEntityFormSubmit({
          editing: null,
          create,
          update,
          onSuccess: jest.fn(),
        }),
      )

      expect(result.current.isPending).toBe(false)
    })

    it("returns true when create is pending", () => {
      const create = { mutate: jest.fn(), isPending: true }
      const update = createMockMutation()

      const { result } = renderHook(() =>
        useEntityFormSubmit({
          editing: null,
          create,
          update,
          onSuccess: jest.fn(),
        }),
      )

      expect(result.current.isPending).toBe(true)
    })

    it("returns true when update is pending", () => {
      const create = createMockMutation()
      const update = { mutate: jest.fn(), isPending: true }

      const { result } = renderHook(() =>
        useEntityFormSubmit({
          editing: { id: "item-1" },
          create,
          update,
          onSuccess: jest.fn(),
        }),
      )

      expect(result.current.isPending).toBe(true)
    })
  })
})
