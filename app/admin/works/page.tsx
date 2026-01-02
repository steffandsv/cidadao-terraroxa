import Link from 'next/link'
import { getPublicWorks } from '@/app/actions/public-works'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default async function AdminWorksPage() {
  const works = await getPublicWorks()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Obras Públicas</h1>
        <div className="flex gap-2">
            <Link
              href="/admin/works/inspections"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700"
            >
              Validar Vistorias
            </Link>
            <Link
              href="/admin/works/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} /> Nova Obra
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Obra</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Prazo</th>
              <th className="text-left p-4">Progresso</th>
              <th className="text-right p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {works.map((work: any) => (
              <tr key={work.id}>
                <td className="p-4">
                  <div className="font-bold">{work.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{work.description}</div>
                </td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                    {work.currentStatus}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {work.deadlineDate ? new Date(work.deadlineDate).toLocaleDateString() : '-'}
                </td>
                <td className="p-4 text-sm">
                   {/* Calc progress rough estimate */}
                   <div className="w-24 bg-gray-200 rounded-full h-2">
                     <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                   </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/works/${work.id}/edit`} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                      <Edit size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {works.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                        Nenhuma obra cadastrada.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
