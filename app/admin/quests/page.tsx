import { prisma } from '@/lib/db'

export default async function QuestsPage() {
    let rules: any[] = []
    try {
        rules = await prisma.gamificationRule.findMany()
    } catch (e) { console.error(e) }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Regras de Gamificação (Quests)</h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4">Slug (ID)</th>
                            <th className="px-6 py-4">Pontos</th>
                            <th className="px-6 py-4">Requer Aprovação?</th>
                            <th className="px-6 py-4">Ícone</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rules.map(rule => (
                            <tr key={rule.slug}>
                                <td className="px-6 py-4 font-mono">{rule.slug}</td>
                                <td className="px-6 py-4 text-emerald-600 font-bold">+{rule.points}</td>
                                <td className="px-6 py-4">
                                    {rule.requiresApproval ?
                                        <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs">Sim (Foto)</span> :
                                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">Não (Automático)</span>
                                    }
                                </td>
                                <td className="px-6 py-4">{rule.icon || '-'}</td>
                            </tr>
                        ))}
                         {rules.length === 0 && (
                            <tr><td colSpan={4} className="p-6 text-center text-gray-500">Nenhuma regra definida. Adicione via DB seed por enquanto.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p className="text-sm text-gray-500">Nota: A criação de novas regras pode ser feita via Seed ou Adicionar form aqui futuramente.</p>
        </div>
    )
}
