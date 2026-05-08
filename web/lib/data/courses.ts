import 'server-only'

export type CourseRow = {
  id: string
  code: string
  title: string
  term: string | null
  color: string | null
}

export async function getCourses(): Promise<CourseRow[]> {
  try {
    const { db } = await import('@/lib/db')
    return db.course.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, code: true, title: true, term: true, color: true },
    })
  } catch {
    return []
  }
}
