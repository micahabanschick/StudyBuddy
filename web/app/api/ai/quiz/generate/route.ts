import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getNotes, getNote } from '@/lib/data/notes'
import { serverEnv } from '@/lib/env'

const client = new Anthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY })

const QUIZ_TOOL = {
  name: 'save_quiz',
  description: 'Save the generated quiz questions.',
  input_schema: {
    type: 'object' as const,
    properties: {
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['mcq', 'free_response'] },
            prompt: { type: 'string' },
            choices: { type: 'array', items: { type: 'string' } },
            answer: { type: 'string' },
            explanation: { type: 'string' },
          },
          required: ['type', 'prompt', 'answer', 'explanation'],
        },
      },
    },
    required: ['questions'],
  },
}

export async function POST(req: NextRequest) {
  if (!serverEnv.ANTHROPIC_API_KEY)
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })

  const { courseId, count = 5 } = (await req.json()) as { courseId: string; count?: number }

  const notes = await getNotes(courseId)
  if (notes.length === 0)
    return NextResponse.json({ error: 'No notes found for this course' }, { status: 400 })

  const recent = notes.slice(0, 6)
  const noteContents = await Promise.all(recent.map((n) => getNote(n.id)))
  const context = noteContents
    .filter(Boolean)
    .map((n) => `## ${n!.title}\n\n${n!.contentMd || '(empty)'}`)
    .join('\n\n---\n\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system:
      'You are an expert educator creating high-quality quiz questions from student notes. ' +
      'Generate a mix of multiple-choice (mcq) and free-response questions. ' +
      'MCQ questions must have exactly 4 choices with one correct answer. ' +
      'Explanations should be concise but informative.',
    messages: [
      {
        role: 'user',
        content: `Generate exactly ${count} quiz questions from these notes. Mix MCQ and free-response.\n\n${context}`,
      },
    ],
    tools: [QUIZ_TOOL],
    tool_choice: { type: 'tool', name: 'save_quiz' },
  })

  const toolBlock = response.content.find(
    (b) => b.type === 'tool_use' && b.name === 'save_quiz',
  )
  if (!toolBlock || toolBlock.type !== 'tool_use')
    return NextResponse.json({ error: 'Model did not return questions' }, { status: 500 })

  return NextResponse.json(toolBlock.input)
}
