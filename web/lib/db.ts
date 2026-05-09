import { PrismaClient } from '@prisma/client'
import { setDefaultResultOrder } from 'dns'

// Force IPv4 DNS resolution — Hetzner (and many VPS providers) route Supabase's
// direct hostname as IPv6-only, which is unreachable without IPv6 connectivity.
// This must be called before any TCP connections are made.
setDefaultResultOrder('ipv4first')

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const isDatabaseConfigured = () => !!process.env.DATABASE_URL

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) {
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
        if (prop === '$transaction') return () => Promise.resolve([])
        throw new Error('DATABASE_URL not configured')
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require('pg') as typeof import('pg')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg')

  const pool = new Pool({
    connectionString: url,
    ssl: url.includes('supabase.com') ? { rejectUnauthorized: false } : undefined,
  })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
