'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateAssetType(id: number, data: any) {
    try {
        await prisma.assetType.update({
            where: { id },
            data: {
                name: data.name,
                icon: data.icon,
                schema: data.schema ? JSON.parse(data.schema) : undefined
            }
        })
        revalidatePath('/admin/types')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to update asset type' }
    }
}

export async function deleteAssetType(id: number) {
    try {
        // Check for assets using this type
        const count = await prisma.asset.count({ where: { assetTypeId: id } })
        if (count > 0) {
            return { success: false, error: 'Cannot delete type with associated assets' }
        }

        await prisma.assetType.delete({
            where: { id }
        })
        revalidatePath('/admin/types')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to delete asset type' }
    }
}
