import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Public Works...')

  // 1. Create Gamification Rule for Work Inspection
  await prisma.gamificationRule.upsert({
    where: { slug: 'work_inspection' },
    update: {},
    create: {
      slug: 'work_inspection',
      title: 'Vistoria de Obra',
      points: 20,
      icon: 'lucide-hard-hat',
      requiresLocation: true,
      requiresPhoto: true,
      aiValidation: false
    }
  })
  console.log(' - Created/Updated Gamification Rule: work_inspection')

  // 2. Create some sample Public Works
  // Using coordinates near Terra Roxa (assuming based on memory/context, or just generic ones for now if not known)
  // I'll use some coordinates that might be in Terra Roxa, SP.
  // Terra Roxa center approx: -20.7877, -48.3314

  const works = [
    {
      qrHash: 'obra-praca-matriz',
      title: 'Reforma da Praça Matriz',
      description: 'Revitalização completa da praça central com novo paisagismo e iluminação LED.',
      budgetValue: 150000.00,
      deadlineDate: new Date('2024-12-31'),
      currentStatus: 'Alvenaria',
      statusDeadline: new Date('2024-06-30'),
      coverPhotoUrl: 'https://images.unsplash.com/photo-1596522354195-e84ae80d165f?q=80&w=2069&auto=format&fit=crop',
      geoLat: -20.7877,
      geoLng: -48.3314,
      metadata: { contractor: "Construtora Terra Nova", engineer: "Dr. Roberto" }
    },
    {
        qrHash: 'obra-escola-modelo',
        title: 'Ampliação da Escola Modelo',
        description: 'Construção de 4 novas salas de aula e laboratório de informática.',
        budgetValue: 450000.00,
        deadlineDate: new Date('2025-03-15'),
        currentStatus: 'Fundação',
        statusDeadline: new Date('2024-05-15'),
        coverPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        geoLat: -20.7900,
        geoLng: -48.3350,
        metadata: { contractor: "Engenharia Silva", engineer: "Dra. Ana" }
    }
  ]

  for (const work of works) {
    await prisma.publicWork.upsert({
      where: { qrHash: work.qrHash },
      update: {},
      create: work
    })
  }

  console.log(` - Upserted ${works.length} Public Works.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
