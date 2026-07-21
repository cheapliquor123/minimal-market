import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { activeFoldersApi } from "../api/folders-api-switch"
import { handleMutationError } from "@/shared/lib/errors"
import type { CreateFolderInput, UpdateFolderInput } from "../types"

const FOLDERS_KEY = ["folders"]

export function useFolders() {
  return useQuery({
    queryKey: FOLDERS_KEY,
    queryFn: () => activeFoldersApi.list(),
  })
}

export function useCreateFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFolderInput) => activeFoldersApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDERS_KEY })
    },
    onError: (err) => {
      console.error("Failed to create folder:", err)
      handleMutationError(err)
    },
  })
}

export function useUpdateFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFolderInput }) =>
      activeFoldersApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDERS_KEY })
    },
    onError: (err) => {
      console.error("Failed to update folder:", err)
      handleMutationError(err)
    },
  })
}

export function useDeleteFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activeFoldersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLDERS_KEY })
      qc.invalidateQueries({ queryKey: ["notes"] })
    },
    onError: (err) => {
      console.error("Failed to delete folder:", err)
      handleMutationError(err)
    },
  })
}
