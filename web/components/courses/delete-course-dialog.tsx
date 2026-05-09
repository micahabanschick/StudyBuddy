'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { deleteCourse } from '@/lib/server/actions/courses'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  course: { id: string; title: string }
}

export function DeleteCourseDialog({ open, onOpenChange, course }: Props) {
  const [pending, setPending] = React.useState(false)

  const handleDelete = async () => {
    setPending(true)
    await deleteCourse(course.id)
    // deleteCourse redirects, so no need to close the dialog
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete course?</DialogTitle>
          <DialogDescription>
            <strong>{course.title}</strong> and all its notes, topics, decks, and quizzes will be
            permanently deleted. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Delete forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
