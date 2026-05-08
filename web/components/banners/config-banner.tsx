import { AlertTriangle } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/env'

export function ConfigBanner() {
  if (isSupabaseConfigured()) return null

  return (
    <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 border-b px-4 py-2 text-xs md:px-6">
      <AlertTriangle className="size-3.5 shrink-0" />
      <span>
        Supabase is not configured. Copy{' '}
        <code className="bg-destructive/15 rounded px-1 py-0.5 font-mono text-[11px]">
          web/.env.local.example
        </code>{' '}
        to{' '}
        <code className="bg-destructive/15 rounded px-1 py-0.5 font-mono text-[11px]">
          web/.env.local
        </code>{' '}
        and fill in your project credentials.
      </span>
    </div>
  )
}
