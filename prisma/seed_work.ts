import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.publicWork.create({
    data: {
      title: 'Obra Teste Frontend',
      description: 'Uma obra para testar o popup',
      qrHash: 'test-hash-123',
      currentStatus: 'ANDAMENTO',
      geoLat: -21.0365,
      geoLng: -48.5135, // Center of default map
      progress: 50,
      coverPhotoUrl: 'https://placehold.co/600x400',
    }
  })
  console.log('Work created')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
