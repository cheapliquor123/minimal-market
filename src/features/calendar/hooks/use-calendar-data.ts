import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Task } from "@/features/tasks/types"
import type { TaskFilters } from "@/features/tasks/types"
import { toDateStr } from "../utils"

export interface CalendarDayData {
  tasks: Task[]
}

export interface TasksApi {
  list: (filters?: TaskFilters) => Promise<Task[]>
}

export function useCalendarData(startDate: Date, endDate: Date, tasksApi: TasksApi) {
  const startStr = toDateStr(startDate)
  const endStr = toDateStr(endDate)

  const { data: tasks = [], isLoading, error } = useQuery({
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

  return { dataByDate, isLoading, error }
}
