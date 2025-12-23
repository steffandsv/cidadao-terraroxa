import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getMapConfig } from '@/app/actions/config'
import { getSession } from '@/lib/auth'
import ClientMap from './ClientMap'

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  let actions: any[] = []
  let mapConfig = { lat: -21.0365, lng: -48.5135, zoom: 13 }
  const session = await getSession()

  try {
    mapConfig = await getMapConfig()
    // Fetch UserActions that are PENDING or APPROVED (active reports)
    // Linked to Assets
    const rawActions = await prisma.userAction.findMany({
        where: {
            ruleSlug: 'report_fix', // Only reports
            status: { in: ['PENDING', 'APPROVED'] } // Active
        },
        include: {
            asset: { include: { assetType: true } },
            verifications: true,
            user: true
        }
    })

    // Transform Decimal to Number for client
    actions = rawActions.map(action => ({
        ...action,
        asset: action.asset ? {
            ...action.asset,
            geoLat: action.asset.geoLat ? Number(action.asset.geoLat) : null,
            geoLng: action.asset.geoLng ? Number(action.asset.geoLng) : null
        } : null
    })).filter(a => a.asset && a.asset.geoLat && a.asset.geoLng)

  } catch(e) { console.error(e) }

  return (
    <ClientMap actions={actions} mapConfig={mapConfig} user={session?.user} />
  )
}
