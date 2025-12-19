import { prisma } from '@/lib/db'
import { Plus } from 'lucide-react'
import Link from 'next/link'

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
                    <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(t.schema, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    )
}
