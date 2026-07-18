import { renderHook, act } from "@testing-library/react"
import { useTaskForm } from "@/features/tasks/hooks/use-task-form"
import type { Task } from "@/features/tasks/types"

const mockTask: Task = {
  id: "task-1",
  title: "Existing Task",
  description: "Some description",
  completed: false,
  dueDate: "2025-06-15",
  priority: "high",
  category: "Work",
  carryForward: true,
  missedCount: 0,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
}

describe("useTaskForm", () => {
  describe("empty form defaults", () => {
    it("initializes with empty values", () => {
      const { result } = renderHook(() => useTaskForm({}))

      expect(result.current.title).toBe("")
      expect(result.current.description).toBe("")
      expect(result.current.dueDate).toBeUndefined()
      expect(result.current.priority).toBe("medium")
      expect(result.current.category).toBe("")
      expect(result.current.carryForward).toBe(false)
    })

    it("isValid is false when title is empty", () => {
      const { result } = renderHook(() => useTaskForm({}))
      expect(result.current.isValid).toBe(false)
    })

    it("isValid is true when title has content", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setTitle("New task")
      })

      expect(result.current.isValid).toBe(true)
    })

    it("isValid is false for whitespace-only title", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setTitle("   ")
      })

      expect(result.current.isValid).toBe(false)
    })
  })

  describe("pre-filled from task", () => {
    it("populates fields from existing task", () => {
      const { result } = renderHook(() => useTaskForm({ task: mockTask }))

      expect(result.current.title).toBe("Existing Task")
      expect(result.current.description).toBe("Some description")
      expect(result.current.priority).toBe("high")
      expect(result.current.category).toBe("Work")
      expect(result.current.carryForward).toBe(true)
    })

    it("parses dueDate string to Date object", () => {
      const { result } = renderHook(() => useTaskForm({ task: mockTask }))
      expect(result.current.dueDate).toBeInstanceOf(Date)
      expect(result.current.dueDate?.getFullYear()).toBe(2025)
      expect(result.current.dueDate?.getMonth()).toBe(5)
    })
  })

  describe("defaultDueDate", () => {
    it("uses defaultDueDate when no task is provided", () => {
      const { result } = renderHook(() =>
        useTaskForm({ defaultDueDate: "2025-12-25" }),
      )
      expect(result.current.dueDate).toBeInstanceOf(Date)
      expect(result.current.dueDate?.getDate()).toBe(25)
    })
  })

  describe("buildInput", () => {
    it("builds correct CreateTaskInput", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setTitle("My Task")
        result.current.setDescription("Details")
        result.current.setPriority("low")
        result.current.setCategory("Personal")
        result.current.setCarryForward(true)
      })

      const input = result.current.buildInput()
      expect(input).toEqual({
        title: "My Task",
        description: "Details",
        dueDate: undefined,
        priority: "low",
        category: "Personal",
        carryForward: true,
      })
    })

    it("trims whitespace from title and description", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setTitle("  My Task  ")
        result.current.setDescription("  Details  ")
      })

      const input = result.current.buildInput()
      expect(input.title).toBe("My Task")
      expect(input.description).toBe("Details")
    })

    it("sets description to undefined when empty", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setTitle("Task")
      })

      const input = result.current.buildInput()
      expect(input.description).toBeUndefined()
    })

    it("formats dueDate as yyyy-MM-dd", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setDueDate(new Date(2025, 5, 15))
      })

      const input = result.current.buildInput()
      expect(input.dueDate).toBe("2025-06-15")
    })

    it("sets category to undefined when empty", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => {
        result.current.setTitle("Task")
      })

      const input = result.current.buildInput()
      expect(input.category).toBeUndefined()
    })
  })

  describe("state setters", () => {
    it("all setters update their respective values", () => {
      const { result } = renderHook(() => useTaskForm({}))

      act(() => result.current.setTitle("New"))
      expect(result.current.title).toBe("New")

      act(() => result.current.setDescription("Desc"))
      expect(result.current.description).toBe("Desc")

      act(() => result.current.setPriority("high"))
      expect(result.current.priority).toBe("high")

      act(() => result.current.setCategory("Cat"))
      expect(result.current.category).toBe("Cat")

      act(() => result.current.setCarryForward(true))
      expect(result.current.carryForward).toBe(true)

      const date = new Date(2025, 0, 1)
      act(() => result.current.setDueDate(date))
      expect(result.current.dueDate).toBe(date)
    })
  })
})
