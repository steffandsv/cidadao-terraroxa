import { prisma } from '@/lib/db'
import UserActions from '@/app/components/admin/UserActions'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  let users: any[] = []
  try {
      users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { actions: true } } }
      })
  } catch (e) { console.error(e) }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4">Nível</th>
                    <th className="px-6 py-4">Ações</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-right">Menu</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {users.map(user => {
                    // Determine Name to display
                    // If fullName exists (from verification), use first + second name
                    // Else use user.name
                    let displayName = user.name || '-'
                    if (user.fullName) {
                        const parts = user.fullName.split(' ')
                        if (parts.length >= 2) {
                            displayName = `${parts[0]} ${parts[1]}`
                        } else {
                            displayName = parts[0]
                        }
                    }

                    return (
                        <tr key={user.id} className={user.verificationStatus === 'PENDING' ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4">
                                {user.verificationStatus === 'APPROVED' && <CheckCircle className="text-green-500" size={20} />}
                                {user.verificationStatus === 'REJECTED' && <XCircle className="text-red-500" size={20} />}
                                {user.verificationStatus === 'PENDING' && <AlertTriangle className="text-yellow-500" size={20} />}
                                {user.verificationStatus === 'NONE' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                            </td>
                            <td className="px-6 py-4">#{user.id}</td>
                            <td className="px-6 py-4 font-medium">
                                {displayName}
                                {user.fullName && user.fullName !== displayName && (
                                    <div className="text-xs text-gray-400 font-normal">{user.fullName}</div>
                                )}
                            </td>
                            <td className="px-6 py-4">{user.phone}</td>
                            <td className="px-6 py-4">
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                                    {user.levelTitle}
                                </span>
                            </td>
                            <td className="px-6 py-4">{user._count.actions}</td>
                             <td className="px-6 py-4">
                                <span className={user.role === 'ADMIN' ? 'text-red-600 font-bold' : 'text-gray-600'}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <UserActions user={user} />
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
      </div>
    </div>
  )
}
