'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { encrypt } from '@/lib/auth'

// Helper to determine level based on points and verification
// Returns: { level: string, progress: number, nextLevelPoints: number }
export async function calculateLevel(points: number, verificationStatus: string) {
    if (verificationStatus !== 'APPROVED') {
        return {
            level: 'Cidadão',
            progress: 0,
            nextLevelPoints: 0
        }
    }

    if (points >= 300) {
        return { level: 'Conselheiro', progress: 100, nextLevelPoints: 300 }
    }
    if (points >= 150) {
        return {
            level: 'Autoridade',
            progress: ((points - 150) / (300 - 150)) * 100,
            nextLevelPoints: 300
        }
    }
    if (points >= 50) {
        return {
            level: 'Colaborador',
            progress: ((points - 50) / (150 - 50)) * 100,
            nextLevelPoints: 150
        }
    }

    return {
        level: 'Cidadão Verificado',
        progress: (points / 50) * 100,
        nextLevelPoints: 50
    }
}

export async function getProfile() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { pointsLedger: true }
  })

  if (!user) return null

  // Calculate total points
  const totalPoints = user.pointsLedger.reduce((acc, entry) => acc + entry.amount, 0)

  // Calculate "Real" Level based on current stats
  const { level: calculatedLevel, progress, nextLevelPoints } = await calculateLevel(totalPoints, user.verificationStatus)

  return {
    ...user,
    totalPoints,
    calculatedLevel, // Pass this to frontend to compare with user.levelTitle
    progress,
    nextLevelPoints
  }
}

export async function upgradeLevel() {
    const profile = await getProfile()
    if (!profile) return { success: false }

    // Update to the calculated level
    await prisma.user.update({
        where: { id: profile.id },
        data: { levelTitle: profile.calculatedLevel }
    })

    revalidatePath('/dashboard')
    return { success: true }
}

function validateCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
    let add = 0
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
    let rev = 11 - (add % 11)
    if (rev === 10 || rev === 11) rev = 0
    if (rev !== parseInt(cpf.charAt(9))) return false
    add = 0
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
    rev = 11 - (add % 11)
    if (rev === 10 || rev === 11) rev = 0
    if (rev !== parseInt(cpf.charAt(10))) return false
    return true
}

export async function submitVerification(formData: FormData) {
    const session = await getSession()
    if (!session) return { success: false, message: 'Unauthorized' }

    const fullName = formData.get('fullName') as string
    const cpf = formData.get('cpf') as string
    const street = formData.get('street') as string
    const number = formData.get('number') as string
    const zip = formData.get('zip') as string

    if (!cpf || !fullName || !street || !number || !zip) {
        return { success: false, message: 'Campos obrigatórios faltando.' }
    }

    if (!validateCPF(cpf)) {
        return { success: false, message: 'CPF Inválido.' }
    }

    // Check if CPF is unique (excluding current user)
    const existing = await prisma.user.findFirst({
        where: {
            cpf,
            id: { not: session.user.id }
        }
    })

    if (existing) {
        return { success: false, message: 'CPF já cadastrado.' }
    }

    // Update User
    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            fullName,
            cpf,
            addressStreet: street,
            addressNumber: number,
            addressZip: zip,
            city: 'Terra Roxa',
            state: 'SP',
            verificationStatus: 'PENDING'
        }
    })

    return { success: true, message: 'Enviado para análise' }
}

export async function getAsset(id: number) {
  return await prisma.asset.findUnique({
    where: { id },
    include: { assetType: true }
  })
}

export async function submitAction(formData: FormData) {
  const session = await getSession()
  if (!session) return { success: false, url: '/' }

  const assetId = parseInt(formData.get('assetId') as string)
  const ruleSlug = formData.get('ruleSlug') as string
  const evidenceUrl = formData.get('evidenceUrl') as string

  await prisma.userAction.create({
    data: {
      userId: session.user.id,
      assetId,
      ruleSlug,
      evidenceUrl,
      status: 'PENDING'
    }
  })

  return { success: true, url: '/dashboard' }
}

export async function submitAnonymousReport(formData: FormData) {
    const assetId = parseInt(formData.get('assetId') as string)
    const problemType = formData.get('problemType') as string
    const description = formData.get('description') as string
    const evidenceUrl = formData.get('evidenceUrl') as string

    const action = await prisma.userAction.create({
        data: {
            userId: null,
            assetId,
            ruleSlug: 'report_fix',
            evidenceUrl,
            status: 'PENDING',
            data: {
                problemType,
                description,
                isAnonymous: true
            }
        }
    })

    return { success: true, url: `/report/success/${action.id}` }
}

export async function submitReport(formData: FormData) {
    let session = await getSession()

    const phone = formData.get('phone') as string
    if (!session && phone) {
        let user = await prisma.user.findUnique({ where: { phone } })
        if (!user) {
            user = await prisma.user.create({
                data: { phone, role: 'USER' }
            })
        }
        const sessionToken = await encrypt({ user: { id: user.id, phone: user.phone, name: user.name, role: user.role } })
        const cookieStore = await cookies()
        cookieStore.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 315360000,
            path: '/'
        })
        session = { user: { id: user.id, phone: user.phone, role: user.role } } as any
    }

    if (!session) {
        return { success: false, url: '/' }
    }

    const assetId = parseInt(formData.get('assetId') as string)
    const problemType = formData.get('problemType') as string
    const description = formData.get('description') as string
    const evidenceUrl = formData.get('evidenceUrl') as string

    const action = await prisma.userAction.create({
        data: {
            userId: session.user.id,
            assetId,
            ruleSlug: 'report_fix',
            evidenceUrl,
            status: 'PENDING',
            data: {
                problemType,
                description
            }
        }
    })

    return { success: true, url: '/dashboard?success=report_submitted', actionId: action.id }
}

export async function getUserReports() {
    const session = await getSession()
    if (!session) return []

    return await prisma.userAction.findMany({
        where: {
            userId: session.user.id,
            ruleSlug: 'report_fix'
        },
        include: { asset: true },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getPendingActions() {
    const session = await getSession()
    // Admin Check
    if (!session || session.user.role !== 'ADMIN') return []

    return await prisma.userAction.findMany({
        where: { status: 'PENDING' },
        include: { user: true, asset: true, rule: true }
    })
}

export async function approveAction(actionId: number) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') return

    const action = await prisma.userAction.findUnique({
        where: { id: actionId },
        include: { rule: true }
    })

    if (!action || action.status !== 'PENDING') return

    // Update status
    await prisma.userAction.update({
        where: { id: actionId },
        data: { status: 'APPROVED' }
    })

    // Add points
    // If user is anonymous (userId is null), we don't award points yet.
    if (action.userId) {
        await prisma.pointsLedger.create({
            data: {
                userId: action.userId,
                actionId: action.id,
                amount: action.rule.points,
                description: `Ação: ${action.rule.slug}`
            }
        })
    }
}

// Admin Verification Actions
export async function getPendingVerifications() {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') return []

    return await prisma.user.findMany({
        where: { verificationStatus: 'PENDING' }
    })
}

export async function approveVerification(userId: number) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') return

    await prisma.user.update({
        where: { id: userId },
        data: { verificationStatus: 'APPROVED' }
    })
    revalidatePath('/admin/verifications')
}

export async function rejectVerification(userId: number, reason: string) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') return

    await prisma.user.update({
        where: { id: userId },
        data: {
            verificationStatus: 'REJECTED',
            rejectionReason: reason
        }
    })
    revalidatePath('/admin/verifications')
}
