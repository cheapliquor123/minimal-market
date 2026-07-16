import { api } from "@/shared/lib/api"
import type { Habit, UpdateHabitInput } from "../types"

export const habitsApi = {
  async list(): Promise<Habit[]> {
    return api.get<Habit[]>("/api/habits")
  },

  async get(id: string): Promise<Habit> {
    return api.get<Habit>(`/api/habits/${id}`)
  },

  async create(input: { name: string; type: Habit["type"]; color: string; goal?: number }): Promise<Habit> {
    return api.post<Habit>("/api/habits", input)
  },

  async update(id: string, input: UpdateHabitInput): Promise<Habit> {
    return api.patch<Habit>(`/api/habits/${id}`, input)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/api/habits/${id}`)
  },
}
