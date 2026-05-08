import { Sidebar } from '@/components/nav/sidebar'
import { Topbar } from '@/components/nav/topbar'
import { CommandPaletteProvider } from '@/components/nav/command-palette'
import { ConfigBanner } from '@/components/banners/config-banner'

type Course = { id: string; code: string; title: string; color: string | null }

async function getCourses(): Promise<Course[]> {
  try {
    const { db } = await import('@/lib/db')
    const courses = await db.course.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, code: true, title: true, color: true },
    })
    return courses
  } catch {
    return []
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const courses = await getCourses()

  return (
    <CommandPaletteProvider>
      <div className="app-shell-bg flex min-h-svh">
        <Sidebar courses={courses} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <ConfigBanner />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </CommandPaletteProvider>
  )
}
