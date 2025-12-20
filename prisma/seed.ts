import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Asset Types...')

  await prisma.assetType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Patrimônio',
      schema: {}
    }
  })

  console.log('Seeding Gamification Rules...')

  await prisma.gamificationRule.upsert({
    where: { slug: 'visit' },
    update: {},
    create: {
      slug: 'visit',
      title: 'Visita Confirmada',
      points: 10,
      icon: 'map-pin',
      requiresLocation: true,
      requiresPhoto: false
    }
  })

  await prisma.gamificationRule.upsert({
    where: { slug: 'report_fix' },
    update: {},
    create: {
      slug: 'report_fix',
      title: 'Reportar Problema',
      points: 50,
      icon: 'alert-triangle',
      requiresLocation: true,
      requiresPhoto: true
    }
  })

  console.log('Seeding completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
