'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseForm } from '@/components/courses/course-form'

export function NewCourseButton() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> New course
      </Button>
      <CourseForm open={open} onOpenChange={setOpen} />
    </>
  )
}
