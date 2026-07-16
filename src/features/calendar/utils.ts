import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
} from "date-fns"

export type ViewMode = "month" | "week" | "day"

export function toDateStr(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function fromDateStr(str: string): Date {
  return new Date(str + "T00:00:00")
}

export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  return eachDayOfInterval({ start: calStart, end: calEnd })
}

export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 })
  return eachDayOfInterval({ start: weekStart, end: weekEnd })
}

export function navigateDate(date: Date, mode: ViewMode, direction: "prev" | "next"): Date {
  if (mode === "month") return direction === "next" ? addMonths(date, 1) : subMonths(date, 1)
  if (mode === "week") return direction === "next" ? addWeeks(date, 1) : subWeeks(date, 1)
  return direction === "next" ? addDays(date, 1) : subDays(date, 1)
}

export function getViewTitle(date: Date, mode: ViewMode): string {
  if (mode === "month") return format(date, "MMMM yyyy")
  if (mode === "week") {
    const start = startOfWeek(date, { weekStartsOn: 0 })
    const end = endOfWeek(date, { weekStartsOn: 0 })
    if (isSameMonth(start, end)) {
      return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`
    }
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
  }
  return format(date, "EEEE, MMMM d, yyyy")
}

export function getViewDateRange(date: Date, mode: ViewMode): { start: Date; end: Date } {
  if (mode === "month") {
    return {
      start: startOfWeek(startOfMonth(date), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(date), { weekStartsOn: 0 }),
    }
  }
  if (mode === "week") {
    return {
      start: startOfWeek(date, { weekStartsOn: 0 }),
      end: endOfWeek(date, { weekStartsOn: 0 }),
    }
  }
  return { start: startOfDay(date), end: startOfDay(date) }
}

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export { isSameDay, isSameMonth, isToday, format, startOfDay }
