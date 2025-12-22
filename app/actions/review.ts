'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function reviewAction(actionId: number, status: string, feedback?: string) {
    const action = await prisma.userAction.findUnique({
        where: { id: actionId },
        include: { rule: true }
    })

    if (!action) return

    // Prevent re-approving if already approved (to avoid double points)
    // But allow changing FROM approved to something else (points might remain? or should we revert? keeping simple for now)
    // If status is APPROVED and it wasn't approved before, give points.
    const wasApproved = action.status === 'APPROVED'
    const isApproving = status === 'APPROVED'

    await prisma.userAction.update({
        where: { id: actionId },
        data: { status, feedback }
    })

    if (isApproving && !wasApproved && action.userId) {
        await prisma.pointsLedger.create({
            data: {
                userId: action.userId,
                actionId: action.id,
                amount: action.rule.points,
                description: `Aprovado: ${action.rule.slug}`
            }
        })
    }

    revalidatePath('/admin/review')
    revalidatePath('/dashboard')
}
