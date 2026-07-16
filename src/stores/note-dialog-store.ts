import { create } from "zustand"
import type { Note } from "@/features/notes/types"

interface NoteDialogStore {
  isOpen: boolean
  editingNote: Note | null

  openCreate: () => void
  openEdit: (note: Note) => void
  close: () => void
}

export const useNoteDialogStore = create<NoteDialogStore>((set) => ({
  isOpen: false,
  editingNote: null,

  openCreate: () => set({ isOpen: true, editingNote: null }),
  openEdit: (note) => set({ isOpen: true, editingNote: note }),
  close: () => set({ isOpen: false, editingNote: null }),
}))
