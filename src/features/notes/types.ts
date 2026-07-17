export interface Folder {
  id: string
  name: string
  color: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateFolderInput {
  name: string
  color?: string | null
}

export interface UpdateFolderInput {
  name?: string
  color?: string | null
  order?: number
}

export interface Note {
  id: string
  title: string
  content: string
  color: string | null
  pinned: boolean
  folderId: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateNoteInput {
  title: string
  content?: string
  color?: string | null
  pinned?: boolean
  folderId?: string | null
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  color?: string | null
  pinned?: boolean
  folderId?: string | null
  order?: number
}
