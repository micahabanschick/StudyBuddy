'use client'

import * as React from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { saveFlashcards } from '@/lib/server/actions/flashcards'
import { cn } from '@/lib/utils'

type FlashcardItem = { front: string; back: string }

type Props = {
  open: boolean
  onClose: () => void
  noteId: string
  courseId: string
  topicId?: string | null
  noteTitle: string
  selectedText?: string
}

export function AiPanel({ open, onClose, noteId, courseId, topicId, noteTitle, selectedText }: Props) {
  const [summary, setSummary] = React.useState('')
  const [explanation, setExplanation] = React.useState('')
  const [cards, setCards] = React.useState<FlashcardItem[]>([])
  const [loadingSummary, setLoadingSummary] = React.useState(false)
  const [loadingExplain, setLoadingExplain] = React.useState(false)
  const [loadingCards, setLoadingCards] = React.useState(false)
  const [savingCards, setSavingCards] = React.useState(false)

  const streamResponse = async (
    url: string,
    body: object,
    setSteaming: (s: string) => void,
  ) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let text = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      setSteaming(text)
    }
  }

  const handleSummarize = async () => {
    setLoadingSummary(true)
    setSummary('')
    try {
      await streamResponse('/api/ai/summarize', { noteId }, setSummary)
    } catch {
      toast.error('Failed to summarize')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleExplain = async () => {
    if (!selectedText) return
    setLoadingExplain(true)
    setExplanation('')
    try {
      await streamResponse('/api/ai/explain', { text: selectedText }, setExplanation)
    } catch {
      toast.error('Failed to explain')
    } finally {
      setLoadingExplain(false)
    }
  }

  const handleGenerateCards = async () => {
    setLoadingCards(true)
    setCards([])
    try {
      const res = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ noteId, count: 10 }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as { cards: FlashcardItem[] }
      setCards(data.cards)
    } catch {
      toast.error('Failed to generate flashcards')
    } finally {
      setLoadingCards(false)
    }
  }

  const handleSaveCards = async () => {
    if (!cards.length) return
    setSavingCards(true)
    try {
      const { deckId } = await saveFlashcards(courseId, topicId ?? null, cards, noteTitle)
      toast.success(`Saved ${cards.length} cards to a new deck`)
      setCards([])
    } catch {
      toast.error('Failed to save cards')
    } finally {
      setSavingCards(false)
    }
  }

  if (!open) return null

  return (
    <aside className="bg-background flex w-80 shrink-0 flex-col border-l">
      <div className="flex h-10 items-center justify-between border-b px-3">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <Sparkles className="text-primary size-4" /> AI Assistant
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <Tabs defaultValue="summarize" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-3 mt-2 shrink-0">
          <TabsTrigger value="summarize" className="flex-1 text-xs">
            Summarize
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex-1 text-xs">
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="explain" disabled={!selectedText} className="flex-1 text-xs">
            Explain
          </TabsTrigger>
        </TabsList>

        {/* Summarize */}
        <TabsContent value="summarize" className="flex flex-1 flex-col overflow-hidden px-3 pt-2">
          <Button
            size="sm"
            onClick={handleSummarize}
            disabled={loadingSummary}
            className="shrink-0"
          >
            {loadingSummary ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loadingSummary ? 'Summarizing…' : 'Summarize note'}
          </Button>
          {summary && (
            <ScrollArea className="mt-3 flex-1">
              <div className="prose prose-sm dark:prose-invert text-sm">{summary}</div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* Flashcards */}
        <TabsContent value="flashcards" className="flex flex-1 flex-col overflow-hidden px-3 pt-2">
          <Button
            size="sm"
            onClick={handleGenerateCards}
            disabled={loadingCards}
            className="shrink-0"
          >
            {loadingCards ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loadingCards ? 'Generating…' : 'Generate flashcards'}
          </Button>
          {cards.length > 0 && (
            <>
              <ScrollArea className="mt-3 flex-1">
                <div className="flex flex-col gap-2">
                  {cards.map((c, i) => (
                    <div key={i} className="bg-muted rounded-md p-2.5 text-xs">
                      <p className="font-medium">{c.front}</p>
                      <p className="text-muted-foreground mt-1">{c.back}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                size="sm"
                className="mt-2 shrink-0"
                onClick={handleSaveCards}
                disabled={savingCards}
              >
                {savingCards ? <Loader2 className="size-4 animate-spin" /> : null}
                Save {cards.length} cards to deck
              </Button>
            </>
          )}
        </TabsContent>

        {/* Explain */}
        <TabsContent value="explain" className="flex flex-1 flex-col overflow-hidden px-3 pt-2">
          {selectedText ? (
            <>
              <div className="bg-muted mb-2 rounded-md p-2 text-xs shrink-0">
                <p className="text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                  Selected text
                </p>
                <p className="line-clamp-3">{selectedText}</p>
              </div>
              <Button size="sm" onClick={handleExplain} disabled={loadingExplain} className="shrink-0">
                {loadingExplain ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {loadingExplain ? 'Explaining…' : 'Explain selection'}
              </Button>
              {explanation && (
                <ScrollArea className="mt-3 flex-1">
                  <div className="prose prose-sm dark:prose-invert text-sm">{explanation}</div>
                </ScrollArea>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select text in the editor to explain it.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}
