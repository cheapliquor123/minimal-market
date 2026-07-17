import { api } from "@/shared/lib/api"
import type { Folder, CreateFolderInput, UpdateFolderInput } from "../types"

export const foldersApi = {
  async list(): Promise<Folder[]> {
    return api.get<Folder[]>("/api/folders")
  },

  async get(id: string): Promise<Folder> {
    return api.get<Folder>(`/api/folders/${id}`)
  },

  async create(input: CreateFolderInput): Promise<Folder> {
    return api.post<Folder>("/api/folders", input)
  },

  async update(id: string, input: UpdateFolderInput): Promise<Folder> {
    return api.patch<Folder>(`/api/folders/${id}`, input)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/api/folders/${id}`)
  },
}
