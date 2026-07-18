import { useNoteDialogStore } from "@/stores/note-dialog-store"
import { createMockNote } from "../test-utils"

beforeEach(() => {
  useNoteDialogStore.setState({
    isOpen: false,
    editingNote: null,
    currentFolderId: null,
  })
})

describe("note-dialog-store", () => {
  it("has correct default state", () => {
    const state = useNoteDialogStore.getState()
    expect(state.isOpen).toBe(false)
    expect(state.editingNote).toBeNull()
    expect(state.currentFolderId).toBeNull()
  })

  describe("openCreate", () => {
    it("opens dialog with no editing note", () => {
      useNoteDialogStore.getState().openCreate()
      const state = useNoteDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingNote).toBeNull()
    })
  })

  describe("openEdit", () => {
    it("opens dialog with editing note", () => {
      const note = createMockNote({ id: "n-1", title: "My Note" })
      useNoteDialogStore.getState().openEdit(note)
      const state = useNoteDialogStore.getState()
      expect(state.isOpen).toBe(true)
      expect(state.editingNote).toEqual(note)
    })
  })

  describe("setCurrentFolder", () => {
    it("sets folder id", () => {
      useNoteDialogStore.getState().setCurrentFolder("folder-1")
      expect(useNoteDialogStore.getState().currentFolderId).toBe("folder-1")
    })

    it("sets folder id to null", () => {
      useNoteDialogStore.getState().setCurrentFolder("folder-1")
      useNoteDialogStore.getState().setCurrentFolder(null)
      expect(useNoteDialogStore.getState().currentFolderId).toBeNull()
    })
  })

  describe("close", () => {
    it("resets dialog state but keeps currentFolderId", () => {
      const note = createMockNote()
      useNoteDialogStore.getState().setCurrentFolder("folder-1")
      useNoteDialogStore.getState().openEdit(note)
      useNoteDialogStore.getState().close()
      const state = useNoteDialogStore.getState()
      expect(state.isOpen).toBe(false)
      expect(state.editingNote).toBeNull()
      expect(state.currentFolderId).toBe("folder-1")
    })
  })
})
