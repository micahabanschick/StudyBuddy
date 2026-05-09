'use client'

import * as React from 'react'
import { CheckCircle, Loader2, RefreshCw, Sparkles, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CourseDetail } from '@/lib/data/courses'
import type { NoteListItem } from '@/lib/data/notes'

type Question = {
  type: 'mcq' | 'free_response'
  prompt: string
  choices?: string[]
  answer: string
  explanation: string
}

type Props = {
  courseId: string
  course: CourseDetail
  notes: NoteListItem[]
}

type QuizState = 'idle' | 'generating' | 'active' | 'done'

export function QuizGenerator({ courseId, course, notes }: Props) {
  const [state, setState] = React.useState<QuizState>('idle')
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [current, setCurrent] = React.useState(0)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [revealed, setRevealed] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [count, setCount] = React.useState(5)

  const generate = async () => {
    if (notes.length === 0) {
      toast.error('Add notes to this course first — the quiz is generated from them.')
      return
    }
    setState('generating')
    try {
      const res = await fetch('/api/ai/quiz/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ courseId, count }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as { questions: Question[] }
      setQuestions(data.questions)
      setCurrent(0)
      setSelected(null)
      setRevealed(false)
      setScore(0)
      setState('active')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate quiz')
      setState('idle')
    }
  }

  const handleSelect = (choice: string) => {
    if (revealed) return
    setSelected(choice)
  }

  const handleReveal = () => {
    if (!selected && questions[current].type === 'mcq') return
    setRevealed(true)
    if (questions[current].type === 'mcq' && selected === questions[current].answer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    const next = current + 1
    if (next >= questions.length) {
      setState('done')
    } else {
      setCurrent(next)
      setSelected(null)
      setRevealed(false)
    }
  }

  const q = questions[current]

  if (state === 'done') {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div
          className={cn(
            'grid size-20 place-items-center rounded-full',
            pct >= 70 ? 'bg-green-500/10' : 'bg-orange-500/10',
          )}
        >
          {pct >= 70 ? (
            <CheckCircle className="size-10 text-green-500" />
          ) : (
            <RefreshCw className="size-10 text-orange-500" />
          )}
        </div>
        <div>
          <p className="text-4xl font-bold">{pct}%</p>
          <p className="text-muted-foreground mt-1">
            {score} / {questions.length} correct
          </p>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm">
          {pct >= 90
            ? 'Excellent! You know this material well.'
            : pct >= 70
              ? 'Good work. Review the questions you missed.'
              : 'Keep studying — try again after reviewing your notes.'}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setState('idle')}>
            Back
          </Button>
          <Button onClick={generate}>
            <RefreshCw className="size-4" /> New quiz
          </Button>
        </div>
      </div>
    )
  }

  if (state === 'active' && q) {
    const progress = Math.round(((current) / questions.length) * 100)
    return (
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b px-6 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">{course.code} Quiz</span>
            <span className="text-muted-foreground text-sm">{current + 1} / {questions.length}</span>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-start overflow-y-auto px-6 py-8">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
                  {q.type === 'mcq' ? 'Multiple choice' : 'Free response'}
                </p>
                <p className="mb-6 text-lg font-medium leading-relaxed">{q.prompt}</p>

                {q.type === 'mcq' && q.choices ? (
                  <div className="flex flex-col gap-2">
                    {q.choices.map((choice) => {
                      const isCorrect = choice === q.answer
                      const isSelected = choice === selected
                      return (
                        <button
                          key={choice}
                          onClick={() => handleSelect(choice)}
                          className={cn(
                            'w-full rounded-xl border px-4 py-3 text-left text-sm transition-all',
                            !revealed && 'hover:border-primary/50 hover:bg-accent/30 cursor-pointer',
                            revealed && isCorrect && 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
                            revealed && isSelected && !isCorrect && 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400',
                            !revealed && isSelected && 'border-primary bg-primary/10',
                            revealed && 'cursor-default',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {revealed && isCorrect && <CheckCircle className="size-4 text-green-500 shrink-0" />}
                            {revealed && isSelected && !isCorrect && <XCircle className="size-4 text-red-500 shrink-0" />}
                            {choice}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl border p-4 text-sm text-muted-foreground italic">
                    Free response — think through your answer, then reveal.
                  </div>
                )}

                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted mt-4 rounded-xl border p-4"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Explanation</p>
                    <p className="text-sm">{q.explanation}</p>
                    {q.type === 'free_response' && (
                      <>
                        <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Model answer</p>
                        <p className="text-sm mt-1">{q.answer}</p>
                      </>
                    )}
                  </motion.div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  {!revealed ? (
                    <Button
                      onClick={handleReveal}
                      disabled={q.type === 'mcq' && !selected}
                    >
                      Reveal answer
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      {current + 1 < questions.length ? 'Next question' : 'See results'}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Quizzes</h2>
        <p className="text-muted-foreground text-sm">
          AI-generated questions from your {course.code} notes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" /> Generate a quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Add notes to this course first — the quiz questions are generated from them.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {notes.length} note{notes.length === 1 ? '' : 's'} available.
              Claude will generate a mix of multiple-choice and free-response questions.
            </p>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Questions:</span>
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                  count === n
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50 hover:bg-accent/30',
                )}
              >
                {n}
              </button>
            ))}
          </div>

          <Button
            onClick={generate}
            disabled={state === 'generating' || notes.length === 0}
            size="lg"
          >
            {state === 'generating' ? (
              <><Loader2 className="size-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="size-4" /> Start {count}-question quiz</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
