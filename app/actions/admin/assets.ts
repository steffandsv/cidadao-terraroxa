'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateAsset(id: number, data: any) {
    try {
        await prisma.asset.update({
            where: { id },
            data: {
                hashCode: data.hashCode,
                description: data.description,
                assetTypeId: parseInt(data.assetTypeId),
                // Only update geo if provided and valid
                ...(data.geoLat && data.geoLng ? {
                    geoLat: parseFloat(data.geoLat),
                    geoLng: parseFloat(data.geoLng)
                } : {}),
                data: data.data // Asset specific data
            }
        })
        revalidatePath('/admin/assets')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to update asset' }
    }
}

export async function deleteAsset(id: number) {
    try {
        await prisma.asset.delete({
            where: { id }
        })
        revalidatePath('/admin/assets')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to delete asset' }
    }
}
