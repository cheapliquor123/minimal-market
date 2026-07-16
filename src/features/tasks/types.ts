import { SHARED_COLORS } from "@/shared/lib/colors"

export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "all" | "active" | "completed"

export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  priority: TaskPriority
  category: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  category?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  dueDate?: string | null
  priority?: TaskPriority
  category?: string | null
  completed?: boolean
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority | "all"
  search?: string
  startDate?: string
  endDate?: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export const CATEGORY_COLORS = SHARED_COLORS
