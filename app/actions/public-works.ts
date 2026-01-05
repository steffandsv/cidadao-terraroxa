'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Fetch all public works
export async function getPublicWorks() {
  const works = await prisma.publicWork.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Serialize Decimals and Dates
  return works.map(work => ({
    ...work,
    budgetValue: work.budgetValue ? Number(work.budgetValue) : 0,
    geoLat: work.geoLat ? Number(work.geoLat) : null,
    geoLng: work.geoLng ? Number(work.geoLng) : null,
    deadlineDate: work.deadlineDate ? work.deadlineDate.toISOString() : null,
    statusDeadline: work.statusDeadline ? work.statusDeadline.toISOString() : null,
    createdAt: work.createdAt.toISOString(),
    updatedAt: work.updatedAt.toISOString(),
  }))
}

// Fetch a single public work by ID
export async function getPublicWorkById(id: number) {
  const work = await prisma.publicWork.findUnique({
    where: { id },
    include: {
        inspections: {
            where: { adminStatus: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }
    }
  })

  if (!work) return null

  return {
    ...work,
    budgetValue: work.budgetValue ? Number(work.budgetValue) : 0,
    geoLat: work.geoLat ? Number(work.geoLat) : null,
    geoLng: work.geoLng ? Number(work.geoLng) : null,
    deadlineDate: work.deadlineDate ? work.deadlineDate.toISOString() : null,
    statusDeadline: work.statusDeadline ? work.statusDeadline.toISOString() : null,
    createdAt: work.createdAt.toISOString(),
    updatedAt: work.updatedAt.toISOString(),
    inspections: work.inspections.map(i => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
    }))
  }
}

// Submit an inspection
export async function submitInspection(formData: FormData) {
  const workId = Number(formData.get('workId'))
  const userIdStr = formData.get('userId')
  const userId = userIdStr ? Number(userIdStr) : null
  const ratingSentiment = formData.get('ratingSentiment') as string
  const reportText = formData.get('reportText') as string
  const photoEvidenceUrl = formData.get('photoEvidenceUrl') as string
  const progressEstimate = formData.get('progressEstimate') ? Number(formData.get('progressEstimate')) : null
  const lat = formData.get('lat') ? Number(formData.get('lat')) : null
  const lng = formData.get('lng') ? Number(formData.get('lng')) : null

  if (!workId || !ratingSentiment) {
    return { success: false, message: 'Dados incompletos.' }
  }

  // Double check geolocation distance on server side (Haversine)
  // We need the work's coordinates
  const work = await prisma.publicWork.findUnique({ where: { id: workId } })
  if (!work || !work.geoLat || !work.geoLng) {
      return { success: false, message: 'Obra não encontrada ou sem localização.' }
  }

  // If user provided location, check distance
  let isVerifiedLoc = false
  if (lat && lng) {
      const dist = getDistanceFromLatLonInKm(lat, lng, Number(work.geoLat), Number(work.geoLng))
      // 50 meters = 0.05 km
      if (dist <= 0.05) {
          isVerifiedLoc = true
      }
  }

  // If not verified location, we might still accept it but maybe flag it?
  // The requirements say: "TRUE obrigatório para pontuar". So we save it, but maybe adminStatus depends on it?
  // Or we just save `isVerifiedLoc` and let admin decide.

  try {
    const inspection = await prisma.workInspection.create({
      data: {
        workId,
        userId,
        ratingSentiment,
        reportText,
        progressEstimate,
        photoEvidenceUrl,
        isVerifiedLoc,
        adminStatus: 'PENDING'
      }
    })

    revalidatePath(`/obras/${workId}`)
    return { success: true, inspectionId: inspection.id }
  } catch (error) {
    console.error('Error submitting inspection:', error)
    return { success: false, message: 'Erro ao salvar vistoria.' }
  }
}

// Haversine formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}
