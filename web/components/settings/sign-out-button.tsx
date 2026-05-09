'use client'

import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      window.location.href = '/login'
    } catch (err) {
      console.error('Sign-out failed:', err)
      toast.error('Could not sign out. Please try again.')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
      <LogOut className="size-4" /> Sign out
    </Button>
  )
}
