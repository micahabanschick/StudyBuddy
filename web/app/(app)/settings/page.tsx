import type { Metadata } from 'next'
import { Database, Key, Palette, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { SignOutButton } from '@/components/settings/sign-out-button'
import { getCourses } from '@/lib/data/courses'
import { getStudyStats } from '@/lib/data/stats'
import { isDatabaseConfigured } from '@/lib/db'

export const metadata: Metadata = { title: 'Settings' }

const OWNER_ID = process.env.OWNER_USER_ID ?? '00000000-0000-0000-0000-000000000000'

export default async function SettingsPage() {
  const [courses, stats] = await Promise.all([getCourses(), getStudyStats(OWNER_ID)])

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Account, appearance, and study data.</p>
      </header>

      <div className="space-y-4">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Micah Banschick</p>
              <p className="text-muted-foreground text-xs">micha.ban@gmail.com</p>
            </div>
            <SignOutButton />
          </CardContent>
        </Card>

        {/* Study stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="size-4" /> Study stats
            </CardTitle>
            <CardDescription>Your activity at a glance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Courses', value: courses.length },
                { label: 'Day streak', value: stats.streakDays },
                { label: 'Reviews this week', value: stats.reviewsThisWeek },
              ].map((s) => (
                <div key={s.label} className="bg-muted/40 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4" /> Appearance
            </CardTitle>
            <CardDescription>Toggle between light, dark, and system theme.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Current theme</p>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="size-4" /> Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className={isDatabaseConfigured() ? 'text-green-500' : 'text-red-500'}>
                {isDatabaseConfigured() ? 'Connected' : 'Not configured'}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Supabase project</span>
              <span className="font-mono text-xs">bacwuxoeoporlnznbklh</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Deployed at</span>
              <a
                href="https://studybuddy.banschick.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary text-xs underline-offset-2 hover:underline"
              >
                studybuddy.banschick.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
