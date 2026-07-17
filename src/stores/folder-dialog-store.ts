import { create } from "zustand"
import type { Folder } from "@/features/notes/types"

interface FolderDialogStore {
  isOpen: boolean
  editingFolder: Folder | null

  openCreate: () => void
  openEdit: (folder: Folder) => void
  close: () => void
}

export const useFolderDialogStore = create<FolderDialogStore>((set) => ({
  isOpen: false,
  editingFolder: null,

  openCreate: () => set({ isOpen: true, editingFolder: null }),
  openEdit: (folder) => set({ isOpen: true, editingFolder: folder }),
  close: () => set({ isOpen: false, editingFolder: null }),
}))
