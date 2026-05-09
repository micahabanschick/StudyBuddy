import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Plus, Sparkles } from 'lucide-react'
import { getCourse } from '@/lib/data/courses'
import { getDecks } from '@/lib/data/flashcards'
import { isDatabaseConfigured } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = { params: Promise<{ courseId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return { title: course ? `Flashcards · ${course.code}` : 'Flashcards' }
}

export default async function FlashcardsPage({ params }: Props) {
  const { courseId } = await params
  const course = await getCourse(courseId)
  if (!course) notFound()

  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Flashcards</h2>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" /> Ready — needs a database
            </CardTitle>
            <CardDescription>
              Connect Supabase to create and review flashcards. Generate them instantly from any
              note using the AI panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const decks = await getDecks(courseId)
  const totalDue = decks.reduce((s, d) => s + d.dueCount, 0)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Flashcards</h2>
          <p className="text-muted-foreground text-sm">
            {totalDue > 0 ? `${totalDue} cards due for review` : 'All caught up!'}
          </p>
        </div>
      </header>

      {decks.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-4" /> No decks yet
            </CardTitle>
            <CardDescription>
              Open any note, click the <strong>AI</strong> button, and use{' '}
              <strong>Generate flashcards</strong> to create your first deck automatically.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/review/${deck.id}`}
              className="hover:border-primary/50 hover:bg-accent/30 group flex items-center justify-between rounded-xl border p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 grid size-9 shrink-0 place-items-center rounded-lg">
                  <BookOpen className="text-primary size-4" />
                </div>
                <div>
                  <p className="font-medium">{deck.title}</p>
                  <p className="text-muted-foreground text-xs">{deck._count.cards} cards</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {deck.dueCount > 0 && <Badge>{deck.dueCount} due</Badge>}
                <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
