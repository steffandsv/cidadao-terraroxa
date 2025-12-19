'use server'

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid' // Or just random string

export async function createAsset(formData: FormData) {
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const lat = formData.get('lat')
    const lng = formData.get('lng')

    if (!type || !lat || !lng) {
        throw new Error("Missing required fields")
    }

    // Generate Hash
    // Usually POSTE-XXXX or randomly generated UUID
    const hashCode = `POSTE-${Math.floor(1000 + Math.random() * 9000)}`

    await prisma.asset.create({
        data: {
            type,
            description,
            hashCode,
            geoLat: parseFloat(lat.toString()),
            geoLng: parseFloat(lng.toString())
        }
    })

    redirect('/admin/assets')
}
