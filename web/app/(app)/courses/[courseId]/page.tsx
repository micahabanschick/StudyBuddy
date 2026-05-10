import Link from 'next/link'
import { ArrowRight, BookOpenText, Calendar, Clock, FileText, Layers, MapPin, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getCourse } from '@/lib/data/courses'
import { getNotes } from '@/lib/data/notes'
import { getCourseSchedule, type SectionInfo } from '@/lib/data/schedule'
import { formatRelative } from '@/lib/utils'

type Props = { params: Promise<{ courseId: string }> }

function SectionBlock({ label, info }: { label: string; info: SectionInfo }) {
  if (!info.dates && !info.room) return null
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{label}</p>
      {info.dates && (
        <div className="flex items-start gap-2">
          <Calendar className="text-primary mt-0.5 size-3.5 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Dates</p>
            <p className="text-sm font-medium">{info.dates}</p>
          </div>
        </div>
      )}
      {(info.days || info.time) && (
        <div className="flex items-start gap-2">
          <Clock className="text-primary mt-0.5 size-3.5 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Time</p>
            {info.days && <p className="text-sm font-medium">{info.days}</p>}
            {info.time && <p className="text-muted-foreground text-xs">{info.time}</p>}
          </div>
        </div>
      )}
      {info.room && (
        <div className="flex items-start gap-2">
          <MapPin className="text-primary mt-0.5 size-3.5 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Room</p>
            <p className="text-sm font-medium">{info.room}</p>
          </div>
        </div>
      )}
      {info.instructor && (
        <div className="flex items-start gap-2">
          <User className="text-primary mt-0.5 size-3.5 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              {info.instructor.includes(',') ? 'Instructors' : 'Instructor'}
            </p>
            <p className="text-sm font-medium">{info.instructor}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default async function CourseOverviewPage({ params }: Props) {
  const { courseId } = await params
  const [course, notes, schedule] = await Promise.all([
    getCourse(courseId),
    getNotes(courseId),
    getCourseSchedule(courseId),
  ])
  if (!course) notFound()

  const recent = notes.filter((n) => n.title !== 'Course Overview & Schedule').slice(0, 5)
  const hasLecture = schedule && (schedule.lecture.dates || schedule.lecture.room)
  const hasLab = schedule && (schedule.lab.dates || schedule.lab.room)

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

      {(hasLecture || hasLab) && schedule && (
        <Card className="mb-5 border-primary/20 from-primary/5 to-primary/0 bg-gradient-to-br">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <Calendar className="text-primary size-4" /> Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid gap-5 sm:grid-cols-2">
              {hasLecture && <SectionBlock label="Lecture" info={schedule.lecture} />}
              {hasLecture && hasLab && (
                <Separator orientation="vertical" className="hidden h-auto self-stretch sm:block" />
              )}
              {hasLab && <SectionBlock label="Lab" info={schedule.lab} />}
            </div>
          </CardContent>
          <div className="border-t px-5 py-2.5">
            <Link
              href={`/courses/${courseId}/notes`}
              className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
            >
              View full course info & instructor details →
            </Link>
          </div>
        </Card>
      )}

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
