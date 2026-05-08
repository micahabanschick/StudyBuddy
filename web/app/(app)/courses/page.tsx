import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <Button disabled>
          <Plus className="size-4" /> New course
        </Button>
      </header>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No courses yet</CardTitle>
            <CardDescription>
              Course CRUD ships in Phase 1. The seed script is set up to add BIO 1107 and CHEM 1128Q
              once a database is connected — run{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">pnpm db:seed</code>{' '}
              after configuring Supabase.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <li key={c.id}>
              <Link
                href={`/courses/${c.id}`}
                className="hover:border-primary/50 hover:bg-accent/40 group block rounded-xl border p-4 transition-colors"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                  />
                  <span className="text-muted-foreground font-mono text-xs">{c.code}</span>
                  {c.term ? (
                    <span className="text-muted-foreground ml-auto text-xs">{c.term}</span>
                  ) : null}
                </div>
                <p className="font-medium tracking-tight group-hover:text-foreground">{c.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
