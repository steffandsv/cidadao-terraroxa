import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getMapConfig } from '@/app/actions/config'
import ClientMap from './ClientMap'

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  let assets: any[] = []
  let mapConfig = { lat: -21.0365, lng: -48.5135, zoom: 13 }

  try {
    mapConfig = await getMapConfig()
    const rawAssets = await prisma.asset.findMany({
      include: { assetType: true }
    })

    assets = rawAssets.map(a => ({
        ...a,
        geoLat: a.geoLat ? a.geoLat.toNumber() : null,
        geoLng: a.geoLng ? a.geoLng.toNumber() : null
    }))
  } catch(e) { console.error(e) }

  return (
    <ClientMap assets={assets} mapConfig={mapConfig} />
  )
}
