import { prisma } from '@/lib/db'
import CreateAssetForm from '@/app/components/admin/CreateAssetForm'

export default async function Page() {
    let types: any[] = []
    try {
        types = await prisma.assetType.findMany()
    } catch(e) {}

    return <CreateAssetForm types={types} />
}
