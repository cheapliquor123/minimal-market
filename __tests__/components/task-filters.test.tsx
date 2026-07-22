import { vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TaskFilters } from "@/features/tasks/components/task-filters"
import { renderWithProviders } from "../test-utils"
import type { TaskFilters as TaskFiltersType } from "@/features/tasks/types"

const defaultFilters: TaskFiltersType = { status: "active", priority: "all" }

describe("TaskFilters", () => {
  it("renders status filter buttons", () => {
    renderWithProviders(
      <TaskFilters filters={defaultFilters} onChange={vi.fn()} />,
    )

    expect(screen.getAllByRole("button", { name: /all/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /done/i })).toBeInTheDocument()
  })

  it("renders priority filter buttons", () => {
    renderWithProviders(
      <TaskFilters filters={defaultFilters} onChange={vi.fn()} />,
    )

    const priorityButtons = screen.getAllByText(/all|high|med|low/i)
    expect(priorityButtons.length).toBeGreaterThanOrEqual(5)
  })

  it("renders search input", () => {
    renderWithProviders(
      <TaskFilters filters={defaultFilters} onChange={vi.fn()} />,
    )

    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument()
  })

  describe("status filter interactions", () => {
    it("calls onChange with active status when Active is clicked", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderWithProviders(
        <TaskFilters filters={defaultFilters} onChange={onChange} />,
      )

      await user.click(screen.getByRole("button", { name: /active/i }))
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ status: "active" }),
      )
    })

    it("calls onChange with completed status when Done is clicked", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderWithProviders(
        <TaskFilters filters={defaultFilters} onChange={onChange} />,
      )

      const doneButtons = screen.getAllByText("Done")
      await user.click(doneButtons[0])
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ status: "completed" }),
      )
    })
  })

  describe("priority filter interactions", () => {
    it("calls onChange with high priority", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderWithProviders(
        <TaskFilters filters={defaultFilters} onChange={onChange} />,
      )

      const highButtons = screen.getAllByText("High")
      await user.click(highButtons[0])
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ priority: "high" }),
      )
    })
  })

  describe("search interaction", () => {
    it("calls onChange with search text when typing", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderWithProviders(
        <TaskFilters filters={defaultFilters} onChange={onChange} />,
      )

      await user.type(screen.getByPlaceholderText("Search tasks..."), "test")
      expect(onChange).toHaveBeenCalled()
    })
  })
})
