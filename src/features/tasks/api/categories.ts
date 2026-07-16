import { api } from "@/shared/lib/api"
import type { Category } from "../types"

export const categoriesApi = {
  async list(): Promise<Category[]> {
    return api.get<Category[]>("/api/categories")
  },

  async create(input: { name: string; color: string }): Promise<Category> {
    return api.post<Category>("/api/categories", input)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/api/categories/${id}`)
  },
}
