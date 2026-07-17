import { api } from "@/shared/lib/api"
import type { Note, CreateNoteInput, UpdateNoteInput } from "../types"

export const notesApi = {
  async list(folderId?: string | null, search?: string): Promise<Note[]> {
    const params = new URLSearchParams()
    if (folderId) params.set("folderId", folderId)
    if (search) params.set("search", search)
    const qs = params.toString() ? `?${params}` : ""
    return api.get<Note[]>(`/api/notes${qs}`)
  },

  async get(id: string): Promise<Note> {
    return api.get<Note>(`/api/notes/${id}`)
  },

  async create(input: CreateNoteInput): Promise<Note> {
    return api.post<Note>("/api/notes", input)
  },

  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    return api.patch<Note>(`/api/notes/${id}`, input)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/api/notes/${id}`)
  },
}
