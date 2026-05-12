'use client'

import * as React from 'react'
import { ArrowUp, Bot, FileText, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { CourseDetail } from '@/lib/data/courses'
import type { NoteListItem } from '@/lib/data/notes'

type Message = { role: 'user' | 'assistant'; content: string; id: string }

type Props = {
  courseId: string
  course: CourseDetail
  notes: NoteListItem[]
}

export function CourseChat({ courseId, course, notes }: Props) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text, id: crypto.randomUUID() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setStreaming(true)

    const assistantId = crypto.randomUUID()
    setMessages((m) => [...m, { role: 'assistant', content: '', id: assistantId }])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          courseId,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, content: accumulated } : msg)),
        )
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to get response')
      setMessages((m) => m.filter((msg) => msg.id !== assistantId))
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col">
      {/* Header */}
      <div className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">{course.code} Chat</h2>
            <p className="text-muted-foreground text-xs">
              {notes.length > 0
                ? `${notes.length} note${notes.length === 1 ? '' : 's'} available as context`
                : 'Add notes to this course to get better answers'}
            </p>
          </div>
          {notes.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <FileText className="size-3" />
              {notes.length} notes
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="bg-primary/10 grid size-12 place-items-center rounded-full">
              <Bot className="text-primary size-6" />
            </div>
            <div>
              <p className="font-medium">Ask anything about {course.code}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                I&apos;ll answer using your notes as context.
                {notes.length === 0 && ' Add notes first for better answers.'}
              </p>
            </div>
            {notes.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  'Summarize my notes so far',
                  'What are the key concepts I should know?',
                  'Create a study outline',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="bg-muted hover:bg-muted/80 rounded-full px-3 py-1.5 text-xs transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full text-xs font-medium',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {msg.role === 'user' ? (
                    <User className="size-3.5" />
                  ) : (
                    <Bot className="size-3.5" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm',
                  )}
                >
                  {msg.content || (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin" />
                      Thinking…
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <div className="bg-background relative flex-1 rounded-xl border shadow-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="placeholder:text-muted-foreground block max-h-[200px] w-full resize-none bg-transparent px-4 py-3 text-sm outline-none"
              disabled={streaming}
            />
          </div>
          <Button
            size="icon"
            onClick={send}
            disabled={!input.trim() || streaming}
            className="h-11 w-11 shrink-0 rounded-xl"
          >
            {streaming ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
