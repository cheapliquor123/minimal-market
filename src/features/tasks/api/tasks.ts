import { api } from "@/shared/lib/api"
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from "../types"

function buildQueryString(filters?: TaskFilters): string {
  if (!filters) return ""
  const params = new URLSearchParams()
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.priority && filters.priority !== "all") params.set("priority", filters.priority)
  if (filters.search) params.set("search", filters.search)
  if (filters.startDate) params.set("startDate", filters.startDate)
  if (filters.endDate) params.set("endDate", filters.endDate)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export const tasksApi = {
  async list(filters?: TaskFilters): Promise<Task[]> {
    return api.get<Task[]>(`/api/tasks${buildQueryString(filters)}`)
  },

  async get(id: string): Promise<Task> {
    return api.get<Task>(`/api/tasks/${id}`)
  },

  async create(input: CreateTaskInput): Promise<Task> {
    return api.post<Task>("/api/tasks", input)
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    return api.patch<Task>(`/api/tasks/${id}`, input)
  },

  async toggle(id: string): Promise<Task> {
    return api.patch<Task>(`/api/tasks/${id}/toggle`)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/api/tasks/${id}`)
  },

  async carryForward(): Promise<{ tasksCarriedForward: number }> {
    return api.post<{ tasksCarriedForward: number }>("/api/tasks/carryforward")
  },
}
