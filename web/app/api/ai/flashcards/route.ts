import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { getNote } from '@/lib/data/notes'
import { aiFetch } from '@/lib/ai/client'

export async function POST(req: NextRequest) {
  const { noteId, count = 10 } = (await req.json()) as { noteId: string; count?: number }
  const note = await getNote(noteId)
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })

  const result = await aiFetch('/flashcards/generate', {
    method: 'POST',
    body: JSON.stringify({ note_content: note.contentMd, note_title: note.title, count }),
  })

  return NextResponse.json(result)
}
