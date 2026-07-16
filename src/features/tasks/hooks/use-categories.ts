import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { categoriesApi } from "../api/categories"

const QUERY_KEY = ["categories"]

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => categoriesApi.list(),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: { name: string; color: string }) =>
      categoriesApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
