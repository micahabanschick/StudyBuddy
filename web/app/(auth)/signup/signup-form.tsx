'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/env'

export function SignupForm() {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured yet. Set up .env.local to enable sign-up.')
      return
    }
    setPending(true)
    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      options: {
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
      },
    })
    setPending(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Check your email to confirm your account.')
    router.push('/login')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Create account
      </Button>
    </form>
  )
}
