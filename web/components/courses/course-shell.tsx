'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TopicTree } from '@/components/courses/topic-tree'
import { NoteList } from '@/components/courses/note-list'
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

export function CourseShell({ courseId, course, topics, notes, children }: Props) {
  const [activeTopic, setActiveTopic] = React.useState<string | null>(null)
  const pathname = usePathname()

  return (
    <div className="flex h-[calc(100svh-3.5rem)] min-h-0">
      {/* Left: topic tree (200px) */}
      <aside className="hidden w-48 shrink-0 flex-col border-r pt-4 md:flex">
        <div className="px-3 pb-2">
          <p className="truncate text-sm font-semibold">{course.code}</p>
          <p className="text-muted-foreground truncate text-xs">{course.title}</p>
        </div>
        <ScrollArea className="flex-1 px-2">
          <TopicTree
            courseId={courseId}
            topics={topics}
            activeTopic={activeTopic}
            onTopicSelect={setActiveTopic}
          />
        </ScrollArea>
      </aside>

      {/* Centre: notes list (240px) */}
      <div className="hidden w-60 shrink-0 md:flex md:flex-col">
        <NoteList courseId={courseId} notes={notes} activeTopic={activeTopic} />
      </div>

      {/* Right: main content with subtle enter animation */}
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
  )
}
