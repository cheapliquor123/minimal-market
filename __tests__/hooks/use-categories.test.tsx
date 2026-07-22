import { vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useCategories, useCreateCategory, useDeleteCategory } from "@/features/tasks/hooks/use-categories"
import { createMockCategory } from "../test-utils"

vi.mock("@/features/tasks/api/categories", () => ({
  categoriesApi: {
    list: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}))

import { categoriesApi } from "@/features/tasks/api/categories"
const mockApi = vi.mocked(categoriesApi)

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

describe("useCategories", () => {
  it("fetches categories list", async () => {
    const cats = [createMockCategory({ id: "c1", name: "Work" })]
    mockApi.list.mockResolvedValue(cats)

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(cats)
  })
})

describe("useCreateCategory", () => {
  it("creates a category", async () => {
    const cat = createMockCategory({ id: "c-new", name: "New" })
    mockApi.create.mockResolvedValue(cat)
    mockApi.list.mockResolvedValue([cat])

    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() })

    result.current.mutate({ name: "New", color: "#ff0000" })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.create).toHaveBeenCalledWith({ name: "New", color: "#ff0000" })
  })
})

describe("useDeleteCategory", () => {
  it("deletes a category", async () => {
    mockApi.remove.mockResolvedValue(undefined)
    mockApi.list.mockResolvedValue([])

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() })

    result.current.mutate("c1")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.remove).toHaveBeenCalledWith("c1")
  })
})
