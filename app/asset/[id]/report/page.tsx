import { getAsset } from '@/app/actions/game'
import ReportForm from './ReportForm'

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Need to verify if include: { assetType: true } fetches the JSON schema correctly
  // Prisma types Json fields automatically as any/JsonValue
  const asset = await getAsset(parseInt(id))

  if (!asset) {
    return <div className="p-6">Patrimônio não encontrado.</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportar Problema</h1>
      <p className="text-gray-600 mb-6">{asset.description} (#{asset.hashCode})</p>

      <ReportForm asset={asset} />
    </main>
  )
}
