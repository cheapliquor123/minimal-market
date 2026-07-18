import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTask } from "@/features/tasks/hooks/use-tasks"
import { createMockTask } from "../test-utils"

jest.mock("@/features/tasks/api/api-switch", () => ({
  activeTasksApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    toggle: jest.fn(),
    remove: jest.fn(),
  },
}))

import { activeTasksApi } from "@/features/tasks/api/api-switch"
const mockApi = jest.mocked(activeTasksApi)

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

function createWrapper() {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={createTestQueryClient()}>
        {children}
      </QueryClientProvider>
    )
  }
  return Wrapper
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("useTasks", () => {
  it("fetches tasks list", async () => {
    const tasks = [createMockTask({ id: "1", title: "Task 1" })]
    mockApi.list.mockResolvedValue(tasks)

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(tasks)
    expect(mockApi.list).toHaveBeenCalledWith(undefined)
  })

  it("passes filters to api", async () => {
    mockApi.list.mockResolvedValue([])

    const { result } = renderHook(
      () => useTasks({ status: "active", priority: "high" }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.list).toHaveBeenCalledWith({ status: "active", priority: "high" })
  })
})

describe("useCreateTask", () => {
  it("creates a task and invalidates cache", async () => {
    const newTask = createMockTask({ id: "new-1", title: "New" })
    mockApi.create.mockResolvedValue(newTask)
    mockApi.list.mockResolvedValue([newTask])

    const { result } = renderHook(() => useCreateTask(), { wrapper: createWrapper() })

    result.current.mutate({ title: "New" })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.create).toHaveBeenCalledWith({ title: "New" })
  })
})

describe("useUpdateTask", () => {
  it("updates a task", async () => {
    const updated = createMockTask({ id: "1", title: "Updated" })
    mockApi.update.mockResolvedValue(updated)
    mockApi.list.mockResolvedValue([updated])

    const { result } = renderHook(() => useUpdateTask(), { wrapper: createWrapper() })

    result.current.mutate({ id: "1", input: { title: "Updated" } })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.update).toHaveBeenCalledWith("1", { title: "Updated" })
  })
})

describe("useDeleteTask", () => {
  it("deletes a task", async () => {
    mockApi.remove.mockResolvedValue(undefined)
    mockApi.list.mockResolvedValue([])

    const { result } = renderHook(() => useDeleteTask(), { wrapper: createWrapper() })

    result.current.mutate("1")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.remove).toHaveBeenCalledWith("1")
  })
})

describe("useToggleTask", () => {
  it("toggles a task", async () => {
    const task1 = createMockTask({ id: "1", title: "Task 1", completed: false })
    const toggled = { ...task1, completed: true }
    mockApi.list.mockResolvedValue([task1])
    mockApi.toggle.mockResolvedValue(toggled)

    const { result } = renderHook(() => useToggleTask(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current).toBeDefined()
    })

    result.current.mutate("1")

    await waitFor(() => {
      expect(mockApi.toggle).toHaveBeenCalledWith("1")
    })
  })
})
