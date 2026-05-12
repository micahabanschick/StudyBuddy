import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Flame, FlaskConical, MessageSquare, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCourses } from '@/lib/data/courses'
import { getAllDueCards } from '@/lib/data/flashcards'
import { getStudyStats } from '@/lib/data/stats'
import { ActivityHeatmap } from '@/components/dashboard/activity-heatmap'

export const metadata: Metadata = { title: 'Dashboard' }

const OWNER_ID = process.env.OWNER_USER_ID ?? '00000000-0000-0000-0000-000000000000'

export default async function DashboardPage() {
  const [courses, dueByDeck, stats] = await Promise.all([
    getCourses(),
    getAllDueCards(OWNER_ID),
    getStudyStats(OWNER_ID),
  ])

  const totalDue = dueByDeck.reduce((s, d) => s + d.count, 0)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Welcome back
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {courses.length > 0 ? "Let's study." : 'Ready when you are.'}
          </h2>
        </div>
        {stats.streakDays > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
            <Flame className="size-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-500">
              {stats.streakDays} day{stats.streakDays === 1 ? '' : 's'} streak
            </span>
          </div>
        )}
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="border-primary/20 from-primary/5 to-primary/0 bg-gradient-to-br">
          <CardHeader className="pt-4 pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="text-primary size-4" /> Due today
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-3xl font-bold tabular-nums">{totalDue}</p>
            <p className="text-muted-foreground text-xs">flashcards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pt-4 pb-1">
            <CardTitle className="text-sm font-medium">Reviews today</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-3xl font-bold tabular-nums">{stats.reviewsToday}</p>
            <p className="text-muted-foreground text-xs">{stats.reviewsThisWeek} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pt-4 pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="size-4" /> Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-3xl font-bold tabular-nums">{courses.length}</p>
            <p className="text-muted-foreground text-xs">active this term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pt-4 pb-1">
            <CardTitle className="text-sm font-medium">Notes this week</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-3xl font-bold tabular-nums">{stats.notesThisWeek}</p>
            <p className="text-muted-foreground text-xs">created</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {totalDue > 0 && (
          <Button asChild size="sm">
            <Link href="/review">
              <Sparkles className="size-4" /> Review {totalDue} cards
            </Link>
          </Button>
        )}
        <Button asChild size="sm" variant="outline">
          <Link href="/courses">
            <BookOpen className="size-4" /> Courses
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/chat">
            <MessageSquare className="size-4" /> Chat
          </Link>
        </Button>
      </div>

      {courses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            Jump to course
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-card flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-muted-foreground font-mono text-xs">{c.code}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Link href={`/courses/${c.id}/notes`}>Notes</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Link href={`/courses/${c.id}/chat`}>Chat</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="h-7 w-7 px-0">
                    <Link href={`/courses/${c.id}/quizzes`}>
                      <FlaskConical className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.activityGrid.some((d) => d.count > 0) && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Review activity — past year</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap data={stats.activityGrid} />
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-muted-foreground text-xs">Less</span>
              {['bg-muted/60', 'bg-primary/30', 'bg-primary/60', 'bg-primary/80', 'bg-primary'].map(
                (c) => (
                  <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
                ),
              )}
              <span className="text-muted-foreground text-xs">More</span>
            </div>
          </CardContent>
        </Card>
      )}

      {courses.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Add your first course</CardTitle>
            <CardDescription>Create BIO 1107 or CHEM 1128Q to get started.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/courses">
                Go to Courses <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
