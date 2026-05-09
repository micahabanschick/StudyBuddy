import { Sidebar } from '@/components/nav/sidebar'
import { Topbar } from '@/components/nav/topbar'
import { MobileNav } from '@/components/nav/mobile-nav'
import { CommandPaletteProvider } from '@/components/nav/command-palette'
import { ConfigBanner } from '@/components/banners/config-banner'
import { getCourses } from '@/lib/data/courses'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const courses = await getCourses()

  return (
    <CommandPaletteProvider courses={courses}>
      <div className="app-shell-bg flex min-h-svh">
        <Sidebar courses={courses} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar mobileNav={<MobileNav courses={courses} />} />
          <ConfigBanner />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </CommandPaletteProvider>
  )
}
