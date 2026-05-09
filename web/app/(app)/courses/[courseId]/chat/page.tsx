import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/data/courses'
import { getNotes } from '@/lib/data/notes'
import { CourseChat } from '@/components/chat/course-chat'

type Props = { params: Promise<{ courseId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return { title: course ? `Chat · ${course.code}` : 'Chat' }
}

export default async function CourseChatPage({ params }: Props) {
  const { courseId } = await params
  const [course, notes] = await Promise.all([getCourse(courseId), getNotes(courseId)])
  if (!course) notFound()

  return <CourseChat courseId={courseId} course={course} notes={notes} />
}
