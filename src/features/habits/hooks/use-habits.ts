import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { habitsApi } from "../api/habits"
import type { CreateHabitInput, UpdateHabitInput } from "../types"

const QUERY_KEY = ["habits"]

export function useHabits() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => habitsApi.list(),
  })
}

export function useHabit(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => habitsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateHabitInput) => habitsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHabitInput }) =>
      habitsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => habitsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
