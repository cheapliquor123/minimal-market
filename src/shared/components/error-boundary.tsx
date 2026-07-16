import { Component, type ReactNode } from "react"
import { Button } from "@/shared/components/ui/button"

interface Props {
  children: ReactNode
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-base border-2 border-border bg-secondary-background p-8 shadow-shadow text-center">
          <p className="text-sm font-heading">Something went wrong</p>
          <p className="text-xs text-muted-foreground">
            An unexpected error occurred while loading this page.
          </p>
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
        </div>
      )
    }

    return this.props.children
  }
}
