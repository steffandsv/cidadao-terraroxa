'use server'

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function createAssetType(formData: FormData) {
    const name = formData.get('name') as string
    // Simplified schema creation for now. In a real app, we'd have a UI builder.
    // For now we just default to allowing a "historical" text field or similar.
    // Or we can parse a JSON string if we provide a textarea.
    const schemaStr = formData.get('schema') as string

    let schema = {}
    try {
        if(schemaStr) schema = JSON.parse(schemaStr)
    } catch(e) {
        // invalid json
    }

    await prisma.assetType.create({
        data: {
            name,
            schema
        }
    })

    redirect('/admin/types')
}

export async function createAsset(formData: FormData) {
    const assetTypeId = parseInt(formData.get('assetTypeId') as string)
    const description = formData.get('description') as string
    const lat = formData.get('lat')
    const lng = formData.get('lng')

    // Dynamic fields
    const data: any = {}
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('data_')) {
            const realKey = key.replace('data_', '')
            data[realKey] = value
        }
    }

    if (!assetTypeId || !lat || !lng) {
        throw new Error("Missing required fields")
    }

    const hashCode = `ASSET-${Math.floor(1000 + Math.random() * 9000)}`

    await prisma.asset.create({
        data: {
            assetTypeId,
            description,
            hashCode,
            geoLat: parseFloat(lat.toString()),
            geoLng: parseFloat(lng.toString()),
            data
        }
    })

    redirect('/admin/assets')
}
