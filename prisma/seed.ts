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
