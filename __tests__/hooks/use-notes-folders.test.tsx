import { vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "@/features/notes/hooks/use-notes"
import { useFolders, useCreateFolder, useUpdateFolder, useDeleteFolder } from "@/features/notes/hooks/use-folders"
import { createMockNote, createMockFolder } from "../test-utils"

vi.mock("@/features/notes/api/notes-api-switch", () => ({
  activeNotesApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock("@/features/notes/api/folders-api-switch", () => ({
  activeFoldersApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { activeNotesApi } from "@/features/notes/api/notes-api-switch"
import { activeFoldersApi } from "@/features/notes/api/folders-api-switch"
const mockNotesApi = vi.mocked(activeNotesApi)
const mockFoldersApi = vi.mocked(activeFoldersApi)

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

describe("useNotes", () => {
  it("fetches notes list", async () => {
    const notes = [createMockNote({ id: "n1", title: "Note 1" })]
    mockNotesApi.list.mockResolvedValue(notes)

    const { result } = renderHook(() => useNotes(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(notes)
  })

  it("passes folderId and search to api", async () => {
    mockNotesApi.list.mockResolvedValue([])

    const { result } = renderHook(
      () => useNotes("folder-1", "search term"),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNotesApi.list).toHaveBeenCalledWith("folder-1", "search term")
  })
})

describe("useCreateNote", () => {
  it("creates a note", async () => {
    const note = createMockNote({ id: "n-new", title: "New" })
    mockNotesApi.create.mockResolvedValue(note)
    mockNotesApi.list.mockResolvedValue([note])

    const { result } = renderHook(() => useCreateNote(), { wrapper: createWrapper() })

    result.current.mutate({ title: "New" })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNotesApi.create).toHaveBeenCalledWith({ title: "New" })
  })
})

describe("useUpdateNote", () => {
  it("updates a note", async () => {
    const note = createMockNote({ id: "n1", title: "Updated" })
    mockNotesApi.update.mockResolvedValue(note)
    mockNotesApi.list.mockResolvedValue([note])

    const { result } = renderHook(() => useUpdateNote(), { wrapper: createWrapper() })

    result.current.mutate({ id: "n1", input: { title: "Updated" } })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNotesApi.update).toHaveBeenCalledWith("n1", { title: "Updated" })
  })
})

describe("useDeleteNote", () => {
  it("deletes a note", async () => {
    mockNotesApi.remove.mockResolvedValue(undefined)
    mockNotesApi.list.mockResolvedValue([])

    const { result } = renderHook(() => useDeleteNote(), { wrapper: createWrapper() })

    result.current.mutate("n1")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNotesApi.remove).toHaveBeenCalledWith("n1")
  })
})

describe("useFolders", () => {
  it("fetches folders list", async () => {
    const folders = [createMockFolder({ id: "f1", name: "Work" })]
    mockFoldersApi.list.mockResolvedValue(folders)

    const { result } = renderHook(() => useFolders(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(folders)
  })
})

describe("useCreateFolder", () => {
  it("creates a folder", async () => {
    const folder = createMockFolder({ id: "f-new", name: "New" })
    mockFoldersApi.create.mockResolvedValue(folder)
    mockFoldersApi.list.mockResolvedValue([folder])

    const { result } = renderHook(() => useCreateFolder(), { wrapper: createWrapper() })

    result.current.mutate({ name: "New" })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockFoldersApi.create).toHaveBeenCalledWith({ name: "New" })
  })
})

describe("useUpdateFolder", () => {
  it("updates a folder", async () => {
    const folder = createMockFolder({ id: "f1", name: "Updated" })
    mockFoldersApi.update.mockResolvedValue(folder)
    mockFoldersApi.list.mockResolvedValue([folder])

    const { result } = renderHook(() => useUpdateFolder(), { wrapper: createWrapper() })

    result.current.mutate({ id: "f1", input: { name: "Updated" } })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockFoldersApi.update).toHaveBeenCalledWith("f1", { name: "Updated" })
  })
})

describe("useDeleteFolder", () => {
  it("deletes a folder", async () => {
    mockFoldersApi.remove.mockResolvedValue(undefined)
    mockFoldersApi.list.mockResolvedValue([])

    const { result } = renderHook(() => useDeleteFolder(), { wrapper: createWrapper() })

    result.current.mutate("f1")

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockFoldersApi.remove).toHaveBeenCalledWith("f1")
  })
})
