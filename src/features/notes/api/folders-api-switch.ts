import { foldersApi } from "./folders"
import { mockFoldersApi } from "./mock-folders"

export const activeFoldersApi =
  import.meta.env.VITE_USE_MOCK === "true" ? mockFoldersApi : foldersApi
