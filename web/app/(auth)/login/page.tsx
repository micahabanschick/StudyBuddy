import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { LoginForm } from '@/app/(auth)/login/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to continue your study session.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
