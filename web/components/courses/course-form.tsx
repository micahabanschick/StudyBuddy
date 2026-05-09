'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { createCourse, updateCourse } from '@/lib/server/actions/courses'
import { cn } from '@/lib/utils'

const PALETTE = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#0ea5e9', // sky
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
]

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  course?: { id: string; code: string; title: string; term?: string | null; color?: string | null }
}

export function CourseForm({ open, onOpenChange, course }: Props) {
  const isEdit = !!course
  const [color, setColor] = React.useState(course?.color ?? PALETTE[4])

  const action = isEdit
    ? updateCourse.bind(null, course.id)
    : createCourse

  const [state, dispatch, pending] = useActionState(action, null)

  React.useEffect(() => {
    if (state && !state.error) onOpenChange(false)
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit course' : 'New course'}</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="flex flex-col gap-4">
          <input type="hidden" name="color" value={color} />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">Course code</Label>
              <Input
                id="code"
                name="code"
                placeholder="BIO 1107"
                defaultValue={course?.code}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="term">Term</Label>
              <Input
                id="term"
                name="term"
                placeholder="Summer 2026"
                defaultValue={course?.term ?? ''}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Principles of Biology I"
              defaultValue={course?.title}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <div className="flex gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'size-6 rounded-full border-2 transition-transform hover:scale-110',
                    color === c ? 'border-foreground scale-110' : 'border-transparent',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Create course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
