'use server'

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function reviewAction(actionId: number, status: 'APPROVED' | 'REJECTED') {
    const action = await prisma.userAction.findUnique({
        where: { id: actionId },
        include: { rule: true }
    })

    if (!action || action.status !== 'PENDING') return

    await prisma.userAction.update({
        where: { id: actionId },
        data: { status }
    })

    if (status === 'APPROVED' && action.userId) {
        await prisma.pointsLedger.create({
            data: {
                userId: action.userId,
                actionId: action.id,
                amount: action.rule.points,
                description: `Aprovado: ${action.rule.slug}`
            }
        })
    }

    redirect('/admin/review')
}
