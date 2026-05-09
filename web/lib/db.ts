import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const isDatabaseConfigured = () => !!process.env.DATABASE_URL

function createClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  } catch {
    // Prisma 7 requires a driver adapter when DATABASE_URL is set.
    // Without one, return a proxy that fails gracefully at query time.
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
        if (prop === '$transaction') return () => Promise.resolve([])
        throw new Error('DATABASE_URL not configured')
      },
    })
  }
}

export const db = globalForPrisma.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
