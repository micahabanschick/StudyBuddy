'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { rateCard, type RatingValue } from '@/lib/server/actions/flashcards'
import { cn } from '@/lib/utils'
import type { CardWithState } from '@/lib/data/flashcards'

type Props = {
  deckId: string
  cards: CardWithState[]
  userId: string
}

const RATINGS: { value: RatingValue; label: string; key: string; color: string }[] = [
  { value: 1, label: 'Again', key: '1', color: 'bg-red-500 hover:bg-red-600' },
  { value: 2, label: 'Hard', key: '2', color: 'bg-orange-500 hover:bg-orange-600' },
  { value: 3, label: 'Good', key: '3', color: 'bg-green-500 hover:bg-green-600' },
  { value: 4, label: 'Easy', key: '4', color: 'bg-blue-500 hover:bg-blue-600' },
]

export function CardReview({ deckId, cards: initialCards, userId }: Props) {
  const router = useRouter()
  const [cards] = React.useState(initialCards)
  const [index, setIndex] = React.useState(0)
  const [revealed, setRevealed] = React.useState(false)
  const [flipped, setFlipped] = React.useState(false)
  const [done, setDone] = React.useState(cards.length === 0)
  const [rating, setRating] = React.useState(false)

  const current = cards[index]
  const progress = cards.length > 0 ? Math.round((index / cards.length) * 100) : 100

  const handleReveal = () => {
    setFlipped(true)
    setTimeout(() => setRevealed(true), 150)
  }

  const handleRate = async (r: RatingValue) => {
    if (!current || rating) return
    setRating(true)
    try {
      await rateCard(current.id, r, userId)
    } catch {
      toast.error('Failed to save rating')
    }
    const next = index + 1
    if (next >= cards.length) {
      setDone(true)
    } else {
      setFlipped(false)
      setRevealed(false)
      setIndex(next)
    }
    setRating(false)
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!revealed && e.key === ' ') { e.preventDefault(); handleReveal() }
      if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
        handleRate(parseInt(e.key) as RatingValue)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [revealed, index, rating])

  if (done) {
    return (
      <div className="flex h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="bg-green-500/10 grid size-20 place-items-center rounded-full">
          <CheckCircle className="size-10 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Session complete!</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            You reviewed {cards.length} card{cards.length === 1 ? '' : 's'}.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/review')}>
            Back to review
          </Button>
          <Button onClick={() => router.refresh()}>
            Check for more
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col">
      {/* Progress bar + header */}
      <div className="shrink-0 border-b px-6 py-3">
        <div className="mb-2 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push('/review')} className="gap-1">
            <ChevronLeft className="size-4" /> All decks
          </Button>
          <span className="text-muted-foreground text-sm">
            {index + 1} / {cards.length}
          </span>
        </div>
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.18 }}
            >
              {/* Front */}
              <div
                className="bg-card cursor-pointer select-none rounded-2xl border p-8 shadow-sm transition-shadow hover:shadow-md"
                onClick={!revealed ? handleReveal : undefined}
              >
                <p className="text-muted-foreground mb-3 text-center text-xs font-medium uppercase tracking-wider">
                  Question
                </p>
                <p className="text-center text-lg font-medium leading-relaxed">{current.front}</p>
              </div>

              {/* Back — revealed after flip */}
              <motion.div
                initial={false}
                animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 8 }}
                transition={{ duration: 0.2 }}
                className={cn('mt-4', !revealed && 'pointer-events-none')}
              >
                <div className="bg-muted rounded-2xl border p-8">
                  <p className="text-muted-foreground mb-3 text-center text-xs font-medium uppercase tracking-wider">
                    Answer
                  </p>
                  <p className="text-center text-base leading-relaxed">{current.back}</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Rating buttons */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.05 }}
                className="mt-6"
              >
                <p className="text-muted-foreground mb-3 text-center text-xs">
                  How well did you recall it? (press 1–4)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {RATINGS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => handleRate(r.value)}
                      disabled={rating}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl py-3 text-white transition-all active:scale-95 disabled:opacity-50',
                        r.color,
                      )}
                    >
                      <span className="text-sm font-semibold">{r.label}</span>
                      <kbd className="bg-white/20 rounded px-1.5 text-[10px]">{r.key}</kbd>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed && (
            <div className="mt-6 text-center">
              <Button size="lg" onClick={handleReveal} className="px-10">
                Show answer
                <kbd className="bg-primary-foreground/20 ml-2 rounded px-1.5 text-xs">Space</kbd>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
