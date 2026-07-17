import { create } from "zustand"
import type { Note } from "@/features/notes/types"

interface NoteDialogStore {
  isOpen: boolean
  editingNote: Note | null
  currentFolderId: string | null

  openCreate: () => void
  openEdit: (note: Note) => void
  setCurrentFolder: (id: string | null) => void
  close: () => void
}

export const useNoteDialogStore = create<NoteDialogStore>((set) => ({
  isOpen: false,
  editingNote: null,
  currentFolderId: null,

  openCreate: () => set({ isOpen: true, editingNote: null }),
  openEdit: (note) => set({ isOpen: true, editingNote: note }),
  setCurrentFolder: (id) => set({ currentFolderId: id }),
  close: () => set({ isOpen: false, editingNote: null }),
}))
