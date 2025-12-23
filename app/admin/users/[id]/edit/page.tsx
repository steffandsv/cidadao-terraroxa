import { prisma } from '@/lib/db'
import EditUserForm from '@/app/components/admin/EditUserForm'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) }
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <EditUserForm user={user} />
        </div>
    )
}
