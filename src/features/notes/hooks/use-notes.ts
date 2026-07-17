import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notesApi } from "../api/notes"
import type { CreateNoteInput, UpdateNoteInput } from "../types"

const QUERY_KEY = ["notes"]

export function useNotes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => notesApi.list(),
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateNoteInput) => notesApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) =>
      notesApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
