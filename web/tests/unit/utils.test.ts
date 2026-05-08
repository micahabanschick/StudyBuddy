import { describe, expect, it } from 'vitest'
import { cn, formatRelative } from '@/lib/utils'

describe('cn', () => {
  it('merges tailwind classes and dedupes conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles falsy values', () => {
    expect(cn('px-2', false, null, undefined, 'py-1')).toBe('px-2 py-1')
  })

  it('passes through clsx object syntax', () => {
    expect(cn('text-sm', { 'font-bold': true, italic: false })).toBe('text-sm font-bold')
  })
})

describe('formatRelative', () => {
  it('returns "just now" for recent times', () => {
    expect(formatRelative(new Date())).toBe('just now')
  })

  it('formats minutes', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000)
    expect(formatRelative(fiveMinAgo)).toBe('5m ago')
  })

  it('formats hours', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60_000)
    expect(formatRelative(threeHoursAgo)).toBe('3h ago')
  })
})
