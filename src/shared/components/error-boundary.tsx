import { Component, type ReactNode, type ErrorInfo } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/shared/components/ui/button"
import { logger } from "@/shared/lib/logger"

interface Props {
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("ErrorBoundary caught:", error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-base border-2 border-border bg-secondary-background p-8 shadow-shadow text-center">
          <p className="text-sm font-heading">Something went wrong</p>
          <p className="text-xs text-muted-foreground">
            An unexpected error occurred while loading this page.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Try again
            </Button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 py-1 text-[0.8rem] font-medium hover:bg-muted"
            >
              Go home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
