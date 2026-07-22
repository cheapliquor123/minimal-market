import { vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit } from "@/features/habits/hooks/use-habits"
import { createMockHabit } from "../test-utils"

vi.mock("@/features/habits/api/habits", () => ({
  habitsApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { habitsApi } from "@/features/habits/api/habits"
const mockApi = vi.mocked(habitsApi)

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return Wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useHabits", () => {
  it("fetches habits list", async () => {
    const habits = [createMockHabit({ id: "h1", name: "Meditate" })]
    mockApi.list.mockResolvedValue(habits)

    const { result } = renderHook(() => useHabits(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(habits)
  })
})

describe("useCreateHabit", () => {
  it("creates a habit", async () => {
    const habit = createMockHabit({ id: "h-new", name: "New" })
    mockApi.create.mockResolvedValue(habit)
    mockApi.list.mockResolvedValue([habit])

    const { result } = renderHook(() => useCreateHabit(), { wrapper: createWrapper() })

    result.current.mutate({ name: "New", type: "binary", color: "#000" })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.create).toHaveBeenCalledWith({ name: "New", type: "binary", color: "#000" })
  })
})

describe("useUpdateHabit", () => {
  it("updates a habit", async () => {
    const habit = createMockHabit({ id: "h1", name: "Updated" })
    mockApi.update.mockResolvedValue(habit)
    mockApi.list.mockResolvedValue([habit])

    const { result } = renderHook(() => useUpdateHabit(), { wrapper: createWrapper() })

    result.current.mutate({ id: "h1", input: { name: "Updated" } })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.update).toHaveBeenCalledWith("h1", { name: "Updated" })
  })
})

describe("useDeleteHabit", () => {
  it("deletes a habit", async () => {
    mockApi.remove.mockResolvedValue(undefined)
    mockApi.list.mockResolvedValue([])

    const { result } = renderHook(() => useDeleteHabit(), { wrapper: createWrapper() })

    result.current.mutate("h1")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.remove).toHaveBeenCalledWith("h1")
  })
})
