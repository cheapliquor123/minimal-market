import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { activeTasksApi as tasksApi } from "@/features/tasks/api/api-switch"
import type { Task } from "@/features/tasks/types"
import { toDateStr } from "../utils"

export interface CalendarDayData {
  tasks: Task[]
}

export function useCalendarData(startDate: Date, endDate: Date) {
  const startStr = toDateStr(startDate)
  const endStr = toDateStr(endDate)

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", startStr, endStr],
    queryFn: () => tasksApi.list({ startDate: startStr, endDate: endStr }),
  })

  const dataByDate = useMemo(() => {
    const map = new Map<string, CalendarDayData>()

    for (const task of tasks) {
      if (!task.dueDate) continue
      if (task.dueDate < startStr || task.dueDate > endStr) continue
      const existing = map.get(task.dueDate) ?? { tasks: [] }
      existing.tasks.push(task)
      map.set(task.dueDate, existing)
    }

    return map
  }, [tasks, startStr, endStr])

  return { dataByDate, isLoading }
}
