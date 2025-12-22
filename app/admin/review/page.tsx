import { prisma } from '@/lib/db'
import ReviewManagement from './components/ReviewManagement'
import { getMapConfig } from '@/app/actions/config'

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
    let reviews: any[] = []
    let assetTypes: any[] = []
    let mapConfig = { lat: -21.0365, lng: -48.5135, zoom: 13 }
    try {
        mapConfig = await getMapConfig()

        const rawReviews = await prisma.userAction.findMany({
            // Removed status filter to show all history
            include: {
                user: true,
                rule: true,
                asset: {
                    include: {
                        assetType: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Serialize Date and Decimal fields
        reviews = rawReviews.map(r => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            asset: r.asset ? {
                ...r.asset,
                geoLat: r.asset.geoLat ? r.asset.geoLat.toNumber() : null,
                geoLng: r.asset.geoLng ? r.asset.geoLng.toNumber() : null
            } : null
        }))

        assetTypes = await prisma.assetType.findMany()
    } catch(e) { console.error(e) }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Revisões</h1>
                <p className="text-gray-500">Visualize e gerencie os reportes dos cidadãos.</p>
            </div>

            <ReviewManagement initialReviews={reviews} assetTypes={assetTypes} mapConfig={mapConfig} />
        </div>
    )
}
