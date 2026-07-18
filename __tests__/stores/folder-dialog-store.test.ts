import { useFolderDialogStore } from "@/stores/folder-dialog-store"
import { createMockFolder } from "../test-utils"

beforeEach(() => {
  useFolderDialogStore.setState({ isOpen: false, editingFolder: null })
})

describe("folder-dialog-store", () => {
  it("has correct default state", () => {
    const state = useFolderDialogStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.editingFolder).toBeNull()
  })

  describe("openCreate", () => {
    it("opens dialog with no editing folder", () => {
      useFolderDialogStore.getState().openCreate()
      const state = useFolderDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingFolder).toBeNull()
    })
  })

  describe("openEdit", () => {
    it("opens dialog with editing folder", () => {
      const folder = createMockFolder({ id: "f-1", name: "Work" })
      useFolderDialogStore.getState().openEdit(folder)
      const state = useFolderDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingFolder).toEqual(folder)
    })
  })

  describe("close", () => {
    it("resets all state", () => {
      useFolderDialogStore.getState().openEdit(createMockFolder())
      useFolderDialogStore.getState().close()
      const state = useFolderDialogStore.getState()
      expect(state.isOpen).toBe(false)
      expect(state.editingFolder).toBeNull()
    })
  })
})
