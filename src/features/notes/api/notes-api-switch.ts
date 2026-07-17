import { notesApi } from "./notes"
import { mockNotesApi } from "./mock-notes"

export const activeNotesApi =
  import.meta.env.VITE_USE_MOCK === "true" ? mockNotesApi : notesApi
