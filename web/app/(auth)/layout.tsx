import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="app-shell-bg pointer-events-none absolute inset-0 -z-10" />
      <header className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground shadow-primary/40 grid size-7 place-items-center rounded-md shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">StudyBuddy</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">{children}</main>
    </div>
  )
}
