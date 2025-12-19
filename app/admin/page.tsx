import { getPendingActions, approveAction } from '@/app/actions/game'
import { Check } from 'lucide-react'

export default async function AdminPage() {
  const actions = await getPendingActions()

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Administração</h1>

      <div className="space-y-4">
        {actions.map((action: any) => (
            <div key={action.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                <div>
                    <p className="font-bold">{action.user.phone}</p>
                    <p className="text-sm text-gray-600">{action.ruleSlug} em {action.asset.type}</p>
                    <p className="text-xs text-gray-400">{new Date(action.createdAt).toLocaleString()}</p>
                </div>
                <form action={approveAction.bind(null, action.id)}>
                    <button className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600">
                        <Check />
                    </button>
                </form>
            </div>
        ))}
        {actions.length === 0 && (
            <p className="text-center text-gray-500">Nenhuma ação pendente.</p>
        )}
      </div>
    </main>
  )
}
