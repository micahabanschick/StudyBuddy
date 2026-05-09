'use server'
import 'server-only'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db, isDatabaseConfigured } from '@/lib/db'
import { syncNoteLinks } from '@/lib/data/notes'

export async function createNote(courseId: string, topicId?: string): Promise<{ id: string }> {
  if (!isDatabaseConfigured()) return { id: '' }
  const note = await db.note.create({
    data: { courseId, topicId: topicId ?? null, title: 'Untitled note', contentMd: '' },
    select: { id: true },
  })
  revalidatePath(`/courses/${courseId}/notes`)
  return { id: note.id }
}

export async function updateNoteTitle(id: string, title: string, courseId: string): Promise<void> {
  if (!isDatabaseConfigured() || !title.trim()) return
  await db.note.update({ where: { id }, data: { title: title.trim() } })
  revalidatePath(`/courses/${courseId}/notes`)
}

export async function updateNoteContent(id: string, contentMd: string): Promise<void> {
  if (!isDatabaseConfigured()) return
  await db.note.update({ where: { id }, data: { contentMd } })
  await syncNoteLinks(id, contentMd)
}

export async function deleteNote(id: string, courseId: string): Promise<void> {
  if (!isDatabaseConfigured()) return
  await db.note.delete({ where: { id } })
  revalidatePath(`/courses/${courseId}/notes`)
  redirect(`/courses/${courseId}/notes`)
}
