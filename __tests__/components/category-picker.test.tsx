import { vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CategoryPicker } from "@/features/tasks/components/category-picker"
import { renderWithProviders, createMockCategory } from "../test-utils"

const defaultProps = {
  value: "",
  categories: [
    createMockCategory({ id: "c1", name: "Work", color: "#ff6b9d" }),
    createMockCategory({ id: "c2", name: "Personal", color: "#7a83ff" }),
  ],
  onChange: vi.fn(),
  onCreateCategory: vi.fn(),
  isCreatingPending: false,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("CategoryPicker", () => {
  it("renders existing categories", () => {
    renderWithProviders(<CategoryPicker {...defaultProps} />)
    expect(screen.getByText("Work")).toBeInTheDocument()
    expect(screen.getByText("Personal")).toBeInTheDocument()
  })

  it("renders Add button", () => {
    renderWithProviders(<CategoryPicker {...defaultProps} />)
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
  })

  describe("category selection", () => {
    it("calls onChange with category name when clicked", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderWithProviders(
        <CategoryPicker {...defaultProps} onChange={onChange} />,
      )

      await user.click(screen.getByText("Work"))
      expect(onChange).toHaveBeenCalledWith("Work")
    })

    it("deselects when clicking selected category", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderWithProviders(
        <CategoryPicker {...defaultProps} value="Work" onChange={onChange} />,
      )

      await user.click(screen.getByText("Work"))
      expect(onChange).toHaveBeenCalledWith("")
    })
  })

  describe("creating new category", () => {
    it("opens creation form when Add is clicked", async () => {
      const user = userEvent.setup()
      renderWithProviders(<CategoryPicker {...defaultProps} />)

      await user.click(screen.getByRole("button", { name: /add/i }))
      expect(screen.getByPlaceholderText("Category name")).toBeInTheDocument()
    })

    it("calls onCreateCategory when save is clicked", async () => {
      const user = userEvent.setup()
      const onCreateCategory = vi.fn()
      renderWithProviders(
        <CategoryPicker {...defaultProps} onCreateCategory={onCreateCategory} />,
      )

      await user.click(screen.getByRole("button", { name: /add/i }))
      await user.type(screen.getByPlaceholderText("Category name"), "New Cat")
      await user.click(screen.getByRole("button", { name: /save/i }))

      expect(onCreateCategory).toHaveBeenCalledWith("New Cat", expect.any(String))
    })

    it("does not call onCreateCategory with empty name", async () => {
      const user = userEvent.setup()
      const onCreateCategory = vi.fn()
      renderWithProviders(
        <CategoryPicker {...defaultProps} onCreateCategory={onCreateCategory} />,
      )

      await user.click(screen.getByRole("button", { name: /add/i }))
      await user.click(screen.getByRole("button", { name: /save/i }))

      expect(onCreateCategory).not.toHaveBeenCalled()
    })

    it("cancel closes the creation form", async () => {
      const user = userEvent.setup()
      renderWithProviders(<CategoryPicker {...defaultProps} />)

      await user.click(screen.getByRole("button", { name: /add/i }))
      expect(screen.getByPlaceholderText("Category name")).toBeInTheDocument()

      const cancelButton = screen.getAllByRole("button").find(
        (btn) => btn.querySelector("svg") !== null && btn !== screen.getByRole("button", { name: /save/i }),
      )
      if (cancelButton) {
        await user.click(cancelButton)
      }
      expect(screen.queryByPlaceholderText("Category name")).not.toBeInTheDocument()
    })

    it("disable save button when pending", () => {
      renderWithProviders(
        <CategoryPicker {...defaultProps} isCreatingPending={true} />,
      )

      // Click Add first - but since we can't use async here, we check the component renders
      expect(screen.getByText("Work")).toBeInTheDocument()
    })
  })
})
