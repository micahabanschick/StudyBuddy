import Link from 'next/link'
import { ArrowRight, BookOpenText, FileText, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCourse } from '@/lib/data/courses'
import { getNotes } from '@/lib/data/notes'
import { notFound } from 'next/navigation'
import { formatRelative } from '@/lib/utils'

type Props = { params: Promise<{ courseId: string }> }

export default async function CourseOverviewPage({ params }: Props) {
  const { courseId } = await params
  const [course, notes] = await Promise.all([getCourse(courseId), getNotes(courseId)])
  if (!course) notFound()

  const recent = notes.slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            {course.code} · {course.term ?? ''}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">{course.title}</h2>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/courses/${courseId}/notes`}>
            Open notes <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
              <FileText className="size-3.5" /> Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">{course._count.notes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
              <Layers className="size-3.5" /> Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">{course._count.topics}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
              <BookOpenText className="size-3.5" /> Decks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">0</p>
          </CardContent>
        </Card>
      </div>

      {recent.length > 0 && (
        <div className="mt-8">
          <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
            Recent notes
          </h3>
          <div className="flex flex-col gap-1">
            {recent.map((n) => (
              <Link
                key={n.id}
                href={`/courses/${courseId}/notes/${n.id}`}
                className="hover:bg-accent flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors"
              >
                <span className="font-medium">{n.title}</span>
                <span className="text-muted-foreground text-xs">{formatRelative(n.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
