import { useHabitDialogStore } from "@/stores/habit-dialog-store"
import { createMockHabit } from "../test-utils"

beforeEach(() => {
  useHabitDialogStore.setState({ isOpen: false, editingHabit: null })
})

describe("habit-dialog-store", () => {
  it("has correct default state", () => {
    const state = useHabitDialogStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.editingHabit).toBeNull()
  })

  describe("openCreate", () => {
    it("opens dialog with no editing habit", () => {
      useHabitDialogStore.getState().openCreate()
      const state = useHabitDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingHabit).toBeNull()
    })
  })

  describe("openEdit", () => {
    it("opens dialog with editing habit", () => {
      const habit = createMockHabit({ id: "h-1", name: "Meditate" })
      useHabitDialogStore.getState().openEdit(habit)
      const state = useHabitDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingHabit).toEqual(habit)
    })
  })

  describe("close", () => {
    it("resets all state", () => {
      useHabitDialogStore.getState().openEdit(createMockHabit())
      useHabitDialogStore.getState().close()
      const state = useHabitDialogStore.getState()
      expect(state.isOpen).toBe(false)
      expect(state.editingHabit).toBeNull()
    })
  })
})
