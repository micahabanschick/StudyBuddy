'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createNote, deleteNote } from '@/lib/server/actions/notes'
import { formatRelative } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { NoteListItem } from '@/lib/data/notes'

type Props = {
  courseId: string
  notes: NoteListItem[]
  activeTopic: string | null
  loading?: boolean
}

export function NoteList({ courseId, notes, activeTopic, loading }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [creating, setCreating] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const filtered = notes
    .filter((n) => !activeTopic || n.topicId === activeTopic)
    .filter((n) => !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreate = async () => {
    setCreating(true)
    const { id } = await createNote(courseId, activeTopic ?? undefined)
    router.push(`/courses/${courseId}/notes/${id}`)
    setCreating(false)
  }

  return (
    <div className="flex h-full flex-col border-r">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Input
          placeholder="Search notes…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-7 text-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleCreate}
          disabled={creating}
          aria-label="New note"
        >
          {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex flex-col gap-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center text-sm">
            <FileText className="size-8 opacity-40" />
            <p>{searchQuery ? 'No matching notes' : 'No notes yet'}</p>
            {!searchQuery && (
              <Button variant="outline" size="sm" onClick={handleCreate} disabled={creating}>
                {creating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                New note
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 p-2">
            {filtered.map((note) => {
              const href = `/courses/${courseId}/notes/${note.id}`
              const active = pathname === href
              return (
                <NoteListRow
                  key={note.id}
                  note={note}
                  href={href}
                  active={active}
                  courseId={courseId}
                />
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

function NoteListRow({
  note,
  href,
  active,
  courseId,
}: {
  note: NoteListItem
  href: string
  active: boolean
  courseId: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setDeleting(true)
    await deleteNote(note.id, courseId)
    // action redirects if deleting active note; otherwise refresh
    router.refresh()
    setDeleting(false)
  }

  return (
    <div className="group relative">
      <Link
        href={href}
        className={cn(
          'block rounded-md px-2 py-2 transition-colors',
          active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60',
        )}
      >
        <p className="truncate text-sm font-medium">{note.title}</p>
        <p className="text-muted-foreground text-xs">{formatRelative(note.updatedAt)}</p>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete note"
      >
        {deleting ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Trash2 className="text-destructive size-3" />
        )}
      </Button>
    </div>
  )
}
