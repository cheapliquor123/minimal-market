import { differenceInCalendarDays } from "date-fns"
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from "../types"

const STORAGE_KEY = "mock_tasks"

function getToday(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function now(): string {
  return new Date().toISOString()
}

function applyCarryForward(tasks: Task[]): Task[] {
  const today = getToday()
  let changed = false

  const updated = tasks.map((task) => {
    if (!task.carryForward || task.completed || !task.dueDate) return task
    if (task.dueDate >= today) return task

    const daysMissed = differenceInCalendarDays(
      new Date(today + "T00:00:00"),
      new Date(task.dueDate + "T00:00:00"),
    )

    changed = true
    return {
      ...task,
      dueDate: today,
      missedCount: daysMissed,
      updatedAt: now(),
    }
  })

  if (changed) saveTasks(updated)
  return updated
}

function filterTasks(tasks: Task[], filters?: TaskFilters): Task[] {
  if (!filters) return tasks

  return tasks.filter((task) => {
    if (filters.status === "active" && task.completed) return false
    if (filters.status === "completed" && !task.completed) return false
    if (filters.priority && filters.priority !== "all" && task.priority !== filters.priority)
      return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matchTitle = task.title.toLowerCase().includes(q)
      const matchDesc = task.description?.toLowerCase().includes(q) ?? false
      if (!matchTitle && !matchDesc) return false
    }
    if (filters.startDate && task.dueDate && task.dueDate < filters.startDate) return false
    if (filters.endDate && task.dueDate && task.dueDate > filters.endDate) return false
    return true
  })
}

export const mockTasksApi = {
  async list(filters?: TaskFilters): Promise<Task[]> {
    const tasks = loadTasks()
    const updated = applyCarryForward(tasks)
    return filterTasks(updated, filters)
  },

  async get(id: string): Promise<Task> {
    const tasks = loadTasks()
    const updated = applyCarryForward(tasks)
    const task = updated.find((t) => t.id === id)
    if (!task) throw { message: "Task not found", status: 404 }
    return task
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const tasks = loadTasks()
    const ts = now()
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? null,
      completed: false,
      dueDate: input.dueDate ?? null,
      priority: input.priority ?? "medium",
      category: input.category ?? null,
      carryForward: input.carryForward ?? false,
      missedCount: 0,
      createdAt: ts,
      updatedAt: ts,
    }
    tasks.push(task)
    saveTasks(tasks)
    return task
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const tasks = loadTasks()
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) throw { message: "Task not found", status: 404 }

    const existing = tasks[idx]
    const { carryForward: cfInput, ...rest } = input
    const updated: Task = {
      ...existing,
      ...rest,
      carryForward: cfInput != null ? cfInput : existing.carryForward,
      missedCount: cfInput === false ? 0 : existing.missedCount,
      updatedAt: now(),
    }
    tasks[idx] = updated
    saveTasks(tasks)
    return updated
  },

  async toggle(id: string): Promise<Task> {
    const tasks = loadTasks()
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) throw { message: "Task not found", status: 404 }

    const existing = tasks[idx]
    const updated: Task = {
      ...existing,
      completed: !existing.completed,
      updatedAt: now(),
    }
    tasks[idx] = updated
    saveTasks(tasks)
    return updated
  },

  async remove(id: string): Promise<void> {
    const tasks = loadTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    saveTasks(filtered)
  },

  async carryForward(): Promise<{ tasksCarriedForward: number }> {
    const tasks = loadTasks()
    const before = tasks.map((t) => t.dueDate)
    const updated = applyCarryForward(tasks)
    const count = updated.filter((t, i) => t.dueDate !== before[i]).length
    return { tasksCarriedForward: count }
  },
}
