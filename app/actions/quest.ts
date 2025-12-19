'use server'

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function createQuest(formData: FormData) {
    const slug = formData.get('slug') as string
    const title = formData.get('title') as string
    const points = parseInt(formData.get('points') as string)
    const icon = formData.get('icon') as string

    const requiresLocation = formData.get('requiresLocation') === 'on'
    const requiresPhoto = formData.get('requiresPhoto') === 'on'
    const aiValidation = formData.get('aiValidation') === 'on'
    const aiPrompt = formData.get('aiPrompt') as string

    await prisma.gamificationRule.create({
        data: {
            slug,
            title,
            points,
            icon,
            requiresLocation,
            requiresPhoto,
            aiValidation,
            aiPrompt
        }
    })

    redirect('/admin/quests')
}
