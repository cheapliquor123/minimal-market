import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Button } from "@/shared/components/ui/button"
import { useTasks, useToggleTask } from "@/features/tasks/hooks/use-tasks"
import { useHabits } from "@/features/habits/hooks/use-habits"
import { useHabitLogs, useStreaks, useTodayLogs } from "@/features/habits/hooks/use-habit-logs"
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
  const { data: activeTasks = [] } = useTasks({ status: "active" })
  const toggleTask = useToggleTask()
  const { data: habits = [] } = useHabits()
  const { data: logs = [] } = useHabitLogs()

  const todayTasks = activeTasks.slice(0, 4)
  const streaks = useStreaks(habits, logs)
  const todayLogs = useTodayLogs(logs)
  const habitsToShow = habits.slice(0, 4)

  const totalStreaks = Object.values(streaks).reduce((sum, s) => sum + s, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Workspace"
        description="Your daily command center"
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
            {todayTasks.length > 0 ? (
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
            {habitsToShow.length > 0 ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
