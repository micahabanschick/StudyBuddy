import 'server-only'

export type TopicRow = {
  id: string
  courseId: string
  parentId: string | null
  title: string
  position: number
}

export async function getTopics(courseId: string): Promise<TopicRow[]> {
  try {
    const { db } = await import('@/lib/db')
    return db.topic.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
      select: { id: true, courseId: true, parentId: true, title: true, position: true },
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getTopics]', err)
    return []
  }
}
