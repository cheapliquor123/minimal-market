import { useTaskDialogStore } from "@/stores/task-dialog-store"
import { createMockTask } from "../test-utils"

beforeEach(() => {
  useTaskDialogStore.setState({
    isOpen: false,
    editingTask: null,
    defaultDueDate: null,
  })
})

describe("task-dialog-store", () => {
  it("has correct default state", () => {
    const state = useTaskDialogStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.editingTask).toBeNull()
    expect(state.defaultDueDate).toBeNull()
  })

  describe("openCreate", () => {
    it("opens dialog with no editing task", () => {
      useTaskDialogStore.getState().openCreate()
      const state = useTaskDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingTask).toBeNull()
      expect(state.defaultDueDate).toBeNull()
    })

    it("sets defaultDueDate when provided", () => {
      useTaskDialogStore.getState().openCreate({ dueDate: "2025-06-15" })
      expect(useTaskDialogStore.getState().defaultDueDate).toBe("2025-06-15")
    })
  })

  describe("openEdit", () => {
    it("opens dialog with editing task", () => {
      const task = createMockTask({ id: "edit-1", title: "Edit me" })
      useTaskDialogStore.getState().openEdit(task)
      const state = useTaskDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingTask).toEqual(task)
      expect(state.defaultDueDate).toBeNull()
    })
  })

  describe("close", () => {
    it("resets all state", () => {
      const task = createMockTask()
      useTaskDialogStore.getState().openEdit(task)
      useTaskDialogStore.getState().openCreate({ dueDate: "2025-01-01" })
      useTaskDialogStore.getState().close()
      const state = useTaskDialogStore.getState()
      expect(state.isOpen).toBe(false)
      expect(state.editingTask).toBeNull()
      expect(state.defaultDueDate).toBeNull()
    })
  })
})
