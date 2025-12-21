import { prisma } from '@/lib/db'
import { reviewAction } from '@/app/actions/review'
import { Check, X, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
    let pendingActions: any[] = []
    try {
        pendingActions = await prisma.userAction.findMany({
            where: { status: 'PENDING' },
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
    } catch(e) { console.error(e) }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Revisão de Ações</h1>

            {pendingActions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                    <p className="text-gray-500">Nenhuma ação pendente de revisão.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingActions.map(action => (
                        <div key={action.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            {action.evidenceUrl && (
                                <div className="h-48 bg-gray-200 overflow-hidden relative group">
                                    <img src={action.evidenceUrl} alt="Prova" className="w-full h-full object-cover group-hover:scale-110 transition" />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-800 uppercase text-sm tracking-wide bg-gray-100 px-2 py-1 rounded">
                                        {action.rule.title || action.rule.slug}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(action.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                                    <MapPin size={14} />
                                    {action.asset ? `${action.asset.assetType?.name || 'Patrimônio'} #${action.asset.hashCode}` : 'Geral'}
                                </p>
                                <p className="text-xs text-gray-400 mb-4">
                                    Por: {action.user?.name || action.user?.phone || 'Anônimo'}
                                </p>

                                {/* Display Report Details if available */}
                                {action.data && (
                                    <div className="bg-orange-50 p-3 rounded-lg mb-4 text-sm border border-orange-100">
                                        <p className="font-bold text-orange-800">{action.data.problemType}</p>
                                        <p className="text-orange-700">{action.data.description}</p>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <form action={reviewAction.bind(null, action.id, 'APPROVED')} className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-2 rounded-lg hover:bg-emerald-200 transition text-sm font-bold">
                                            <Check size={18} /> Aprovar
                                        </button>
                                    </form>
                                    <form action={reviewAction.bind(null, action.id, 'REJECTED')} className="flex-1">
                                         <button className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition text-sm font-bold">
                                            <X size={18} /> Rejeitar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
