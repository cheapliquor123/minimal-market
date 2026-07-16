import { useCallback } from "react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { useCalendarData } from "./hooks/use-calendar-data"
import { CalendarHeader } from "./components/calendar-header"
import { MonthView } from "./components/month-view"
import { WeekView } from "./components/week-view"
import { DayView } from "./components/day-view"
import { DayDetail } from "./components/day-detail"
import { useUIStore } from "@/stores/ui-store"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import {
  getViewTitle,
  getViewDateRange,
  navigateDate,
} from "./utils"

export function CalendarPage() {
  const viewMode = useUIStore((s) => s.calendarViewMode)
  const currentDate = useUIStore((s) => s.calendarDate)
  const selectedDate = useUIStore((s) => s.calendarSelectedDate)
  const setViewMode = useUIStore((s) => s.setCalendarViewMode)
  const setCurrentDate = useUIStore((s) => s.setCalendarDate)
  const setSelectedDate = useUIStore((s) => s.setCalendarSelectedDate)

  const openTaskCreate = useTaskDialogStore((s) => s.openCreate)

  const { start, end } = getViewDateRange(currentDate, viewMode)
  const { dataByDate, isLoading } = useCalendarData(start, end)

  const handlePrev = useCallback(() => {
    setCurrentDate(navigateDate(currentDate, viewMode, "prev"))
  }, [currentDate, viewMode, setCurrentDate])

  const handleNext = useCallback(() => {
    setCurrentDate(navigateDate(currentDate, viewMode, "next"))
  }, [currentDate, viewMode, setCurrentDate])

  const handleToday = useCallback(() => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }, [setCurrentDate, setSelectedDate])

  function handleAddTask(dateStr: string) {
    openTaskCreate({ dueDate: dateStr })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calendar"
        description="See your tasks at a glance"
      />

      <CalendarHeader
        title={getViewTitle(currentDate, viewMode)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-8 animate-spin rounded-base border-4 border-border border-t-main" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {viewMode === "month" && (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              dataByDate={dataByDate}
              onSelectDate={setSelectedDate}
            />
          )}
          {viewMode === "week" && (
            <WeekView
              currentDate={currentDate}
              selectedDate={selectedDate}
              dataByDate={dataByDate}
              onSelectDate={setSelectedDate}
            />
          )}
          {viewMode === "day" && (
            <DayView
              currentDate={currentDate}
              dataByDate={dataByDate}
            />
          )}

          {selectedDate && viewMode !== "day" && (
            <DayDetail
              date={selectedDate}
              dataByDate={dataByDate}
              onAddTask={handleAddTask}
            />
          )}
        </div>
      )}
    </div>
  )
}
