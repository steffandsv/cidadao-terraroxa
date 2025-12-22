import { prisma } from '../lib/db'
import { encrypt } from '../lib/auth'

async function generateSession() {
    // Create or update user for Cidadão Verified test
    const user = await prisma.user.upsert({
        where: { phone: '1234567890' },
        update: {
            verificationStatus: 'NONE',
            levelTitle: 'Cidadão',
            fullName: 'Test User'
        },
        create: {
            phone: '1234567890',
            name: 'Test User',
            verificationStatus: 'NONE',
            levelTitle: 'Cidadão'
        }
    })

    const token = await encrypt({
        user: { id: user.id, phone: user.phone, name: user.name, role: user.role }
    })

    console.log('SESSION_TOKEN=' + token)

    // Also ensure we have a 'Conselheiro' user for level up test
    // We create a user with many points but old level title
    const userUp = await prisma.user.upsert({
        where: { phone: '9999999999' },
        update: {
             verificationStatus: 'APPROVED',
             levelTitle: 'Cidadão', // Old level
             // We need to add points, but points are calculated from ledger.
             // We'll add a ledger entry.
        },
        create: {
            phone: '9999999999',
            verificationStatus: 'APPROVED',
            levelTitle: 'Cidadão'
        }
    })

    // Add points
    await prisma.pointsLedger.create({
        data: {
            userId: userUp.id,
            amount: 500,
            description: 'Massive Points'
        }
    })

     const tokenUp = await encrypt({
        user: { id: userUp.id, phone: userUp.phone, name: userUp.name, role: userUp.role }
    })
    console.log('UPGRADE_TOKEN=' + tokenUp)
}

generateSession().catch(console.error)
