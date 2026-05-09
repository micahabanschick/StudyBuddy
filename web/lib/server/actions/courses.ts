'use server'
import 'server-only'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db, isDatabaseConfigured } from '@/lib/db'

const NO_DB = { error: 'Database not configured — add DATABASE_URL to web/.env.local first.' }

const CourseSchema = z.object({
  code: z.string().min(1, 'Course code is required').max(20),
  title: z.string().min(1, 'Title is required').max(120),
  term: z.string().max(40).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .optional(),
})

export async function createCourse(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!isDatabaseConfigured()) return NO_DB
  const raw = Object.fromEntries(formData)
  const parsed = CourseSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await db.course.create({
    data: {
      ...parsed.data,
      userId: '00000000-0000-0000-0000-000000000000',
    },
  })

  revalidatePath('/courses')
  return {}
}

export async function updateCourse(
  id: string,
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!isDatabaseConfigured()) return NO_DB
  const raw = Object.fromEntries(formData)
  const parsed = CourseSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await db.course.update({ where: { id }, data: parsed.data })

  revalidatePath('/courses')
  revalidatePath(`/courses/${id}`)
  return {}
}

export async function deleteCourse(id: string): Promise<void> {
  if (!isDatabaseConfigured()) return
  await db.course.delete({ where: { id } })
  revalidatePath('/courses')
  redirect('/courses')
}
