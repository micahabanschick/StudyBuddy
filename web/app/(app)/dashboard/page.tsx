import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, MessageSquare, Sparkles, FlaskConical } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCourses } from '@/lib/data/courses'
import { getAllDueCards } from '@/lib/data/flashcards'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [courses, dueByDeck] = await Promise.all([
    getCourses(),
    getAllDueCards(process.env.OWNER_USER_ID ?? '00000000-0000-0000-0000-000000000000'),
  ])

  const totalDue = dueByDeck.reduce((s, d) => s + d.count, 0)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Welcome back
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          {courses.length > 0 ? "Let's study." : 'Ready when you are.'}
        </h2>
      </header>

      {/* Stats row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/20 from-primary/5 to-primary/0 bg-gradient-to-br">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="text-primary size-4" /> Due today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">{totalDue}</p>
            <p className="text-muted-foreground text-xs">flashcards across all decks</p>
          </CardContent>
          {totalDue > 0 && (
            <CardFooter>
              <Button asChild size="sm" variant="outline">
                <Link href="/review">Start review <ArrowRight className="size-3.5" /></Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4" /> Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">{courses.length}</p>
            <p className="text-muted-foreground text-xs">active this term</p>
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" variant="outline">
              <Link href="/courses">View all <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="size-4" /> Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mt-1">
              Ask anything grounded in your notes. Claude answers with citations.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" variant="outline">
              <Link href="/chat">Open chat <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Course quick links */}
      {courses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
            Jump to course
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {courses.map((c) => {
              const due = dueByDeck.filter(/* placeholder — would need deck→course mapping */ () => false)
                .reduce((s, d) => s + d.count, 0)
              return (
                <div key={c.id} className="bg-card flex items-center gap-3 rounded-xl border px-4 py-3">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-muted-foreground font-mono text-xs">{c.code}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                      <Link href={`/courses/${c.id}/notes`}>Notes</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                      <Link href={`/courses/${c.id}/chat`}>Chat</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                      <Link href={`/courses/${c.id}/quizzes`}>
                        <FlaskConical className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {courses.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Add your first course</CardTitle>
            <CardDescription>
              Go to Courses and create BIO 1107 or CHEM 1128Q to get started.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/courses">Go to Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
