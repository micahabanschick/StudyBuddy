import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/data/courses'
import { getNotes } from '@/lib/data/notes'
import { isDatabaseConfigured } from '@/lib/db'
import { QuizGenerator } from '@/components/quiz/quiz-generator'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

type Props = { params: Promise<{ courseId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return { title: course ? `Quizzes · ${course.code}` : 'Quizzes' }
}

export default async function QuizzesPage({ params }: Props) {
  const { courseId } = await params
  const course = await getCourse(courseId)
  if (!course) notFound()

  const notes = await getNotes(courseId)

  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Quizzes</h2>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" /> Ready — needs a database
            </CardTitle>
            <CardDescription>
              Connect Supabase to save quiz attempts. Quiz generation from your notes works
              immediately once you add your Anthropic API key.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return <QuizGenerator courseId={courseId} course={course} notes={notes} />
}
