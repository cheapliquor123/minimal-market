import { useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Plus } from "lucide-react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Button } from "@/shared/components/ui/button"
import { useTasks, useToggleTask } from "@/features/tasks/hooks/use-tasks"
import { useHabits } from "@/features/habits/hooks/use-habits"
import { useHabitLogs, calculateStreaks, getTodayLogs } from "@/features/habits/hooks/use-habit-logs"
import { useToday } from "@/stores/date-store"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import type { Task } from "@/features/tasks/types"

function MiniTaskItem({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />
      <span
        className={`text-sm flex-1 truncate ${
          task.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {task.title}
      </span>
      {task.dueDate && (
        <Badge variant={task.completed ? "outline" : "secondary"} className="text-[10px]">
          {task.dueDate}
        </Badge>
      )}
    </div>
  )
}

function MiniHabitItem({
  name,
  color,
  streak,
  completed,
}: {
  name: string
  color: string
  streak: number
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="size-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm flex-1 truncate">{name}</span>
      {streak > 0 && (
        <Badge variant="warning" className="text-[10px]">
          {streak}d
        </Badge>
      )}
      {completed && (
        <Badge variant="success" className="text-[10px]">
          Done
        </Badge>
      )}
    </div>
  )
}

export function WorkspacePage() {
  const today = useToday()
  const openCreate = useTaskDialogStore((s) => s.openCreate)
  const { data: activeTasks = [], error: tasksError } = useTasks({ status: "active" })
  const toggleTask = useToggleTask()
  const { data: habits = [], error: habitsError } = useHabits()
  const { data: logs = [], error: logsError } = useHabitLogs()

  const todayTasks = activeTasks.slice(0, 4)
  const streaks = useMemo(() => calculateStreaks(habits, logs), [habits, logs])
  const todayLogs = useMemo(() => getTodayLogs(logs, today), [logs, today])
  const habitsToShow = habits.slice(0, 4)

  const totalStreaks = Object.values(streaks).reduce<number>((sum, s) => sum + s, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Workspace"
        description="Your daily command center"
        action={
          <Button onClick={() => openCreate()} className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]">
            <Plus className="size-4" />
            Add task
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Tasks</CardTitle>
            <Link to="/tasks">
              <Button variant="ghost" size="xs">
                View all
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {tasksError ? (
              <p className="text-sm text-destructive">Failed to load tasks.</p>
            ) : todayTasks.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {todayTasks.map((task) => (
                  <MiniTaskItem
                    key={task.id}
                    task={task}
                    onToggle={(id) => toggleTask.mutate(id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active tasks. You're all caught up!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Habits</CardTitle>
            <Link to="/habits">
              <Button variant="ghost" size="xs">
                View all
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {habitsError ? (
              <p className="text-sm text-destructive">Failed to load habits.</p>
            ) : habitsToShow.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {habitsToShow.map((habit) => (
                  <MiniHabitItem
                    key={habit.id}
                    name={habit.name}
                    color={habit.color}
                    streak={streaks[habit.id] ?? 0}
                    completed={todayLogs.has(habit.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No habits tracked yet. Start building routines.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Stats</CardTitle>
            <Link to="/calendar">
              <Button variant="ghost" size="xs">
                View calendar
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {(tasksError || habitsError || logsError) ? (
              <p className="text-sm text-destructive">Failed to load stats.</p>
            ) : (
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active tasks</span>
                  <span className="font-heading">{activeTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Habits today</span>
                  <span className="font-heading">{todayLogs.size}/{habits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total streak days</span>
                  <span className="font-heading">{totalStreaks}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
