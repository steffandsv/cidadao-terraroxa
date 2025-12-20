import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Asset Types...')

  // Update default AssetType with 'problems' list in schema
  await prisma.assetType.upsert({
    where: { id: 1 },
    update: {
      icon: 'box',
      schema: {
        problems: [
          "Lâmpada Queimada",
          "Luz Intermitente",
          "Fios Soltos/Baixos",
          "Poste Caído/Torto",
          "Corrosão na Base",
          "Lixo/Entulho Próximo",
          "Outro"
        ]
      }
    },
    create: {
      id: 1,
      name: 'Patrimônio',
      icon: 'box',
      schema: {
        problems: [
          "Lâmpada Queimada",
          "Luz Intermitente",
          "Fios Soltos/Baixos",
          "Poste Caído/Torto",
          "Corrosão na Base",
          "Lixo/Entulho Próximo",
          "Outro"
        ]
      }
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
