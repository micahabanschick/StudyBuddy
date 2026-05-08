import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Review' }

export default function ReviewPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Daily review</h2>
        <p className="text-muted-foreground text-sm">
          Spaced-repetition queue across all your courses, scheduled with FSRS.
        </p>
      </header>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4" /> Coming in Phase 3
          </CardTitle>
          <CardDescription>
            Once flashcards land you&apos;ll see the day&apos;s due cards here, with FSRS-driven
            intervals adapting to how you rate your recall.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
