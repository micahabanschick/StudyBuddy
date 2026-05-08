/**
 * Seed script. Idempotent — safe to re-run.
 *
 * Usage:
 *   SEED_USER_ID=<auth.users.id uuid> pnpm db:seed
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const userId = process.env.SEED_USER_ID
  if (!userId) {
    console.error('SEED_USER_ID is required (a uuid from auth.users).')
    process.exit(1)
  }

  await db.profile.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  })

  const bio = await db.course.upsert({
    where: { id: 'seed-bio-1107' },
    update: {},
    create: {
      id: 'seed-bio-1107',
      userId,
      code: 'BIO 1107',
      title: 'Principles of Biology I',
      term: 'Summer 2026',
      color: '#22c55e',
    },
  })

  const chem = await db.course.upsert({
    where: { id: 'seed-chem-1128q' },
    update: {},
    create: {
      id: 'seed-chem-1128q',
      userId,
      code: 'CHEM 1128Q',
      title: 'General Chemistry II',
      term: 'Summer 2026',
      color: '#0ea5e9',
    },
  })

  const bioTopics = [
    { id: 'seed-bio-cell', title: 'Cell biology', position: 0 },
    { id: 'seed-bio-genetics', title: 'Genetics', position: 1 },
    { id: 'seed-bio-evolution', title: 'Evolution', position: 2 },
  ]

  const chemTopics = [
    { id: 'seed-chem-thermo', title: 'Thermodynamics', position: 0 },
    { id: 'seed-chem-kinetics', title: 'Kinetics', position: 1 },
    { id: 'seed-chem-equilibrium', title: 'Equilibrium', position: 2 },
  ]

  for (const t of bioTopics) {
    await db.topic.upsert({
      where: { id: t.id },
      update: {},
      create: { ...t, courseId: bio.id },
    })
  }
  for (const t of chemTopics) {
    await db.topic.upsert({
      where: { id: t.id },
      update: {},
      create: { ...t, courseId: chem.id },
    })
  }

  console.log(`Seeded ${bio.code} and ${chem.code} for user ${userId}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
