import { useState } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { Button } from "@/shared/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useTasks, useDeleteTask, useToggleTask } from "./hooks/use-tasks"
import { TaskList } from "./components/task-list"
import { TaskFilters } from "./components/task-filters"
import { useUIStore } from "@/stores/ui-store"
import { useTaskDialogStore } from "@/stores/task-dialog-store"

export function TasksPage() {
  const filters = useUIStore((s) => s.taskFilters)
  const setFilters = useUIStore((s) => s.setTaskFilters)
  const openCreate = useTaskDialogStore((s) => s.openCreate)
  const openEdit = useTaskDialogStore((s) => s.openEdit)

  const { data: tasks = [], isLoading } = useTasks(filters)
  const deleteTask = useDeleteTask()
  const toggleTask = useToggleTask()

  const [deleteId, setDeleteId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="Manage your to-dos"
      />

      <Button onClick={() => openCreate()} className="w-fit bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]">
        <Plus className="size-4" />
        Add task
      </Button>

      <TaskFilters filters={filters} onChange={setFilters} />
      <TaskList
        tasks={tasks}
        filters={filters}
        isLoading={isLoading}
        onToggle={(id) => toggleTask.mutate(id)}
        onEdit={openEdit}
        onDelete={setDeleteId}
        onCreate={() => openCreate()}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteTask.mutate(deleteId)
                setDeleteId(null)
              }}
              className="bg-destructive text-destructive-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
