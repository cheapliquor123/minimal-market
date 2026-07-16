import { create } from "zustand"
import type { TaskFilters } from "@/features/tasks/types"
import type { ViewMode } from "@/features/calendar/utils"

interface UIStore {
  taskFilters: TaskFilters
  setTaskFilters: (filters: TaskFilters) => void

  calendarViewMode: ViewMode
  calendarDate: Date
  calendarSelectedDate: Date | null
  setCalendarViewMode: (mode: ViewMode) => void
  setCalendarDate: (date: Date) => void
  setCalendarSelectedDate: (date: Date | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  taskFilters: { status: "all", priority: "all" },
  setTaskFilters: (filters) => set({ taskFilters: filters }),

  calendarViewMode: "month",
  calendarDate: new Date(),
  calendarSelectedDate: new Date(),
  setCalendarViewMode: (mode) => set({ calendarViewMode: mode }),
  setCalendarDate: (date) => set({ calendarDate: date }),
  setCalendarSelectedDate: (date) => set({ calendarSelectedDate: date }),
}))
