import { notFound } from 'next/navigation'
import { getDueCards } from '@/lib/data/flashcards'
import { isDatabaseConfigured } from '@/lib/db'
import { CardReview } from '@/components/flashcards/card-review'

type Props = { params: Promise<{ deckId: string }> }

export default async function DeckReviewPage({ params }: Props) {
  if (!isDatabaseConfigured()) notFound()

  const { deckId } = await params
  // Personal app — use the local dev user ID
  const userId = '00000000-0000-0000-0000-000000000000'
  const cards = await getDueCards(deckId, userId)

  return <CardReview deckId={deckId} cards={cards} userId={userId} />
}
