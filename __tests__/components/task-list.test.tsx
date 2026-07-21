import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TaskList } from "@/features/tasks/components/task-list"
import { createMockTask, renderWithProviders } from "../test-utils"

const defaultProps = {
  onToggle: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("TaskList", () => {
  describe("loading state", () => {
    it("renders skeleton placeholders when loading", () => {
      const { container } = renderWithProviders(
        <TaskList tasks={[]} isLoading={true} {...defaultProps} />,
      )

      const skeletons = container.querySelectorAll(".animate-pulse")
      expect(skeletons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe("empty state", () => {
    it("shows 'No tasks yet' when no tasks and no filters", () => {
      renderWithProviders(<TaskList tasks={[]} {...defaultProps} />)
      expect(screen.getByText("No tasks yet")).toBeInTheDocument()
    })

    it("shows create button when onCreate is provided", () => {
      const onCreate = jest.fn()
      renderWithProviders(
        <TaskList tasks={[]} onCreate={onCreate} {...defaultProps} />,
      )
      expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument()
    })

    it("calls onCreate when create button is clicked", async () => {
      const user = userEvent.setup()
      const onCreate = jest.fn()
      renderWithProviders(
        <TaskList tasks={[]} onCreate={onCreate} {...defaultProps} />,
      )

      await user.click(screen.getByRole("button", { name: /create task/i }))
      expect(onCreate).toHaveBeenCalledTimes(1)
    })

    it("shows 'No matching tasks' when filters are active", () => {
      renderWithProviders(
        <TaskList
          tasks={[]}
          filters={{ search: "nonexistent" }}
          {...defaultProps}
        />,
      )
      expect(screen.getByText("No matching tasks")).toBeInTheDocument()
    })

    it("shows error state when error is provided", () => {
      renderWithProviders(
        <TaskList
          tasks={[]}
          error="Failed to load tasks"
          {...defaultProps}
        />,
      )
      expect(screen.getByText("Something went wrong")).toBeInTheDocument()
      expect(screen.getByText("Failed to load tasks")).toBeInTheDocument()
    })
  })

  describe("task list rendering", () => {
    it("renders all tasks", () => {
      const tasks = [
        createMockTask({ id: "1", title: "Task 1" }),
        createMockTask({ id: "2", title: "Task 2" }),
        createMockTask({ id: "3", title: "Task 3" }),
      ]

      renderWithProviders(<TaskList tasks={tasks} {...defaultProps} />)

      expect(screen.getByText("Task 1")).toBeInTheDocument()
      expect(screen.getByText("Task 2")).toBeInTheDocument()
      expect(screen.getByText("Task 3")).toBeInTheDocument()
    })

    it("renders correct number of task items", () => {
      const tasks = [
        createMockTask({ id: "1", title: "Task 1" }),
        createMockTask({ id: "2", title: "Task 2" }),
      ]

      const { container } = renderWithProviders(
        <TaskList tasks={tasks} {...defaultProps} />,
      )

      const checkboxes = container.querySelectorAll('[role="checkbox"]')
      expect(checkboxes).toHaveLength(2)
    })
  })
})
