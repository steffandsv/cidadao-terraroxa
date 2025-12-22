import { prisma } from '@/lib/db'
import EditUserForm from '@/app/components/admin/EditUserForm'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(params.id) }
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
