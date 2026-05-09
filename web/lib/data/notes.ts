import 'server-only'

export type NoteListItem = {
  id: string
  title: string
  topicId: string | null
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export type NoteRow = NoteListItem & {
  contentMd: string
}

export async function getNotes(courseId: string): Promise<NoteListItem[]> {
  try {
    const { db } = await import('@/lib/db')
    return db.note.findMany({
      where: { courseId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        topicId: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getNotes]', err)
    return []
  }
}

export async function getNote(id: string): Promise<NoteRow | null> {
  try {
    const { db } = await import('@/lib/db')
    return db.note.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        contentMd: true,
        topicId: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getNote]', err)
    return null
  }
}

export async function getNoteLinks(
  noteId: string,
): Promise<{ incoming: NoteListItem[]; outgoing: NoteListItem[] }> {
  try {
    const { db } = await import('@/lib/db')
    const [incoming, outgoing] = await Promise.all([
      db.note.findMany({
        where: { outgoingLinks: { some: { toNoteId: noteId } } },
        select: { id: true, title: true, topicId: true, courseId: true, createdAt: true, updatedAt: true },
      }),
      db.note.findMany({
        where: { incomingLinks: { some: { fromNoteId: noteId } } },
        select: { id: true, title: true, topicId: true, courseId: true, createdAt: true, updatedAt: true },
      }),
    ])
    return { incoming, outgoing }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getNoteLinks]', err)
    return { incoming: [], outgoing: [] }
  }
}

/**
 * Parses [[Note Title]] patterns from markdown, resolves to note IDs,
 * then replaces the outgoing NoteLink set for this note in a transaction.
 */
export async function syncNoteLinks(fromNoteId: string, contentMd: string): Promise<void> {
  try {
    const { db } = await import('@/lib/db')
    const pattern = /\[\[([^\]]+)\]\]/g
    const titles = [...contentMd.matchAll(pattern)].map((m) => m[1].trim())

    if (titles.length === 0) {
      await db.noteLink.deleteMany({ where: { fromNoteId } })
      return
    }

    const note = await db.note.findUnique({ where: { id: fromNoteId }, select: { courseId: true } })
    if (!note) return

    const targets = await db.note.findMany({
      where: { courseId: note.courseId, title: { in: titles } },
      select: { id: true },
    })
    const toNoteIds = targets.map((t) => t.id).filter((id) => id !== fromNoteId)

    await db.$transaction([
      db.noteLink.deleteMany({ where: { fromNoteId } }),
      ...toNoteIds.map((toNoteId) =>
        db.noteLink.upsert({
          where: { fromNoteId_toNoteId: { fromNoteId, toNoteId } },
          update: {},
          create: { fromNoteId, toNoteId },
        }),
      ),
    ])
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[syncNoteLinks]', err)
  }
}
