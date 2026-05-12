'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { BookOpen, FlaskConical, MessageSquare, Plus, Sparkles } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { PRIMARY_NAV } from '@/components/nav/nav-config'
import { cn } from '@/lib/utils'
import type { CourseRow } from '@/lib/data/courses'

type Ctx = { open: () => void; close: () => void; toggle: () => void }
const CommandPaletteContext = React.createContext<Ctx | null>(null)

export function useCommandPalette() {
  const ctx = React.useContext(CommandPaletteContext)
  if (!ctx) throw new Error('useCommandPalette must be used within CommandPaletteProvider')
  return ctx
}

type Props = { children: React.ReactNode; courses?: CourseRow[] }

export function CommandPaletteProvider({ children, courses = [] }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key !== 'k' || (!e.metaKey && !e.ctrlKey)) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          !!target.closest('[contenteditable="true"]'))
      )
        return
      e.preventDefault()
      setIsOpen((o) => !o)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const ctx: Ctx = React.useMemo(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((o) => !o),
    }),
    [],
  )

  const go = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <CommandPaletteContext.Provider value={ctx}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase">
            <div className="flex items-center border-b px-4">
              <Sparkles className="text-muted-foreground mr-3 size-4" />
              <Command.Input
                placeholder="Search courses, notes, actions…"
                className={cn(
                  'placeholder:text-muted-foreground flex h-12 w-full bg-transparent text-sm outline-none',
                )}
              />
            </div>
            <Command.List className="max-h-[420px] overflow-y-auto p-2">
              <Command.Empty className="text-muted-foreground py-8 text-center text-sm">
                No results found.
              </Command.Empty>

              <Command.Group heading="Navigate">
                {PRIMARY_NAV.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.description}`}
                    onSelect={() => go(item.href)}
                    className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
                  >
                    <item.icon className="size-4 shrink-0" />
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground text-xs">{item.description}</span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>

              {courses.length > 0 && (
                <Command.Group heading="Courses">
                  {courses.map((c) => (
                    <React.Fragment key={c.id}>
                      <Command.Item
                        value={`${c.code} ${c.title} notes`}
                        onSelect={() => go(`/courses/${c.id}/notes`)}
                        className="data-[selected=true]:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-3 py-1.5 text-sm"
                      >
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                        />
                        <BookOpen className="text-muted-foreground size-3.5 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">
                          <span className="text-muted-foreground mr-1.5 font-mono text-xs">
                            {c.code}
                          </span>
                          Notes
                        </span>
                      </Command.Item>
                      <Command.Item
                        value={`${c.code} ${c.title} quiz questions`}
                        onSelect={() => go(`/courses/${c.id}/quizzes`)}
                        className="data-[selected=true]:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-3 py-1.5 text-sm"
                      >
                        <span className="size-2 shrink-0 rounded-full opacity-0" />
                        <FlaskConical className="text-muted-foreground size-3.5 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">
                          <span className="text-muted-foreground mr-1.5 font-mono text-xs">
                            {c.code}
                          </span>
                          Quiz
                        </span>
                      </Command.Item>
                      <Command.Item
                        value={`${c.code} ${c.title} chat ask`}
                        onSelect={() => go(`/courses/${c.id}/chat`)}
                        className="data-[selected=true]:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-3 py-1.5 text-sm"
                      >
                        <span className="size-2 shrink-0 rounded-full opacity-0" />
                        <MessageSquare className="text-muted-foreground size-3.5 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">
                          <span className="text-muted-foreground mr-1.5 font-mono text-xs">
                            {c.code}
                          </span>
                          Chat
                        </span>
                      </Command.Item>
                    </React.Fragment>
                  ))}
                </Command.Group>
              )}

              <Command.Group heading="Actions">
                <Command.Item
                  value="new course create add"
                  onSelect={() => go('/courses')}
                  className="data-[selected=true]:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
                >
                  <Plus className="size-4 shrink-0" />
                  New course
                </Command.Item>
                <Command.Item
                  value="review flashcards due study"
                  onSelect={() => go('/review')}
                  className="data-[selected=true]:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
                >
                  <Sparkles className="size-4 shrink-0" />
                  Start review session
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </CommandPaletteContext.Provider>
  )
}
