'use client'

import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '@/lib/env'

export function createClient() {
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? 'http://placeholder.invalid',
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder',
  )
}
