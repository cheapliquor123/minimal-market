import { create } from "zustand"
import type { Task } from "@/features/tasks/types"

interface TaskDialogStore {
  isOpen: boolean
  editingTask: Task | null
  defaultDueDate: string | null
  openCreate: (defaults?: { dueDate?: string }) => void
  openEdit: (task: Task) => void
  close: () => void
}

export const useTaskDialogStore = create<TaskDialogStore>((set) => ({
  isOpen: false,
  editingTask: null,
  defaultDueDate: null,
  openCreate: (defaults) =>
    set({ isOpen: true, editingTask: null, defaultDueDate: defaults?.dueDate ?? null }),
  openEdit: (task) =>
    set({ isOpen: true, editingTask: task, defaultDueDate: null }),
  close: () =>
    set({ isOpen: false, editingTask: null, defaultDueDate: null }),
}))
