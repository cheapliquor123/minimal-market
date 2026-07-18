import { useState, useCallback } from "react"
import { format } from "date-fns"
import type { Task, CreateTaskInput, TaskPriority } from "../types"

interface UseTaskFormOptions {
  task?: Task | null
  defaultDueDate?: string
}

export function useTaskForm({ task, defaultDueDate }: UseTaskFormOptions) {
  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate
      ? new Date(task.dueDate + "T00:00:00")
      : defaultDueDate
        ? new Date(defaultDueDate + "T00:00:00")
        : undefined,
  )
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium")
  const [category, setCategory] = useState(task?.category ?? "")
  const [carryForward, setCarryForward] = useState(task?.carryForward ?? false)

  const buildInput = useCallback((): CreateTaskInput => ({
    title: title.trim(),
    description: description.trim() || undefined,
    dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
    priority,
    category: category || undefined,
    carryForward,
  }), [title, description, dueDate, priority, category, carryForward])

  const isValid = title.trim().length > 0

  return {
    title, setTitle,
    description, setDescription,
    dueDate, setDueDate,
    priority, setPriority,
    category, setCategory,
    carryForward, setCarryForward,
    buildInput,
    isValid,
  }
}
