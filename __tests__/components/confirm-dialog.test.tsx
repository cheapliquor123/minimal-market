import { vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ConfirmDialog } from "@/shared/components/confirm-dialog"
import { renderWithProviders } from "../test-utils"

const defaultProps = {
  open: true,
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
  title: "Delete item?",
  description: "This action cannot be undone.",
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("ConfirmDialog", () => {
  it("renders title and description when open", () => {
    renderWithProviders(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText("Delete item?")).toBeInTheDocument()
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument()
  })

  it("renders default confirm label as 'Delete'", () => {
    renderWithProviders(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument()
  })

  it("renders custom confirm label", () => {
    renderWithProviders(
      <ConfirmDialog {...defaultProps} confirmLabel="Remove" />,
    )
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument()
  })

  it("renders Cancel button", () => {
    renderWithProviders(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
  })

  describe("interactions", () => {
    it("calls onConfirm when confirm button is clicked", async () => {
      const user = userEvent.setup()
      const onConfirm = vi.fn()
      renderWithProviders(
        <ConfirmDialog {...defaultProps} onConfirm={onConfirm} />,
      )

      await user.click(screen.getByRole("button", { name: /delete/i }))
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it("calls onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      renderWithProviders(
        <ConfirmDialog {...defaultProps} onCancel={onCancel} />,
      )

      await user.click(screen.getByRole("button", { name: /cancel/i }))
      expect(onCancel).toHaveBeenCalled()
    })
  })

  describe("closed state", () => {
    it("does not render content when closed", () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} open={false} />)
      expect(screen.queryByText("Delete item?")).not.toBeInTheDocument()
    })
  })
})
