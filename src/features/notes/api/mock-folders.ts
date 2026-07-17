import type {
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
} from "../types"

const STORAGE_KEY = "mock_folders"

function loadFolders(): Folder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFolders(folders: Folder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders))
}

function now(): string {
  return new Date().toISOString()
}

export const mockFoldersApi = {
  async list(): Promise<Folder[]> {
    const folders = loadFolders()
    return folders.sort((a, b) => a.order - b.order)
  },

  async get(id: string): Promise<Folder> {
    const folders = loadFolders()
    const folder = folders.find((f) => f.id === id)
    if (!folder) throw { message: "Folder not found", status: 404 }
    return folder
  },

  async create(input: CreateFolderInput): Promise<Folder> {
    const folders = loadFolders()
    const ts = now()
    const maxOrder = folders.reduce((max, f) => Math.max(max, f.order), -1)
    const folder: Folder = {
      id: crypto.randomUUID(),
      name: input.name,
      color: input.color ?? null,
      order: maxOrder + 1,
      createdAt: ts,
      updatedAt: ts,
    }
    folders.push(folder)
    saveFolders(folders)
    return folder
  },

  async update(id: string, input: UpdateFolderInput): Promise<Folder> {
    const folders = loadFolders()
    const idx = folders.findIndex((f) => f.id === id)
    if (idx === -1) throw { message: "Folder not found", status: 404 }

    const existing = folders[idx]
    const updated: Folder = {
      ...existing,
      ...input,
      updatedAt: now(),
    }
    folders[idx] = updated
    saveFolders(folders)
    return updated
  },

  async remove(id: string): Promise<void> {
    const folders = loadFolders()
    const filtered = folders.filter((f) => f.id !== id)
    saveFolders(filtered)
  },
}
