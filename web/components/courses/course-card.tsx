'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CourseForm } from '@/components/courses/course-form'
import { DeleteCourseDialog } from '@/components/courses/delete-course-dialog'

type Course = { id: string; code: string; title: string; term: string | null; color: string | null }

export function CourseCard({ course }: { course: Course }) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  return (
    <>
      <div className="hover:border-primary/50 group relative rounded-xl border transition-colors">
        <Link
          href={`/courses/${course.id}`}
          className="hover:bg-accent/40 block p-4 transition-colors"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: course.color ?? 'var(--primary)' }}
            />
            <span className="text-muted-foreground font-mono text-xs">{course.code}</span>
            {course.term && (
              <span className="text-muted-foreground ml-auto text-xs">{course.term}</span>
            )}
          </div>
          <p className="font-medium tracking-tight">{course.title}</p>
        </Link>

        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CourseForm open={editOpen} onOpenChange={setEditOpen} course={course} />
      <DeleteCourseDialog open={deleteOpen} onOpenChange={setDeleteOpen} course={course} />
    </>
  )
}
