import 'server-only'
import { isDatabaseConfigured } from '@/lib/db'

export type CourseRow = {
  id: string
  code: string
  title: string
  term: string | null
  color: string | null
}

export type CourseDetail = CourseRow & {
  _count: { topics: number; notes: number }
}

export async function getCourses(): Promise<CourseRow[]> {
  if (!isDatabaseConfigured()) return []
  try {
    const { db } = await import('@/lib/db')
    return db.course.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, code: true, title: true, term: true, color: true },
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getCourses] DB error:', err)
    return []
  }
}

export async function getCourse(id: string): Promise<CourseDetail | null> {
  if (!isDatabaseConfigured()) return null
  try {
    const { db } = await import('@/lib/db')
    return db.course.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        title: true,
        term: true,
        color: true,
        _count: { select: { topics: true, notes: true } },
      },
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getCourse] DB error:', err)
    return null
  }
}
