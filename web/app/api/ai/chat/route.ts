import 'server-only'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getNotes, getNote } from '@/lib/data/notes'
import { serverEnv } from '@/lib/env'

const client = new Anthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY })

type MessageParam = { role: 'user' | 'assistant'; content: string }

export async function POST(req: NextRequest) {
  if (!serverEnv.ANTHROPIC_API_KEY)
    return new Response('ANTHROPIC_API_KEY not configured', { status: 503 })

  const { courseId, messages } = (await req.json()) as {
    courseId: string
    messages: MessageParam[]
  }

  // Build context from course notes (best-effort — empty if no DB)
  const notes = await getNotes(courseId)
  let notesContext = ''
  if (notes.length > 0) {
    // Fetch content for up to 8 most recent notes to stay within context
    const recent = notes.slice(0, 8)
    const noteContents = await Promise.all(recent.map((n) => getNote(n.id)))
    notesContext = noteContents
      .filter(Boolean)
      .map((n) => `## ${n!.title}\n\n${n!.contentMd || '(empty)'}`)
      .join('\n\n---\n\n')
  }

  const systemPrompt = [
    'You are an expert study assistant helping a student with their coursework.',
    'Answer questions accurately, clearly, and concisely.',
    'When explaining complex concepts, use examples and analogies.',
    'For math and chemistry, show your work step by step.',
    notesContext
      ? `\n\nHere are the student's course notes — use them as primary context:\n\n${notesContext}`
      : '\n\nNo notes are available yet for this course. Answer from general knowledge.',
  ].join('')

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
