import { useUIStore } from "@/stores/ui-store"

beforeEach(() => {
  useUIStore.setState({
    taskFilters: { status: "all", priority: "all" },
    calendarViewMode: "month",
    calendarDate: new Date(2025, 5, 15),
    calendarSelectedDate: new Date(2025, 5, 15),
  })
})

describe("ui-store", () => {
  describe("taskFilters", () => {
    it("has correct default state", () => {
      const state = useUIStore.getState()
      expect(state.taskFilters).toEqual({ status: "all", priority: "all" })
    })

    it("setTaskFilters updates filters", () => {
      useUIStore.getState().setTaskFilters({ status: "active", priority: "high" })
      expect(useUIStore.getState().taskFilters).toEqual({
        status: "active",
        priority: "high",
      })
    })

    it("setTaskFilters with search", () => {
      useUIStore.getState().setTaskFilters({ search: "test" })
      expect(useUIStore.getState().taskFilters.search).toBe("test")
    })
  })

  describe("calendar state", () => {
    it("has correct default view mode", () => {
      expect(useUIStore.getState().calendarViewMode).toBe("month")
    })

    it("setCalendarViewMode updates mode", () => {
      useUIStore.getState().setCalendarViewMode("week")
      expect(useUIStore.getState().calendarViewMode).toBe("week")
    })

    it("setCalendarDate updates date", () => {
      const newDate = new Date(2025, 0, 1)
      useUIStore.getState().setCalendarDate(newDate)
      expect(useUIStore.getState().calendarDate).toBe(newDate)
    })

    it("setCalendarSelectedDate updates selected date", () => {
      const newDate = new Date(2025, 11, 25)
      useUIStore.getState().setCalendarSelectedDate(newDate)
      expect(useUIStore.getState().calendarSelectedDate).toBe(newDate)
    })

    it("setCalendarSelectedDate with null", () => {
      useUIStore.getState().setCalendarSelectedDate(null)
      expect(useUIStore.getState().calendarSelectedDate).toBeNull()
    })
  })
})
