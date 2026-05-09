import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  } catch {
    // Prisma 7 requires a driver adapter when no DATABASE_URL is configured.
    // Return a proxy so the app boots without a DB — data helpers' try/catch
    // will surface a clear error at query time instead of crashing at startup.
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
        if (prop === '$transaction') return () => Promise.resolve([])
        throw new Error(
          `Database not configured. Copy web/.env.local.example to web/.env.local and fill in DATABASE_URL.`,
        )
      },
    })
  }
}

export const db = globalForPrisma.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
