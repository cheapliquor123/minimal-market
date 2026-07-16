const API_BASE_URL = import.meta.env.VITE_API_URL ?? ""

interface ApiResponse<T> {
  data: T
  error?: string
}

interface ApiError {
  message: string
  status: number
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error: ApiError = {
      message: `API error: ${response.statusText}`,
      status: response.status,
    }

    try {
      const body = await response.json()
      error.message = body.error ?? body.message ?? error.message
    } catch {
      // response body wasn't JSON
    }

    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  const result: ApiResponse<T> = await response.json()
  return result.data ?? (result as unknown as T)
}

export const api = {
  get: <T,>(endpoint: string) => request<T>(endpoint),

  post: <T,>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T,>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T,>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T,>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
}

export type { ApiResponse, ApiError }
