import { type ReactElement, type ReactNode } from "react"
import { render, renderHook, type RenderOptions } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import type { Task } from "@/features/tasks/types"
import type { Habit, HabitLog } from "@/features/habits/types"
import type { Note, Folder } from "@/features/notes/types"
import type { Category } from "@/features/tasks/types"

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
    logger: { error: () => {}, warn: () => {}, log: () => {} } as never,
  })
}

interface WrapperProps {
  children: ReactNode
  routerEntries?: string[]
}

function createWrapper(routerEntries: string[] = ["/"]) {
  function Wrapper({ children }: WrapperProps) {
    const queryClient = createTestQueryClient()
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={routerEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
  return Wrapper
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  routerEntries?: string[]
}

export function renderWithProviders(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { routerEntries, ...renderOptions } = options
  return render(ui, {
    wrapper: createWrapper(routerEntries),
    ...renderOptions,
  })
}

export function renderHookWithProviders<TResult>(
  hook: () => TResult,
  options: CustomRenderOptions = {},
) {
  const { routerEntries, ...renderOptions } = options
  return renderHook(hook, {
    wrapper: createWrapper(routerEntries),
    ...renderOptions,
  })
}

let idCounter = 0
function nextId() {
  return `test-id-${++idCounter}`
}

export function resetIdCounter() {
  idCounter = 0
}

export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: nextId(),
    title: "Test Task",
    description: null,
    completed: false,
    dueDate: null,
    priority: "medium",
    category: null,
    carryForward: false,
    missedCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: nextId(),
    name: "Test Habit",
    type: "binary",
    color: "#ff6b9d",
    goal: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockHabitLog(overrides: Partial<HabitLog> = {}): HabitLog {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, "0")
  const d = String(today.getDate()).padStart(2, "0")
  return {
    id: nextId(),
    habitId: "habit-1",
    date: `${y}-${m}-${d}`,
    value: 1,
    ...overrides,
  }
}

export function createMockNote(overrides: Partial<Note> = {}): Note {
  return {
    id: nextId(),
    title: "Test Note",
    content: "Test content",
    color: null,
    pinned: false,
    folderId: null,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockFolder(overrides: Partial<Folder> = {}): Folder {
  return {
    id: nextId(),
    name: "Test Folder",
    color: null,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: nextId(),
    name: "Test Category",
    color: "#ff6b9d",
    ...overrides,
  }
}
