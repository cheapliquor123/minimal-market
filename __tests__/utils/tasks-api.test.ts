import { tasksApi } from "@/features/tasks/api/tasks"
import { api } from "@/shared/lib/api"

jest.mock("@/shared/lib/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockApi = jest.mocked(api)

beforeEach(() => {
  jest.clearAllMocks()
})

describe("tasksApi.list", () => {
  it("calls api.get with /api/tasks", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list()
    expect(mockApi.get).toHaveBeenCalledWith("/api/tasks")
  })

  it("builds query string with status filter", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list({ status: "active" })
    expect(mockApi.get).toHaveBeenCalledWith("/api/tasks?status=active")
  })

  it("builds query string with priority filter", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list({ priority: "high" })
    expect(mockApi.get).toHaveBeenCalledWith("/api/tasks?priority=high")
  })

  it("builds query string with search", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list({ search: "hello world" })
    expect(mockApi.get).toHaveBeenCalledWith("/api/tasks?search=hello+world")
  })

  it("builds query string with date range", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list({ startDate: "2025-01-01", endDate: "2025-01-31" })
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/tasks?startDate=2025-01-01&endDate=2025-01-31",
    )
  })

  it("combines multiple filters", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list({ status: "active", priority: "high", search: "test" })
    expect(mockApi.get).toHaveBeenCalledWith(
      expect.stringContaining("status=active"),
    )
    expect(mockApi.get).toHaveBeenCalledWith(
      expect.stringContaining("priority=high"),
    )
    expect(mockApi.get).toHaveBeenCalledWith(
      expect.stringContaining("search=test"),
    )
  })

  it("omits 'all' status from query string", async () => {
    mockApi.get.mockResolvedValue([])
    await tasksApi.list({ status: "all" })
    expect(mockApi.get).toHaveBeenCalledWith("/api/tasks")
  })
})

describe("tasksApi.get", () => {
  it("fetches task by id", async () => {
    mockApi.get.mockResolvedValue({ id: "123", title: "Test" })
    const result = await tasksApi.get("123")
    expect(mockApi.get).toHaveBeenCalledWith("/api/tasks/123")
    expect(result).toEqual({ id: "123", title: "Test" })
  })
})

describe("tasksApi.create", () => {
  it("posts to /api/tasks", async () => {
    mockApi.post.mockResolvedValue({ id: "1" })
    const input = { title: "New task" }
    await tasksApi.create(input)
    expect(mockApi.post).toHaveBeenCalledWith("/api/tasks", input)
  })
})

describe("tasksApi.update", () => {
  it("patches task by id", async () => {
    mockApi.patch.mockResolvedValue({ id: "1" })
    const input = { title: "Updated" }
    await tasksApi.update("1", input)
    expect(mockApi.patch).toHaveBeenCalledWith("/api/tasks/1", input)
  })
})

describe("tasksApi.toggle", () => {
  it("patches task toggle endpoint", async () => {
    mockApi.patch.mockResolvedValue({ id: "1", completed: true })
    await tasksApi.toggle("1")
    expect(mockApi.patch).toHaveBeenCalledWith("/api/tasks/1/toggle")
  })
})

describe("tasksApi.remove", () => {
  it("deletes task by id", async () => {
    mockApi.delete.mockResolvedValue(undefined)
    await tasksApi.remove("1")
    expect(mockApi.delete).toHaveBeenCalledWith("/api/tasks/1")
  })
})

describe("tasksApi.carryForward", () => {
  it("posts to carryforward endpoint", async () => {
    mockApi.post.mockResolvedValue({ tasksCarriedForward: 3 })
    const result = await tasksApi.carryForward()
    expect(mockApi.post).toHaveBeenCalledWith("/api/tasks/carryforward")
    expect(result).toEqual({ tasksCarriedForward: 3 })
  })
})
