import 'server-only'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getNote } from '@/lib/data/notes'
import { serverEnv } from '@/lib/env'

const client = new Anthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { noteId } = (await req.json()) as { noteId: string }
  const note = await getNote(noteId)
  if (!note) return new Response('Note not found', { status: 404 })
  if (!serverEnv.ANTHROPIC_API_KEY) return new Response('ANTHROPIC_API_KEY not configured', { status: 503 })

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are an expert study assistant. Summarize the following note concisely, highlighting the key concepts and takeaways. Use markdown.',
    messages: [
      {
        role: 'user',
        content: `Note title: ${note.title}\n\n${note.contentMd || '(empty note)'}`,
      },
    ],
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
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
