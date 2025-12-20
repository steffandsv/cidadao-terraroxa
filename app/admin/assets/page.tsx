import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Plus } from 'lucide-react'
import AssetActions from '@/app/components/admin/AssetActions'

export const dynamic = 'force-dynamic'

export default async function AssetsPage() {
  let assets: any[] = []
  try {
      assets = await prisma.asset.findMany({
        orderBy: { id: 'desc' }
      })
  } catch (e) {
      console.error(e)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Postes e Ativos</h1>
        <Link
            href="/admin/assets/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
            <Plus size={20} />
            Novo Ativo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Tipo</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Hash (QR)</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Descrição</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Localização</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {assets.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Nenhum ativo cadastrado.
                        </td>
                    </tr>
                ) : (
                    assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">#{asset.id}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {asset.type || 'Patrimônio'}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm">{asset.hashCode}</td>
                            <td className="px-6 py-4 text-gray-600">{asset.description}</td>
                            <td className="px-6 py-4 text-gray-500 text-sm">
                                {Number(asset.geoLat).toFixed(4)}, {Number(asset.geoLng).toFixed(4)}
                            </td>
                            <td className="px-6 py-4">
                                <AssetActions asset={asset} />
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}
