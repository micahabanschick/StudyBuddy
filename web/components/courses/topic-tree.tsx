'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Plus, Tag, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { createTopic, deleteTopic, updateTopic } from '@/lib/server/actions/topics'
import { cn } from '@/lib/utils'
import type { TopicRow } from '@/lib/data/topics'

type Props = {
  courseId: string
  topics: TopicRow[]
  activeTopic?: string | null
  onTopicSelect: (id: string | null) => void
}

export function TopicTree({ courseId, topics, activeTopic, onTopicSelect }: Props) {
  const router = useRouter()
  const [adding, setAdding] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [pending, setPending] = React.useState(false)

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setPending(true)
    await createTopic(courseId, newTitle.trim())
    setNewTitle('')
    setAdding(false)
    setPending(false)
    router.refresh()
  }

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null)
      return
    }
    setPending(true)
    await updateTopic(id, editTitle.trim(), courseId)
    setEditingId(null)
    setPending(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    setPending(true)
    await deleteTopic(id, courseId)
    if (activeTopic === id) onTopicSelect(null)
    setPending(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between px-2 pb-1">
        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Topics
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setAdding(true)}
          aria-label="Add topic"
        >
          <Plus className="size-3" />
        </Button>
      </div>

      <button
        onClick={() => onTopicSelect(null)}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
          !activeTopic
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
        )}
      >
        <Tag className="size-3.5" /> All notes
      </button>

      {topics.map((t) =>
        editingId === t.id ? (
          <div key={t.id} className="flex items-center gap-1 px-1">
            <Input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(t.id)
                if (e.key === 'Escape') setEditingId(null)
              }}
              className="h-7 text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => handleRename(t.id)}
              disabled={pending}
            >
              {pending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => setEditingId(null)}
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <div key={t.id} className="group flex items-center">
            <button
              onClick={() => onTopicSelect(t.id)}
              onDoubleClick={() => {
                setEditingId(t.id)
                setEditTitle(t.title)
              }}
              className={cn(
                'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                activeTopic === t.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              <span className="truncate">{t.title}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleDelete(t.id)}
              disabled={pending}
              aria-label="Delete topic"
            >
              <Trash2 className="text-destructive size-3" />
            </Button>
          </div>
        ),
      )}

      {adding && (
        <div className="flex items-center gap-1 px-1">
          <Input
            autoFocus
            placeholder="Topic name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') {
                setAdding(false)
                setNewTitle('')
              }
            }}
            className="h-7 text-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={handleCreate}
            disabled={pending}
          >
            {pending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => {
              setAdding(false)
              setNewTitle('')
            }}
          >
            <X className="size-3" />
          </Button>
        </div>
      )}

      <Separator className="mt-2" />
    </div>
  )
}
