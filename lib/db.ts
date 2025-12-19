// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Workaround for Prisma 7.2.0 issue or new requirement?
// The error says "PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions"
// but I am passing nothing.
// Let's try passing an empty object or explicit datasources if needed.
// Actually, it might be related to the generated client waiting for the configuration object.
// But `prisma.config.ts` exists.
// Let's try to pass an empty object.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
