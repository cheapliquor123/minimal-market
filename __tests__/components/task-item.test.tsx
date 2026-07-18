import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TaskItem } from "@/features/tasks/components/task-item"
import { createMockTask, renderWithProviders } from "../test-utils"
import type { Task } from "@/features/tasks/types"

function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const defaultProps = {
  onToggle: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
}

function renderTask(task: Partial<Task> = {}) {
  return renderWithProviders(
    <TaskItem
      task={createMockTask(task)}
      onToggle={defaultProps.onToggle}
      onEdit={defaultProps.onEdit}
      onDelete={defaultProps.onDelete}
    />,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("TaskItem", () => {
  it("renders task title", () => {
    renderTask({ title: "Buy groceries" })
    expect(screen.getByText("Buy groceries")).toBeInTheDocument()
  })

  it("renders priority badge", () => {
    renderTask({ priority: "high" })
    expect(screen.getByText("High")).toBeInTheDocument()
  })

  it("renders low priority badge", () => {
    renderTask({ priority: "low" })
    expect(screen.getByText("Low")).toBeInTheDocument()
  })

  it("renders medium priority badge", () => {
    renderTask({ priority: "medium" })
    expect(screen.getByText("Med")).toBeInTheDocument()
  })

  describe("due date", () => {
    it("shows 'Today' for today's due date", () => {
      renderTask({ dueDate: todayStr() })
      expect(screen.getByText("Today")).toBeInTheDocument()
    })

    it("shows 'Tomorrow' for tomorrow's due date", () => {
      renderTask({ dueDate: daysFromNow(1) })
      expect(screen.getByText("Tomorrow")).toBeInTheDocument()
    })

    it("shows overdue label for past due date", () => {
      renderTask({ dueDate: daysFromNow(-2) })
      expect(screen.getByText("2d overdue")).toBeInTheDocument()
    })

    it("shows future due date label", () => {
      renderTask({ dueDate: daysFromNow(5) })
      expect(screen.getByText("In 5d")).toBeInTheDocument()
    })
  })

  describe("category", () => {
    it("renders category name", () => {
      renderTask({ category: "Work" })
      expect(screen.getByText("Work")).toBeInTheDocument()
    })

    it("does not render category when null", () => {
      renderTask({ category: null })
      expect(screen.queryByText("Work")).not.toBeInTheDocument()
    })
  })

  describe("carry forward", () => {
    it("shows missed badge when carryForward and missedCount > 0", () => {
      renderTask({ carryForward: true, missedCount: 3 })
      expect(screen.getByText("Missed 3x")).toBeInTheDocument()
    })

    it("shows repeat icon when carryForward and missedCount === 0", () => {
      const { container } = renderTask({ carryForward: true, missedCount: 0 })
      expect(container.querySelector("svg")).toBeInTheDocument()
    })
  })

  describe("completed state", () => {
    it("applies opacity class when completed", () => {
      const { container } = renderTask({ completed: true })
      expect(container.firstChild).toHaveClass("opacity-60")
    })

    it("applies line-through to title when completed", () => {
      renderTask({ completed: true, title: "Done task" })
      expect(screen.getByText("Done task")).toHaveClass("line-through")
    })
  })

  describe("interactions", () => {
    it("calls onToggle when checkbox is clicked", async () => {
      const user = userEvent.setup()
      const onToggle = jest.fn()
      renderWithProviders(
        <TaskItem
          task={createMockTask({ id: "t-1" })}
          onToggle={onToggle}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />,
      )

      const checkbox = screen.getByRole("checkbox")
      await user.click(checkbox)
      expect(onToggle).toHaveBeenCalledWith("t-1")
    })
  })
})
