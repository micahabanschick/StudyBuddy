import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCourses } from '@/lib/data/courses'

export const metadata: Metadata = { title: 'Chat' }

export default async function ChatPage() {
  const courses = await getCourses()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Chat</h2>
        <p className="text-muted-foreground text-sm">
          Ask questions grounded in your course notes and materials.
        </p>
      </header>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" /> No courses yet
            </CardTitle>
            <CardDescription>
              Create a course first, then use the Chat tab inside the course to ask questions.
              Each course has its own AI chat grounded in your notes.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">Select a course to start chatting:</p>
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}/chat`}
              className="hover:border-primary/50 hover:bg-accent/40 group flex items-center justify-between rounded-xl border p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                />
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-muted-foreground font-mono text-xs">{c.code}</p>
                </div>
              </div>
              <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
