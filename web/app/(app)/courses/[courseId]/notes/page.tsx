import { redirect } from 'next/navigation'
import { getNotes } from '@/lib/data/notes'

type Props = { params: Promise<{ courseId: string }> }

export default async function NotesIndexPage({ params }: Props) {
  const { courseId } = await params
  const notes = await getNotes(courseId)

  // Redirect to the most recently updated note, or to the course overview
  if (notes.length > 0) {
    redirect(`/courses/${courseId}/notes/${notes[0].id}`)
  }
  redirect(`/courses/${courseId}`)
}
