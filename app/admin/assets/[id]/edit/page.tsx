import { prisma } from '@/lib/db'
import EditAssetForm from '@/app/components/admin/EditAssetForm'
import { notFound } from 'next/navigation'

export default async function EditAssetPage({ params }: { params: { id: string } }) {
    const asset = await prisma.asset.findUnique({
        where: { id: parseInt(params.id) }
    })

    const types = await prisma.assetType.findMany()

    if (!asset) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <EditAssetForm asset={asset} types={types} />
        </div>
    )
}
