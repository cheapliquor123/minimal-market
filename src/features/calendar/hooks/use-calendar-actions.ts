import { useCallback } from "react"
import { useUIStore } from "@/stores/ui-store"
import { navigateDate } from "../utils"

export function useCalendarActions() {
  const currentDate = useUIStore((s) => s.calendarDate)
  const viewMode = useUIStore((s) => s.calendarViewMode)
  const setCurrentDate = useUIStore((s) => s.setCalendarDate)
  const setSelectedDate = useUIStore((s) => s.setCalendarSelectedDate)

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

  return { handlePrev, handleNext, handleToday }
}
