'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { BookOpen, FileText, FlaskConical, Library, MessageSquare, Sparkles } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TopicTree } from '@/components/courses/topic-tree'
import { NoteList } from '@/components/courses/note-list'
import { cn } from '@/lib/utils'
import type { CourseDetail } from '@/lib/data/courses'
import type { TopicRow } from '@/lib/data/topics'
import type { NoteListItem } from '@/lib/data/notes'

type Props = {
  courseId: string
  course: CourseDetail
  topics: TopicRow[]
  notes: NoteListItem[]
  children: React.ReactNode
}

const COURSE_TABS = [
  { label: 'Overview', href: (id: string) => `/courses/${id}`, icon: BookOpen, exact: true },
  { label: 'Notes', href: (id: string) => `/courses/${id}/notes`, icon: FileText, exact: false },
  {
    label: 'Flashcards',
    href: (id: string) => `/courses/${id}/flashcards`,
    icon: Sparkles,
    exact: false,
  },
  {
    label: 'Quizzes',
    href: (id: string) => `/courses/${id}/quizzes`,
    icon: FlaskConical,
    exact: false,
  },
  { label: 'Library', href: (id: string) => `/courses/${id}/library`, icon: Library, exact: false },
  { label: 'Chat', href: (id: string) => `/courses/${id}/chat`, icon: MessageSquare, exact: false },
]

export function CourseShell({ courseId, course, topics, notes, children }: Props) {
  const [activeTopic, setActiveTopic] = React.useState<string | null>(null)
  const pathname = usePathname()

  const isNotesView =
    pathname.includes('/notes') && !pathname.includes('/library') && !pathname.includes('/chat')

  return (
    <div className="flex h-[calc(100svh-3.5rem)] min-h-0 flex-col">
      {/* Course tab bar */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b px-4">
        <span className="text-muted-foreground mr-2 font-mono text-xs font-medium">
          {course.code}
        </span>
        {COURSE_TABS.map((tab) => {
          const href = tab.href(courseId)
          const active = tab.exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left: topic tree — only visible on notes view */}
        {isNotesView && (
          <aside className="hidden w-44 shrink-0 flex-col border-r pt-3 md:flex">
            <ScrollArea className="flex-1 px-2">
              <TopicTree
                courseId={courseId}
                topics={topics}
                activeTopic={activeTopic}
                onTopicSelect={setActiveTopic}
              />
            </ScrollArea>
          </aside>
        )}

        {/* Centre: notes list — only visible on notes view */}
        {isNotesView && (
          <div className="hidden w-56 shrink-0 border-r md:flex md:flex-col">
            <NoteList courseId={courseId} notes={notes} activeTopic={activeTopic} />
          </div>
        )}

        {/* Main content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex min-w-0 flex-1 flex-col overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
