import { vi } from "vitest"
import { Component, type ReactNode } from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ErrorBoundary } from "@/shared/components/error-boundary"
import { renderWithProviders } from "../test-utils"

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error")
  }
  return <div>Child content</div>
}

class FallbackErrorBoundary extends Component<
  { children: ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError?: () => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) {
      return <div>Fallback caught error</div>
    }
    return this.props.children
  }
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders children when no error", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Child content")).toBeInTheDocument()
  })

  it("renders fallback UI when child throws", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(
      screen.getByText("An unexpected error occurred while loading this page."),
    ).toBeInTheDocument()
  })

  it("renders Try again button in error state", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
  })

  it("does not render Try again button when no error", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument()
  })

  it("Try again button is clickable and triggers error boundary reset", async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    const tryAgainBtn = screen.getByRole("button", { name: /try again/i })
    expect(tryAgainBtn).toBeInTheDocument()

    await user.click(tryAgainBtn)

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()

    unmount()
  })

  it("calls console.error when an error is caught", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(console.error).toHaveBeenCalled()
  })
})
