'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getConfig(key: string) {
    const config = await prisma.config.findUnique({
        where: { key }
    })
    return config?.value
}

export async function setConfig(key: string, value: any) {
    await prisma.config.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    })
    revalidatePath('/admin/settings')
    revalidatePath('/map')
    revalidatePath('/admin/review')
}

export async function getMapConfig() {
    const config = await getConfig('MAP_DEFAULT')
    // Default to Terra Roxa
    return (config as any) || { lat: -21.0365, lng: -48.5135, zoom: 13 }
}
