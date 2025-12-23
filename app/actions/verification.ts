'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function verifyAction(userActionId: number, score: number, details?: string) {
    const session = await getSession()
    if (!session) {
        return { success: false, message: 'Você precisa estar logado para verificar.' }
    }

    const action = await prisma.userAction.findUnique({
        where: { id: userActionId },
        include: { rule: true }
    })

    if (!action) {
        return { success: false, message: 'Indicação não encontrada.' }
    }

    // Prevent duplicate verification by the same user?
    // The prompt says "Toda vez que o cidadão enviar...". The original reporter votes.
    // The prompt says "Outros cidadãos poderão abrir... e receberão popup".
    // Does not explicitly forbid changing vote, but usually one vote per user per action.
    const existing = await prisma.actionVerification.findFirst({
        where: {
            userActionId,
            userId: session.user.id
        }
    })

    if (existing) {
        // Update existing vote? Or block?
        // "Se marcarem 'Sim' ele direcionará para a mesma tela...".
        // Let's allow updating the vote.
        await prisma.actionVerification.update({
            where: { id: existing.id },
            data: {
                score,
                details: details || null,
                createdAt: new Date() // Update timestamp to show latest activity? Or keep original? Prompt says "data e hora do envio". Usually latest.
            }
        })
        // No new points for updating? Or abuse risk. Let's only give points on creation.
        return { success: true, message: 'Sua opinião foi atualizada.' }
    }

    // Create Verification
    await prisma.actionVerification.create({
        data: {
            userActionId,
            userId: session.user.id,
            score,
            details: details || null
        }
    })

    // Award Points (5 points)
    // Using logic similar to game.ts approveAction, but specific to verification
    await prisma.pointsLedger.create({
        data: {
            userId: session.user.id,
            actionId: userActionId, // Link to the action being verified? Or null?
            // "Ajuda com review irá gerar 5 pontos".
            amount: 5,
            description: `Review da Indicação #${userActionId}`
        }
    })

    // Revalidate
    revalidatePath('/map')
    revalidatePath(`/asset/${action.assetId}/report`)
    revalidatePath('/dashboard')

    return { success: true, message: 'Sua opinião foi registrada e priorizada. O Prefeito confia no seu julgamento.' }
}
