import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { activeTasksApi as tasksApi } from "../api/api-switch"
import { handleMutationError } from "@/shared/lib/errors"
import type { Task, TaskFilters, CreateTaskInput, UpdateTaskInput } from "../types"

const QUERY_KEY = ["tasks"]

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => tasksApi.list(filters),
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => tasksApi.get(id),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      console.error("Failed to create task:", err)
      handleMutationError(err)
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      console.error("Failed to update task:", err)
      handleMutationError(err)
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      console.error("Failed to delete task:", err)
      handleMutationError(err)
    },
  })
}

export function useToggleTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksApi.toggle(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY })

      const prev = qc.getQueriesData<Task[]>({ queryKey: QUERY_KEY })

      qc.setQueriesData<Task[]>(
        { queryKey: QUERY_KEY },
        (old) => {
          if (!old) return old
          return old.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          )
        },
      )

      return { prev }
    },
    onError: (err, _id, context) => {
      if (context?.prev) {
        for (const [key, data] of context.prev) {
          qc.setQueryData(key, data)
        }
      }
      console.error("Failed to toggle task:", err)
      handleMutationError(err)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
