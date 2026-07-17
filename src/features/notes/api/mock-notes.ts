import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
} from "../types"

const STORAGE_KEY = "mock_notes"

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function now(): string {
  return new Date().toISOString()
}

export const mockNotesApi = {
  async list(folderId?: string | null, search?: string): Promise<Note[]> {
    const notes = loadNotes()
    const targetFolderId = folderId ?? null
    let result = notes.filter(
      (n) => (n.folderId ?? null) === targetFolderId,
    )
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      )
    }
    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (a.order !== b.order) return a.order - b.order
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  },

  async get(id: string): Promise<Note> {
    const notes = loadNotes()
    const note = notes.find((n) => n.id === id)
    if (!note) throw { message: "Note not found", status: 404 }
    return note
  },

  async create(input: CreateNoteInput): Promise<Note> {
    const notes = loadNotes()
    const ts = now()
    const targetFolderId = input.folderId ?? null
    const folderNotes = notes.filter(
      (n) => (n.folderId ?? null) === targetFolderId,
    )
    const maxOrder = folderNotes.reduce((max, n) => Math.max(max, n.order), -1)
    const note: Note = {
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content ?? "",
      color: input.color ?? null,
      pinned: input.pinned ?? false,
      folderId: targetFolderId,
      order: maxOrder + 1,
      createdAt: ts,
      updatedAt: ts,
    }
    notes.push(note)
    saveNotes(notes)
    return note
  },

  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const notes = loadNotes()
    const idx = notes.findIndex((n) => n.id === id)
    if (idx === -1) throw { message: "Note not found", status: 404 }

    const existing = notes[idx]
    const updated: Note = {
      ...existing,
      ...input,
      updatedAt: now(),
    }
    notes[idx] = updated
    saveNotes(notes)
    return updated
  },

  async remove(id: string): Promise<void> {
    const notes = loadNotes()
    const filtered = notes.filter((n) => n.id !== id)
    saveNotes(filtered)
  },
}
