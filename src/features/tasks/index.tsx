import { Plus } from "lucide-react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { Button } from "@/shared/components/ui/button"
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
        onDelete={(id) => {
          if (window.confirm("Delete this task?")) deleteTask.mutate(id)
        }}
        onCreate={() => openCreate()}
      />
    </div>
  )
}
