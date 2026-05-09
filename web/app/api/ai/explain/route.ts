import 'server-only'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { serverEnv } from '@/lib/env'

const client = new Anthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!serverEnv.ANTHROPIC_API_KEY) return new Response('ANTHROPIC_API_KEY not configured', { status: 503 })

  const { text, context } = (await req.json()) as { text: string; context?: string }
  if (!text?.trim()) return new Response('text is required', { status: 400 })

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are an expert tutor. Explain the provided text clearly and concisely. If it involves math or chemistry, show your work step by step. Use markdown.',
    messages: [
      {
        role: 'user',
        content: context
          ? `Context from note:\n${context}\n\nExplain this selection:\n${text}`
          : `Explain this:\n${text}`,
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
