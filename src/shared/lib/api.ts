const API_BASE_URL = import.meta.env.VITE_API_URL ?? ""

let authTokenGetter: (() => Promise<string | null>) | null = null

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  authTokenGetter = getter
}

interface ApiResponse<T> {
  data: T
  error?: string
}

interface ApiError {
  message: string
  status: number
}

interface RequestOptions extends RequestInit {
  signal?: AbortSignal
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const token = await authTokenGetter?.()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const { signal, ...rest } = options
  const config: RequestInit = {
    ...rest,
    headers,
    signal,
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
  get: <T,>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { signal }),

  post: <T,>(endpoint: string, data?: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      signal,
    }),

  put: <T,>(endpoint: string, data: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      signal,
    }),

  patch: <T,>(endpoint: string, data?: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      signal,
    }),

  delete: <T,>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: "DELETE", signal }),
}

export type { ApiResponse, ApiError }
