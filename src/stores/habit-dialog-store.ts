import { create } from "zustand"
import type { Habit } from "@/features/habits/types"

interface HabitDialogStore {
  isOpen: boolean
  editingHabit: Habit | null

  openCreate: () => void
  openEdit: (habit: Habit) => void
  close: () => void
}

export const useHabitDialogStore = create<HabitDialogStore>((set) => ({
  isOpen: false,
  editingHabit: null,

  openCreate: () => set({ isOpen: true, editingHabit: null }),
  openEdit: (habit) => set({ isOpen: true, editingHabit: habit }),
  close: () => set({ isOpen: false, editingHabit: null }),
}))
