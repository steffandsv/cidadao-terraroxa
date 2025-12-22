'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUser(id: number, data: any) {
    try {
        await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                role: data.role,
                levelTitle: data.levelTitle,
                verificationStatus: data.verificationStatus,
                fullName: data.fullName,
                cpf: data.cpf,
                addressStreet: data.addressStreet,
                addressNumber: data.addressNumber,
                addressZip: data.addressZip,
                city: data.city,
                state: data.state,
                rejectionReason: data.rejectionReason,
            }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to update user' }
    }
}

export async function banUser(id: number) {
    try {
        await prisma.user.update({
            where: { id },
            data: { role: 'BANNED' }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to ban user' }
    }
}

export async function deleteUser(id: number) {
    try {
        // Warning: cascading deletes might be needed if not handled by DB
        await prisma.user.delete({
            where: { id }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to delete user' }
    }
}
