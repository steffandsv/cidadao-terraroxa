import { prisma } from '@/lib/db'
import CreateAssetForm from '@/app/components/admin/CreateAssetForm'
import { getMapConfig } from '@/app/actions/config'

export default async function Page() {
    let types: any[] = []
    let mapConfig = { lat: -21.0365, lng: -48.5135, zoom: 13 }
    try {
        types = await prisma.assetType.findMany()
        mapConfig = await getMapConfig()
    } catch(e) {}

    return <CreateAssetForm types={types} mapConfig={mapConfig} />
}
