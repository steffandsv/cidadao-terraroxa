'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Fetch all inspections for admin
export async function getInspections(filter: string = 'PENDING') {
  const inspections = await prisma.workInspection.findMany({
    where: { adminStatus: filter },
    include: {
      work: true,
      user: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return inspections.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    work: {
      ...i.work,
      budgetValue: Number(i.work.budgetValue),
      geoLat: Number(i.work.geoLat),
      geoLng: Number(i.work.geoLng),
      deadlineDate: i.work.deadlineDate ? i.work.deadlineDate.toISOString() : null,
      statusDeadline: i.work.statusDeadline ? i.work.statusDeadline.toISOString() : null,
      createdAt: i.work.createdAt.toISOString(),
      updatedAt: i.work.updatedAt.toISOString(),
    },
    user: i.user ? {
        ...i.user,
        createdAt: i.user.createdAt.toISOString()
    } : null
  }))
}

// Approve/Reject Inspection
export async function updateInspectionStatus(id: number, status: 'APPROVED' | 'REJECTED', pointsToAdd: number = 0) {
  try {
    const inspection = await prisma.workInspection.update({
      where: { id },
      data: {
        adminStatus: status,
        pointsAwarded: status === 'APPROVED' ? pointsToAdd : 0
      },
      include: { user: true }
    })

    // Add points to user if approved
    if (status === 'APPROVED' && pointsToAdd > 0 && inspection.userId) {
      await prisma.pointsLedger.create({
        data: {
          userId: inspection.userId,
          amount: pointsToAdd,
          description: `Vistoria aprovada: Obra #${inspection.workId}`
        }
      })

      // Update User level logic could be here, or triggered via DB trigger/another service.
      // For now we just record the ledger.
    }

    revalidatePath('/admin/works/inspections')
    return { success: true }
  } catch (error) {
    console.error('Error updating inspection:', error)
    return { success: false, message: 'Erro ao atualizar status.' }
  }
}

// CRUD for Public Works
export async function createPublicWork(data: any) {
    // Implementation for creating public work
    // Ensure decimal fields are converted
    try {
        await prisma.publicWork.create({
            data: {
                ...data,
                budgetValue: data.budgetValue,
                geoLat: data.geoLat,
                geoLng: data.geoLng,
                deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
                statusDeadline: data.statusDeadline ? new Date(data.statusDeadline) : null,
            }
        })
        revalidatePath('/admin/works')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}

export async function updatePublicWork(id: number, data: any) {
     try {
        await prisma.publicWork.update({
            where: { id },
            data: {
                ...data,
                budgetValue: data.budgetValue,
                geoLat: data.geoLat,
                geoLng: data.geoLng,
                deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
                statusDeadline: data.statusDeadline ? new Date(data.statusDeadline) : null,
            }
        })
        revalidatePath('/admin/works')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}

export async function deletePublicWork(id: number) {
    try {
        await prisma.publicWork.delete({ where: { id } })
        revalidatePath('/admin/works')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}
