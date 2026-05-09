import 'server-only'
import { isDatabaseConfigured } from '@/lib/db'

export type DeckWithCount = {
  id: string
  title: string
  courseId: string
  topicId: string | null
  _count: { cards: number }
  dueCount: number
}

export type CardWithState = {
  id: string
  front: string
  back: string
  type: string
  due: Date | null
  stability: number | null
  difficulty: number | null
}

export async function getDecks(courseId: string): Promise<DeckWithCount[]> {
  if (!isDatabaseConfigured()) return []
  try {
    const { db } = await import('@/lib/db')
    const now = new Date()
    const decks = await db.deck.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        courseId: true,
        topicId: true,
        _count: { select: { cards: true } },
      },
    })

    // Count due cards per deck
    const dueCountsRaw = await Promise.all(
      decks.map((d) =>
        db.review
          .findMany({
            where: { card: { deckId: d.id }, due: { lte: now } },
            distinct: ['cardId'],
            select: { cardId: true },
          })
          .then((r) => r.length),
      ),
    )

    return decks.map((d, i) => ({ ...d, dueCount: dueCountsRaw[i] }))
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getDecks]', err)
    return []
  }
}

export async function getDueCards(deckId: string, userId: string): Promise<CardWithState[]> {
  if (!isDatabaseConfigured()) return []
  try {
    const { db } = await import('@/lib/db')
    const now = new Date()

    // Cards with a review due now
    const reviewed = await db.review.findMany({
      where: { card: { deckId }, userId, due: { lte: now } },
      orderBy: { due: 'asc' },
      distinct: ['cardId'],
      select: {
        cardId: true,
        due: true,
        stability: true,
        difficulty: true,
        card: { select: { id: true, front: true, back: true, type: true } },
      },
    })

    // Cards never reviewed (new cards)
    const reviewedIds = reviewed.map((r) => r.cardId)
    const newCards = await db.card.findMany({
      where: { deckId, id: { notIn: reviewedIds } },
      take: 10,
      select: { id: true, front: true, back: true, type: true },
    })

    const dueCards: CardWithState[] = reviewed.map((r) => ({
      id: r.card.id,
      front: r.card.front,
      back: r.card.back,
      type: r.card.type,
      due: r.due,
      stability: r.stability,
      difficulty: r.difficulty,
    }))

    const freshCards: CardWithState[] = newCards.map((c) => ({
      ...c,
      due: null,
      stability: null,
      difficulty: null,
    }))

    return [...dueCards, ...freshCards]
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getDueCards]', err)
    return []
  }
}

export async function getAllDueCards(userId: string): Promise<{ deckId: string; count: number }[]> {
  if (!isDatabaseConfigured()) return []
  try {
    const { db } = await import('@/lib/db')
    const now = new Date()
    const due = await db.review.findMany({
      where: { userId, due: { lte: now } },
      distinct: ['cardId'],
      select: { card: { select: { deckId: true } } },
    })
    const map = new Map<string, number>()
    for (const r of due) {
      map.set(r.card.deckId, (map.get(r.card.deckId) ?? 0) + 1)
    }
    return Array.from(map.entries()).map(([deckId, count]) => ({ deckId, count }))
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getAllDueCards]', err)
    return []
  }
}
