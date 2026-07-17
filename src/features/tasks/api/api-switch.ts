import { tasksApi } from "./tasks"
import { mockTasksApi } from "./mock-tasks"

export const activeTasksApi =
  import.meta.env.VITE_USE_MOCK === "true" ? mockTasksApi : tasksApi
