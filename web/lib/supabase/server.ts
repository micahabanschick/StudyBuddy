import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { publicEnv } from '@/lib/env'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? 'http://placeholder.invalid',
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server components cannot mutate cookies; proxy refreshes instead.
          }
        },
      },
    },
  )
}

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch {
    return null
  }
}
