import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpenText, GraduationCap, MessageSquare, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-1">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Welcome back
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">Ready to study?</h2>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Phase 0 scaffolding is in place. Once Supabase is wired up, your dashboard will surface
          due reviews, recent notes, and course progress here.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="from-primary/5 to-primary/0 border-primary/20 bg-gradient-to-br">
          <CardHeader>
            <Badge variant="default" className="self-start">
              Today
            </Badge>
            <CardTitle className="mt-1 flex items-center gap-2">
              <Sparkles className="size-4" /> Daily review
            </CardTitle>
            <CardDescription>Your spaced-repetition queue across all courses.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">0</p>
            <p className="text-muted-foreground text-xs">
              cards due — start adding flashcards in Phase 3
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/review">
                Start review <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4" /> Courses
            </CardTitle>
            <CardDescription>BIO 1107 and CHEM 1128Q for the summer.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Add a course from the Courses page</li>
              <li>• Upload PDFs and lecture slides per course</li>
              <li>• Take notes that link across topics</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/courses">
                Manage courses <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" /> Ask anything
            </CardTitle>
            <CardDescription>RAG chat over your own course materials.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              In Phase 2, upload a PDF to a course and chat with it. Citations are included.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href="/chat">
                Open chat <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenText className="size-4" /> Roadmap
          </CardTitle>
          <CardDescription>What ships next, in order.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="text-sm">
            {[
              {
                phase: 'Phase 1',
                body: 'Courses + Markdown notes (KaTeX + RDKit chem)',
                done: false,
              },
              {
                phase: 'Phase 2',
                body: 'PDF upload + course-scoped RAG chat with citations',
                done: false,
              },
              { phase: 'Phase 3', body: 'Flashcards with FSRS scheduling', done: false },
              {
                phase: 'Phase 4',
                body: 'AI quiz generator (MCQ + free-response)',
                done: false,
              },
              {
                phase: 'Phase 5',
                body: 'Dashboard polish: streaks, mastery heatmap',
                done: false,
              },
            ].map((row) => (
              <li
                key={row.phase}
                className="hover:bg-muted/40 grid grid-cols-[100px_1fr] items-center gap-3 rounded-md px-2 py-2 transition-colors"
              >
                <span className="text-muted-foreground font-mono text-xs uppercase">
                  {row.phase}
                </span>
                <span>{row.body}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
