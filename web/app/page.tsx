import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'

export default async function Home() {
  const user = await getUser()
  // Logged in → dashboard. Not logged in → still go to dashboard (personal app, no gate).
  redirect('/dashboard')
}
