import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { activeNotesApi } from "../api/notes-api-switch"
import { handleMutationError } from "@/shared/lib/errors"
import type { CreateNoteInput, UpdateNoteInput } from "../types"

const NOTES_KEY = ["notes"]

export function useNotes(folderId?: string | null, search?: string) {
  return useQuery({
    queryKey: [...NOTES_KEY, { folderId: folderId ?? null, search: search ?? "" }],
    queryFn: () => activeNotesApi.list(folderId, search),
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateNoteInput) => activeNotesApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTES_KEY })
    },
    onError: (err) => {
      console.error("Failed to create note:", err)
      handleMutationError(err)
    },
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) =>
      activeNotesApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTES_KEY })
    },
    onError: (err) => {
      console.error("Failed to update note:", err)
      handleMutationError(err)
    },
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activeNotesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTES_KEY })
    },
    onError: (err) => {
      console.error("Failed to delete note:", err)
      handleMutationError(err)
    },
  })
}
