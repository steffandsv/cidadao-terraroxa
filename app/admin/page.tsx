import { prisma } from '@/lib/db'
// I don't have shadcn components. I'll build raw tailwind.

async function getStats() {
  // If DB is unreachable, this will fail. I'll wrap in try/catch for the demo to not crash.
  try {
    const userCount = await prisma.user.count()
    const assetCount = await prisma.asset.count()
    const actionCount = await prisma.userAction.count({ where: { status: 'APPROVED' } })
    const pendingCount = await prisma.userAction.count({ where: { status: 'PENDING' } })

    return {
        userCount,
        assetCount,
        actionCount,
        pendingCount
    }
  } catch (e) {
      console.error("DB Error", e)
      return { userCount: 0, assetCount: 0, actionCount: 0, pendingCount: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Usuários" value={stats.userCount} color="bg-blue-500" />
        <StatCard title="Postes/Ativos" value={stats.assetCount} color="bg-emerald-500" />
        <StatCard title="Ações Realizadas" value={stats.actionCount} color="bg-purple-500" />
        <StatCard title="Pendentes de Revisão" value={stats.pendingCount} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
            <div className="text-gray-500 text-center py-10">
                Gráfico de atividade (Simulado)
            </div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Top Cidadãos</h2>
            <div className="text-gray-500 text-center py-10">
                Lista de líderes (Simulado)
            </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`w-3 h-full ${color} rounded-r absolute right-0 top-0 bottom-0 w-1`}></div>
        </div>
    )
}
