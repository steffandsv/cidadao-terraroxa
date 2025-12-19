import { getAsset, submitAction } from '@/app/actions/game'
import { redirect } from 'next/navigation'
import { CheckCircle, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const asset = await getAsset(parseInt(id))

  // If asset doesn't exist, use a placeholder for demo purposes if DB is empty
  const displayAsset = asset ? {
    ...asset,
    type: (asset as any).assetType?.name || 'Patrimônio',
    historicalPhotoUrl: (asset.data as any)?.historicalPhotoUrl || null
  } : {
    id: parseInt(id),
    type: 'Patrimônio',
    hashCode: `POSTE-${id}`,
    description: 'Poste de iluminação padrão.',
    historicalPhotoUrl: null
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <h1 className="text-3xl font-black text-gray-900 mb-2">{displayAsset.type} #{displayAsset.hashCode}</h1>
      <p className="text-gray-600 text-lg mb-6">{displayAsset.description}</p>

      {displayAsset.historicalPhotoUrl && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
              <img src={displayAsset.historicalPhotoUrl} alt="Foto Histórica" className="w-full h-auto" />
              <p className="bg-yellow-100 p-2 text-yellow-800 text-center text-sm font-bold">Foto Histórica</p>
          </div>
      )}

      <div className="space-y-4 flex-1">
        <form action={submitAction}>
            <input type="hidden" name="assetId" value={displayAsset.id} />
            <input type="hidden" name="ruleSlug" value="visit" />
            <button className="w-full bg-green-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4 active:scale-95 transition-transform">
                <CheckCircle className="w-12 h-12" />
                <div className="text-left">
                    <div className="text-2xl font-bold">Confirmar Presença</div>
                    <div className="opacity-90">+10 Pontos</div>
                </div>
            </button>
        </form>

        <form action={submitAction}>
            <input type="hidden" name="assetId" value={displayAsset.id} />
            <input type="hidden" name="ruleSlug" value="report_fix" />
            <button className="w-full bg-orange-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4 active:scale-95 transition-transform">
                <AlertTriangle className="w-12 h-12" />
                <div className="text-left">
                    <div className="text-2xl font-bold">Reportar Problema</div>
                    <div className="opacity-90">+50 Pontos (após análise)</div>
                </div>
            </button>
        </form>
      </div>

      <a href="/dashboard" className="mt-8 block text-center text-gray-500 font-bold p-4">
        Voltar para o Início
      </a>
    </main>
  )
}
