import { useCallback } from "react"
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTask } from "./use-tasks"
import { useUIStore } from "@/stores/ui-store"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import { useDeleteConfirmation } from "@/shared/hooks/use-delete-confirmation"
import type { CreateTaskInput, UpdateTaskInput, TaskFilters } from "../types"

export function useTasksPage() {
  const filters = useUIStore((s) => s.taskFilters)
  const setFilters = useUIStore((s) => s.setTaskFilters)

  const openCreate = useTaskDialogStore((s) => s.openCreate)
  const openEdit = useTaskDialogStore((s) => s.openEdit)

  const { data: tasks = [], isLoading } = useTasks(filters)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const toggleTask = useToggleTask()

  const { deleteId, confirm: confirmDelete, cancel: cancelDelete } = useDeleteConfirmation()

  const handleToggle = useCallback((id: string) => {
    toggleTask.mutate(id)
  }, [toggleTask])

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteTask.mutate(deleteId)
      cancelDelete()
    }
  }, [deleteId, deleteTask, cancelDelete])

  const handleCreateSubmit = useCallback((input: CreateTaskInput) => {
    createTask.mutate(input, { onSuccess: () => useTaskDialogStore.getState().close() })
  }, [createTask])

  const handleUpdateSubmit = useCallback((input: UpdateTaskInput) => {
    const editing = useTaskDialogStore.getState().editingTask
    if (editing) {
      updateTask.mutate({ id: editing.id, input }, { onSuccess: () => useTaskDialogStore.getState().close() })
    }
  }, [updateTask])

  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters)
  }, [setFilters])

  const isPending = createTask.isPending || updateTask.isPending

  return {
    tasks,
    isLoading,
    filters,
    setFilters: handleFiltersChange,
    openCreate,
    openEdit,
    handleToggle,
    handleDelete,
    handleCreateSubmit,
    handleUpdateSubmit,
    confirmDelete,
    cancelDelete,
    deleteId,
    isPending,
  }
}
