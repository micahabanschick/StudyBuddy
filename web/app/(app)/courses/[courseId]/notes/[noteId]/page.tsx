import { notFound } from 'next/navigation'
import { NoteEditor } from '@/components/editor/note-editor'
import { getNote } from '@/lib/data/notes'

type Props = { params: Promise<{ courseId: string; noteId: string }> }

export async function generateMetadata({ params }: Props) {
  const { noteId } = await params
  const note = await getNote(noteId)
  return { title: note?.title ?? 'Note' }
}

export default async function NotePage({ params }: Props) {
  const { courseId, noteId } = await params
  const note = await getNote(noteId)
  if (!note) notFound()

  return (
    <NoteEditor
      noteId={note.id}
      courseId={courseId}
      topicId={note.topicId}
      initialTitle={note.title}
      initialContent={note.contentMd}
    />
  )
}
