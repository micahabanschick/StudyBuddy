import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/data/courses'
import { DocumentLibrary } from '@/components/library/document-library'
import { isDatabaseConfigured } from '@/lib/db'
import { db } from '@/lib/db'

type Props = { params: Promise<{ courseId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return { title: course ? `Library · ${course.code}` : 'Library' }
}

async function getDocuments(courseId: string) {
  if (!isDatabaseConfigured()) return []
  try {
    return db.document.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, pageCount: true, createdAt: true },
    })
  } catch {
    return []
  }
}

export default async function LibraryPage({ params }: Props) {
  const { courseId } = await params
  const [course, documents] = await Promise.all([getCourse(courseId), getDocuments(courseId)])
  if (!course) notFound()

  return <DocumentLibrary courseId={courseId} course={course} documents={documents} />
}
