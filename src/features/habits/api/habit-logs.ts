import { api } from "@/shared/lib/api"
import type { HabitLog } from "../types"

export const habitLogsApi = {
  async list(habitId?: string, startDate?: string, endDate?: string): Promise<HabitLog[]> {
    const params = new URLSearchParams()
    if (habitId) params.set("habitId", habitId)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    const qs = params.toString()
    return api.get<HabitLog[]>(`/api/habit-logs${qs ? `?${qs}` : ""}`)
  },

  async create(input: { habitId: string; date: string; value: number }): Promise<HabitLog> {
    return api.post<HabitLog>("/api/habit-logs", input)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/api/habit-logs/${id}`)
  },
}
