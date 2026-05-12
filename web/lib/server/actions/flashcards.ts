'use server'
import 'server-only'
import { revalidatePath } from 'next/cache'
import { db, isDatabaseConfigured } from '@/lib/db'
import { createEmptyCard, fsrs, generatorParameters, Rating } from 'ts-fsrs'

export async function saveFlashcards(
  courseId: string,
  topicId: string | null,
  cards: Array<{ front: string; back: string }>,
  sourceTitle: string,
): Promise<{ deckId: string }> {
  if (!isDatabaseConfigured()) return { deckId: '' }
  const deck = await db.deck.create({
    data: {
      courseId,
      topicId,
      title: `${sourceTitle} — AI generated`,
      cards: {
        create: cards.map((c) => ({ front: c.front, back: c.back, type: 'basic' })),
      },
    },
    select: { id: true },
  })
  revalidatePath(`/courses/${courseId}`)
  return { deckId: deck.id }
}

export type RatingValue = 1 | 2 | 3 | 4

export async function rateCard(cardId: string, rating: RatingValue, userId: string): Promise<void> {
  if (!isDatabaseConfigured()) return

  const f = fsrs(generatorParameters())
  const now = new Date()

  // Get the most recent review for this card to restore FSRS state
  const lastReview = await db.review.findFirst({
    where: { cardId, userId },
    orderBy: { ts: 'desc' },
  })

  const card = lastReview
    ? {
        due: lastReview.due,
        stability: lastReview.stability,
        difficulty: lastReview.difficulty,
        elapsed_days: lastReview.elapsedDays,
        scheduled_days: lastReview.scheduledDays,
        reps: 0,
        lapses: 0,
        state: 0 as const,
        last_review: lastReview.ts,
      }
    : createEmptyCard(now)

  const fsrsRating =
    rating === 1
      ? Rating.Again
      : rating === 2
        ? Rating.Hard
        : rating === 3
          ? Rating.Good
          : Rating.Easy

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = f.repeat(card as any, now)
  const scheduled = result[fsrsRating]

  await db.review.create({
    data: {
      cardId,
      userId,
      ts: now,
      rating,
      stability: scheduled.card.stability,
      difficulty: scheduled.card.difficulty,
      due: scheduled.card.due,
      elapsedDays: scheduled.card.elapsed_days,
      scheduledDays: scheduled.card.scheduled_days,
    },
  })

  revalidatePath('/review')
}
