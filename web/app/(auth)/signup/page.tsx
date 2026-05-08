import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/app/(auth)/signup/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Sign up' }

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>One account for every course you take, now and later.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
