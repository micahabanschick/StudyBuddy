'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { BookOpenText, Settings, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { PRIMARY_NAV } from '@/components/nav/nav-config'
import { cn } from '@/lib/utils'

type Course = { id: string; code: string; title: string; color?: string | null }

export function Sidebar({ courses = [] }: { courses?: Course[] }) {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden h-svh w-64 shrink-0 flex-col border-r md:flex">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-md shadow-sm shadow-primary/40">
          <Sparkles className="size-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">StudyBuddy</span>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/60',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="bg-sidebar-primary absolute inset-0 -z-10 rounded-md shadow-sm shadow-primary/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6">
          <div className="text-muted-foreground flex items-center justify-between px-3 pb-2 text-xs font-medium uppercase tracking-wider">
            <span>Courses</span>
            <span className="tabular-nums">{courses.length}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            {courses.length === 0 ? (
              <p className="text-muted-foreground px-3 py-2 text-xs">
                No courses yet. Add one from{' '}
                <Link
                  href="/courses"
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  Courses
                </Link>
                .
              </p>
            ) : (
              courses.map((course) => {
                const href = `/courses/${course.id}`
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={course.id}
                    href={href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                    )}
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: course.color ?? 'var(--primary)' }}
                    />
                    <span className="truncate">
                      <span className="text-muted-foreground mr-1.5 font-mono text-xs">
                        {course.code}
                      </span>
                      {course.title}
                    </span>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </ScrollArea>

      <Separator />

      <div className="flex items-center justify-between px-3 py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon">
              <Link href="/settings" aria-label="Settings">
                <Settings className="size-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Docs" asChild>
              <a
                href="https://github.com/micahabanschick/StudyBuddy"
                target="_blank"
                rel="noreferrer noopener"
              >
                <BookOpenText className="size-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Docs</TooltipContent>
        </Tooltip>
        <ThemeToggle />
      </div>
    </aside>
  )
}
