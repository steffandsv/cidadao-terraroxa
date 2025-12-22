import { prisma } from '@/lib/db'
import EditAssetTypeForm from '@/app/components/admin/EditAssetTypeForm'
import { notFound } from 'next/navigation'

export default async function EditAssetTypePage({ params }: { params: { id: string } }) {
    const type = await prisma.assetType.findUnique({
        where: { id: parseInt(params.id) }
    })

    if (!type) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <EditAssetTypeForm type={type} />
        </div>
    )
}
