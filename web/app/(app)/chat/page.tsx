import type { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Chat' }

export default function ChatPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Chat</h2>
        <p className="text-muted-foreground text-sm">
          Ask questions grounded in your own course materials.
        </p>
      </header>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-4" /> Coming in Phase 2
          </CardTitle>
          <CardDescription>
            Upload PDFs and lecture slides to a course, then chat with citations linking back to the
            exact pages. Powered by the AI service in{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">../ai</code>.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
