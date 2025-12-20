'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

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

  // Calculate Level
  let level = 'Novato'
  let progress = 0
  let nextLevel = 100

  if (totalPoints >= 500) {
    level = 'Lenda'
    progress = 100
    nextLevel = 500
  } else if (totalPoints >= 100) {
    level = 'Guardião'
    progress = ((totalPoints - 100) / (500 - 100)) * 100
    nextLevel = 500
  } else {
    progress = (totalPoints / 100) * 100
    nextLevel = 100
  }

  // Update level if changed
  if (user.levelTitle !== level) {
    await prisma.user.update({
      where: { id: user.id },
      data: { levelTitle: level }
    })
  }

  return { ...user, totalPoints, level, progress, nextLevel }
}

export async function getAsset(id: number) {
  return await prisma.asset.findUnique({
    where: { id },
    include: { assetType: true }
  })
}

export async function submitAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect('/')

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

  redirect('/dashboard')
}

export async function submitAnonymousReport(formData: FormData) {
    const assetId = parseInt(formData.get('assetId') as string)
    const problemType = formData.get('problemType') as string
    const description = formData.get('description') as string
    const evidenceUrl = formData.get('evidenceUrl') as string

    await prisma.userAction.create({
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

    // Return instead of redirecting
    return { success: true, url: '/dashboard?success=report_submitted_anon' }
}

export async function submitReport(formData: FormData) {
    let session = await getSession()

    // Check if phone was provided for auto-registration
    const phone = formData.get('phone') as string
    if (!session && phone) {
        // Find or Create User
        // Simplified flow: Just ensure user exists. In real app, trigger OTP here.
        let user = await prisma.user.findUnique({ where: { phone } })
        if (!user) {
            user = await prisma.user.create({
                data: { phone, role: 'USER' }
            })
        }
        // Create session-like context (In real app, we would set a cookie or redirect to OTP)
        // For now, we link the action to this user.
        // We will assume 'session' logic is handled by middleware/cookies mostly,
        // but here we just need the ID to link the action.
        session = { user: { id: user.id, phone: user.phone, role: user.role } } as any
    }

    if (!session) {
        // If still no session (shouldn't happen if phone is provided or anonymous used), redirect
        redirect('/')
    }

    const assetId = parseInt(formData.get('assetId') as string)
    const problemType = formData.get('problemType') as string
    const description = formData.get('description') as string
    const evidenceUrl = formData.get('evidenceUrl') as string

    // Create the UserAction with JSON data
    await prisma.userAction.create({
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

    // If it was a quick-signup, maybe redirect to OTP to claim account?
    // For this demo/task, just redirect to dashboard/success
    return { success: true, url: '/dashboard?success=report_submitted' }
}

export async function getPendingActions() {
    // Only for admin - simple check for now
    // In real app, check user role
    return await prisma.userAction.findMany({
        where: { status: 'PENDING' },
        include: { user: true, asset: true, rule: true }
    })
}

export async function approveAction(actionId: number) {
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
