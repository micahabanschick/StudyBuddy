'use server'
import 'server-only'
import { db } from '@/lib/db'

export async function saveFlashcards(
  courseId: string,
  topicId: string | null,
  cards: Array<{ front: string; back: string }>,
  sourceTitle: string,
): Promise<{ deckId: string }> {
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
  return { deckId: deck.id }
}
