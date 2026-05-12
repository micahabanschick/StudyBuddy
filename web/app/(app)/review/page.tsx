import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCourses } from '@/lib/data/courses'
import { getDecks } from '@/lib/data/flashcards'
import { isDatabaseConfigured } from '@/lib/db'

export const metadata: Metadata = { title: 'Review' }

export default async function ReviewPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Daily review</h2>
          <p className="text-muted-foreground text-sm">
            Spaced-repetition queue across all your courses, scheduled with FSRS.
          </p>
        </header>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" /> Ready — needs a database
            </CardTitle>
            <CardDescription>
              The FSRS review engine is wired up. Connect Supabase (see{' '}
              <code className="bg-muted rounded px-1 font-mono text-xs">FEATURE_BACKLOG.md</code>)
              then create flashcard decks from the AI panel inside any note.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const courses = await getCourses()
  const allDecks = (await Promise.all(courses.map((c) => getDecks(c.id)))).flat()

  const totalDue = allDecks.reduce((sum, d) => sum + d.dueCount, 0)
  const dueDecks = allDecks.filter((d) => d.dueCount > 0)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Daily review</h2>
          <p className="text-muted-foreground text-sm">FSRS-scheduled queue across all courses</p>
        </div>
        {totalDue > 0 && (
          <Badge className="px-3 py-1 text-sm">
            {totalDue} card{totalDue === 1 ? '' : 's'} due
          </Badge>
        )}
      </header>

      {dueDecks.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Due now
          </h3>
          {dueDecks.map((deck) => {
            const course = courses.find((c) => c.id === deck.courseId)
            return (
              <Link
                key={deck.id}
                href={`/review/${deck.id}`}
                className="hover:border-primary/50 hover:bg-accent/30 group flex items-center justify-between rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid size-8 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${course?.color ?? 'var(--primary)'}20` }}
                  >
                    <BookOpen
                      className="size-4"
                      style={{ color: course?.color ?? 'var(--primary)' }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{deck.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {course?.code} · {deck._count.cards} cards total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{deck.dueCount} due</Badge>
                  <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" /> All caught up!
            </CardTitle>
            <CardDescription>
              No cards are due right now. Create flashcards from the AI panel inside any note, then
              come back here when they&apos;re due.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {allDecks.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            All decks
          </h3>
          {allDecks.map((deck) => {
            const course = courses.find((c) => c.id === deck.courseId)
            return (
              <Link
                key={deck.id}
                href={`/review/${deck.id}`}
                className="hover:bg-accent/30 group flex items-center justify-between rounded-xl border px-4 py-3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: course?.color ?? 'var(--primary)' }}
                  />
                  <span className="text-sm font-medium">{deck.title}</span>
                  <span className="text-muted-foreground text-xs">· {course?.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">{deck._count.cards} cards</span>
                  {deck.dueCount > 0 && <Badge variant="default">{deck.dueCount}</Badge>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
