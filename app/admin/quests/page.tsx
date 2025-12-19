import { prisma } from '@/lib/db'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function QuestsPage() {
    let rules: any[] = []
    try {
        rules = await prisma.gamificationRule.findMany()
    } catch (e) { console.error(e) }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Missões (Quests)</h1>
                <Link
                    href="/admin/quests/create"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Nova Missão
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4">Título</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Pontos</th>
                            <th className="px-6 py-4">Requisitos</th>
                            <th className="px-6 py-4">IA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rules.map(rule => (
                            <tr key={rule.slug}>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <span>{rule.icon}</span>
                                    <span className="font-semibold">{rule.title || rule.slug}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-gray-500">{rule.slug}</td>
                                <td className="px-6 py-4 text-emerald-600 font-bold">+{rule.points}</td>
                                <td className="px-6 py-4 space-x-1">
                                    {rule.requiresLocation && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Loc</span>}
                                    {rule.requiresPhoto && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">Foto</span>}
                                </td>
                                <td className="px-6 py-4">
                                    {rule.aiValidation ?
                                        <span className="text-green-600 font-bold text-xs">Ativo</span> :
                                        <span className="text-gray-400 text-xs">-</span>
                                    }
                                </td>
                            </tr>
                        ))}
                         {rules.length === 0 && (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhuma regra definida.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
