import { notFound } from 'next/navigation'
import { CourseShell } from '@/components/courses/course-shell'
import { getCourse } from '@/lib/data/courses'
import { getTopics } from '@/lib/data/topics'
import { getNotes } from '@/lib/data/notes'

type Props = {
  children: React.ReactNode
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return { title: course ? `${course.code} · ${course.title}` : 'Course' }
}

export default async function CourseLayout({ children, params }: Props) {
  const { courseId } = await params
  const [course, topics, notes] = await Promise.all([
    getCourse(courseId),
    getTopics(courseId),
    getNotes(courseId),
  ])

  if (!course) notFound()

  return (
    <CourseShell course={course} topics={topics} notes={notes} courseId={courseId}>
      {children}
    </CourseShell>
  )
}
