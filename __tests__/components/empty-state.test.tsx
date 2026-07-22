import { vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AlertCircle } from "lucide-react"
import { EmptyState } from "@/shared/components/empty-state"
import { renderWithProviders } from "../test-utils"

describe("EmptyState", () => {
  it("renders title and description", () => {
    renderWithProviders(
      <EmptyState icon={AlertCircle} title="No items" description="Create something to get started" />,
    )

    expect(screen.getByText("No items")).toBeInTheDocument()
    expect(screen.getByText("Create something to get started")).toBeInTheDocument()
  })

  it("renders the icon", () => {
    const { container } = renderWithProviders(
      <EmptyState icon={AlertCircle} title="Empty" description="Nothing here" />,
    )

    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders action button when action is provided", () => {
    const onClick = vi.fn()
    renderWithProviders(
      <EmptyState
        icon={AlertCircle}
        title="Empty"
        description="Nothing"
        action={{ label: "Create item", onClick }}
      />,
    )

    const button = screen.getByRole("button", { name: /create item/i })
    expect(button).toBeInTheDocument()
  })

  it("calls action onClick when button is clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithProviders(
      <EmptyState
        icon={AlertCircle}
        title="Empty"
        description="Nothing"
        action={{ label: "Create item", onClick }}
      />,
    )

    await user.click(screen.getByRole("button", { name: /create item/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not render action button when action is not provided", () => {
    renderWithProviders(
      <EmptyState icon={AlertCircle} title="Empty" description="Nothing" />,
    )

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
