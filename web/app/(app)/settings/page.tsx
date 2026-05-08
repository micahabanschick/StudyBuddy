import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Account, appearance, and data.</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Profile and authentication settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Account management UI lands alongside Supabase auth. Sign out from the avatar menu in
              the top right.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Theme is in the bottom of the sidebar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-3" />
            <p className="text-muted-foreground text-sm">
              Light, dark, and system are wired up. Custom themes (sepia, synth, focus) come in
              Phase 5.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
