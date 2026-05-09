'use server'
import 'server-only'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function createTopic(
  courseId: string,
  title: string,
): Promise<{ id: string; error?: string }> {
  if (!title.trim()) return { id: '', error: 'Title is required' }

  const last = await db.topic.findFirst({
    where: { courseId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })

  const topic = await db.topic.create({
    data: { courseId, title: title.trim(), position: (last?.position ?? -1) + 1 },
    select: { id: true },
  })

  revalidatePath(`/courses/${courseId}`)
  return { id: topic.id }
}

export async function updateTopic(id: string, title: string, courseId: string): Promise<void> {
  if (!title.trim()) return
  await db.topic.update({ where: { id }, data: { title: title.trim() } })
  revalidatePath(`/courses/${courseId}`)
}

export async function deleteTopic(id: string, courseId: string): Promise<void> {
  await db.topic.delete({ where: { id } })
  revalidatePath(`/courses/${courseId}`)
}
