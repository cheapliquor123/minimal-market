import { PageHeader } from "@/shared/components/layout/page-header"
import { ErrorState } from "@/shared/components/error-state"
import { useCalendarData } from "./hooks/use-calendar-data"
import { useCalendarActions } from "./hooks/use-calendar-actions"
import { CalendarHeader } from "./components/calendar-header"
import { MonthView } from "./components/month-view"
import { WeekView } from "./components/week-view"
import { DayView } from "./components/day-view"
import { DayDetail } from "./components/day-detail"
import { useUIStore } from "@/stores/ui-store"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import { activeTasksApi } from "@/features/tasks/api/api-switch"
import {
  getViewTitle,
  getViewDateRange,
} from "./utils"

export function CalendarPage() {
  const viewMode = useUIStore((s) => s.calendarViewMode)
  const currentDate = useUIStore((s) => s.calendarDate)
  const selectedDate = useUIStore((s) => s.calendarSelectedDate)
  const setViewMode = useUIStore((s) => s.setCalendarViewMode)
  const setSelectedDate = useUIStore((s) => s.setCalendarSelectedDate)

  const openTaskCreate = useTaskDialogStore((s) => s.openCreate)
  const { handlePrev, handleNext, handleToday } = useCalendarActions()

  const { start, end } = getViewDateRange(currentDate, viewMode)
  const { dataByDate, isLoading, error: calendarError } = useCalendarData(start, end, activeTasksApi)

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
      ) : calendarError ? (
        <ErrorState message={calendarError.message} />
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
