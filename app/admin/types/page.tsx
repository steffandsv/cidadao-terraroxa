import { prisma } from '@/lib/db'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { DynamicIcon } from '@/app/components/icons/DynamicIcon'

export const dynamic = 'force-dynamic'

export default async function AssetTypesPage() {
    let types: any[] = []
    try {
        types = await prisma.assetType.findMany()
    } catch (e) { console.error(e) }

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Tipos de Patrimônio</h1>
                <Link
                    href="/admin/types/create"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Novo Tipo
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {types.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                                <DynamicIcon name={t.icon || 'box'} className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{t.name}</h3>
                        </div>

                        <div>
                             <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Schema de Problemas</h4>
                             <pre className="bg-gray-50 p-3 rounded-lg border text-xs overflow-x-auto text-gray-600 max-h-40">
                                {JSON.stringify(t.schema, null, 2)}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
