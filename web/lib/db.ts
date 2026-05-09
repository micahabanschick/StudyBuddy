import { PrismaClient } from '@prisma/client'

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

  // Supabase (and most hosted Postgres) requires SSL.
  // rejectUnauthorized:false trusts Supabase's cert without needing a local CA bundle.
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
