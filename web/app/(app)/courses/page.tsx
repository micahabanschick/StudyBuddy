import type { Metadata } from 'next'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseCard } from '@/components/courses/course-card'
import { NewCourseButton } from '@/components/courses/new-course-button'
import { getCourses } from '@/lib/data/courses'

export const metadata: Metadata = { title: 'Courses' }

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Courses</h2>
          <p className="text-muted-foreground text-sm">
            One workspace per course. Notes, PDFs, decks, and quizzes live here.
          </p>
        </div>
        <NewCourseButton />
      </header>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No courses yet</CardTitle>
            <CardDescription>
              Click <strong>New course</strong> to add BIO 1107, CHEM 1128Q, or any other course.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <li key={c.id}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
