import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">This page is off the syllabus.</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The page you tried to reach doesn&apos;t exist (or hasn&apos;t been built yet).
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
