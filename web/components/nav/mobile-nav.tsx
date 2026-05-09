'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { PRIMARY_NAV } from '@/components/nav/nav-config'
import { cn } from '@/lib/utils'
import type { CourseRow } from '@/lib/data/courses'

export function MobileNav({ courses }: { courses: CourseRow[] }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="flex h-14 flex-row items-center gap-2 border-b px-5">
            <div className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-md shadow-sm shadow-primary/40">
              <Sparkles className="size-4" />
            </div>
            <SheetTitle className="text-base font-semibold tracking-tight">StudyBuddy</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100%-3.5rem)]">
            <nav className="flex flex-col gap-0.5 px-3 py-3">
              {PRIMARY_NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {courses.length > 0 && (
              <>
                <Separator className="mx-3" />
                <div className="px-3 py-3">
                  <p className="text-muted-foreground mb-2 px-3 text-xs font-medium uppercase tracking-wider">
                    Courses
                  </p>
                  {courses.map((c) => {
                    const href = `/courses/${c.id}`
                    const active = pathname.startsWith(href)
                    return (
                      <Link
                        key={c.id}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                        )}
                      >
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                        />
                        <span className="truncate">
                          <span className="font-mono text-xs mr-1.5">{c.code}</span>
                          {c.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}

            <div className="border-t px-5 py-3 flex justify-end">
              <ThemeToggle />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
