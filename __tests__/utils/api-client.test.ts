import { api, setAuthTokenGetter } from "@/shared/lib/api"

const mockFetch = jest.fn()
global.fetch = mockFetch

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: new Headers({ "content-type": "application/json" }),
    json: jest.fn().mockResolvedValue({ data }),
  }
}

function errorResponse(status: number, body?: Record<string, unknown>) {
  return {
    ok: false,
    status,
    statusText: "Error",
    headers: new Headers({ "content-type": "application/json" }),
    json: jest.fn().mockResolvedValue(body ?? { error: "Something went wrong" }),
  }
}

function noContentResponse() {
  return {
    ok: true,
    status: 204,
    statusText: "No Content",
    headers: new Headers(),
    json: jest.fn(),
  }
}

beforeEach(() => {
  mockFetch.mockReset()
  setAuthTokenGetter(() => Promise.resolve(null))
})

describe("api.get", () => {
  it("calls fetch with correct URL and GET method", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [] }))
    const result = await api.get("/api/test")
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({ headers: expect.any(Object) }),
    )
    expect(result).toEqual({ items: [] })
  })

  it("includes Content-Type header", async () => {
    mockFetch.mockResolvedValue(jsonResponse("ok"))
    await api.get("/api/test")
    const callHeaders = mockFetch.mock.calls[0][1].headers
    expect(callHeaders["Content-Type"]).toBe("application/json")
  })
})

describe("api.post", () => {
  it("sends POST with JSON body", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 1 }))
    await api.post("/api/items", { name: "test" })
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/items",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      }),
    )
  })

  it("works without body", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null))
    await api.post("/api/action")
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/action",
      expect.objectContaining({ body: undefined }),
    )
  })
})

describe("api.put", () => {
  it("sends PUT with JSON body", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 1 }))
    await api.put("/api/items/1", { name: "updated" })
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/items/1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ name: "updated" }),
      }),
    )
  })
})

describe("api.patch", () => {
  it("sends PATCH with JSON body", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 1 }))
    await api.patch("/api/items/1", { name: "patched" })
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/items/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ name: "patched" }),
      }),
    )
  })
})

describe("api.delete", () => {
  it("sends DELETE request", async () => {
    mockFetch.mockResolvedValue(noContentResponse())
    await api.delete("/api/items/1")
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/items/1",
      expect.objectContaining({ method: "DELETE" }),
    )
  })
})

describe("auth token", () => {
  it("includes Authorization header when token is available", async () => {
    setAuthTokenGetter(() => Promise.resolve("my-token"))
    mockFetch.mockResolvedValue(jsonResponse("ok"))
    await api.get("/api/secure")
    const callHeaders = mockFetch.mock.calls[0][1].headers
    expect(callHeaders["Authorization"]).toBe("Bearer my-token")
  })

  it("does not include Authorization header when token is null", async () => {
    mockFetch.mockResolvedValue(jsonResponse("ok"))
    await api.get("/api/public")
    const callHeaders = mockFetch.mock.calls[0][1].headers
    expect(callHeaders["Authorization"]).toBeUndefined()
  })
})

describe("error handling", () => {
  it("throws error with status and message on non-ok response", async () => {
    mockFetch.mockResolvedValue(errorResponse(404, { error: "Not found" }))
    await expect(api.get("/api/missing")).rejects.toMatchObject({
      message: "Not found",
      status: 404,
    })
  })

  it("falls back to statusText when response body is not JSON", async () => {
    const response = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: new Headers(),
      json: jest.fn().mockRejectedValue(new Error("Not JSON")),
    }
    mockFetch.mockResolvedValue(response)
    await expect(api.get("/api/error")).rejects.toMatchObject({
      message: "API error: Internal Server Error",
      status: 500,
    })
  })

  it("uses message field from body if error field is absent", async () => {
    mockFetch.mockResolvedValue(errorResponse(400, { message: "Bad request" }))
    await expect(api.get("/api/bad")).rejects.toMatchObject({
      message: "Bad request",
      status: 400,
    })
  })
})

describe("204 No Content", () => {
  it("returns undefined without parsing JSON", async () => {
    mockFetch.mockResolvedValue(noContentResponse())
    const result = await api.delete("/api/items/1")
    expect(result).toBeUndefined()
  })
})
