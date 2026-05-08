'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { useCommandPalette } from '@/components/nav/command-palette'
import { UserMenu } from '@/components/nav/user-menu'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/review': 'Review',
  '/courses': 'Courses',
  '/chat': 'Chat',
  '/settings': 'Settings',
}

export function Topbar() {
  const pathname = usePathname()
  const { open } = useCommandPalette()

  const title =
    Object.entries(TITLES).find(
      ([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'),
    )?.[1] ?? 'StudyBuddy'

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur md:px-6">
      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={open}
          className="text-muted-foreground gap-2 px-3"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search…</span>
          <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
