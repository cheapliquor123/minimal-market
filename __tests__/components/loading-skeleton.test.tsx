import { render, screen } from "@testing-library/react"
import { TaskSkeleton, HabitSkeleton, NoteSkeleton, FolderSkeleton } from "@/shared/components/loading-skeleton"

describe("TaskSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<TaskSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("has animate-pulse class for loading animation", () => {
    const { container } = render(<TaskSkeleton />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })
})

describe("HabitSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<HabitSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("has animate-pulse class", () => {
    const { container } = render(<HabitSkeleton />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })
})

describe("NoteSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<NoteSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("has animate-pulse class", () => {
    const { container } = render(<NoteSkeleton />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })
})

describe("FolderSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<FolderSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("has animate-pulse class", () => {
    const { container } = render(<FolderSkeleton />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })
})
