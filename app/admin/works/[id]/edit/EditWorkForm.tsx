'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePublicWork, deletePublicWork } from '@/app/actions/admin/public-works'
import { Trash2 } from 'lucide-react'

export default function EditWorkForm({ work }: { work: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const data = {
        qrHash: formData.get('qrHash'),
        title: formData.get('title'),
        description: formData.get('description'),
        budgetValue: Number(formData.get('budgetValue')),
        deadlineDate: formData.get('deadlineDate'),
        currentStatus: formData.get('currentStatus'),
        statusDeadline: formData.get('statusDeadline'),
        coverPhotoUrl: formData.get('coverPhotoUrl'),
        geoLat: Number(formData.get('geoLat')),
        geoLng: Number(formData.get('geoLng')),
        metadata: work.metadata // Keep existing or update if UI allows
    }

    const res = await updatePublicWork(work.id, data)
    if (res.success) {
        router.push('/admin/works')
    } else {
        alert('Erro ao atualizar obra')
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.')) return

    setLoading(true)
    const res = await deletePublicWork(work.id)
    if (res.success) {
        router.push('/admin/works')
    } else {
        alert('Erro ao excluir obra')
        setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow relative">
        <button
            type="button"
            onClick={handleDelete}
            className="absolute top-6 right-6 text-red-500 hover:text-red-700 p-2"
        >
            <Trash2 size={20} />
        </button>

        <div>
            <label className="block text-sm font-bold mb-1">Título da Obra</label>
            <input name="title" defaultValue={work.title} required className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-bold mb-1">Slug/Hash (Único)</label>
            <input name="qrHash" defaultValue={work.qrHash} required className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-bold mb-1">Descrição</label>
            <textarea name="description" defaultValue={work.description || ''} className="w-full p-2 border rounded" rows={3}></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Orçamento (R$)</label>
                <input name="budgetValue" defaultValue={work.budgetValue} type="number" step="0.01" className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Prazo Final</label>
                <input name="deadlineDate" defaultValue={work.deadlineDate ? work.deadlineDate.split('T')[0] : ''} type="date" className="w-full p-2 border rounded" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Status Atual</label>
                <select name="currentStatus" defaultValue={work.currentStatus} className="w-full p-2 border rounded">
                    <option>Planejamento</option>
                    <option>Fundação</option>
                    <option>Alvenaria</option>
                    <option>Acabamento</option>
                    <option>Parada</option>
                    <option>Entregue</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Prazo da Fase</label>
                <input name="statusDeadline" defaultValue={work.statusDeadline ? work.statusDeadline.split('T')[0] : ''} type="date" className="w-full p-2 border rounded" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold mb-1">URL da Foto de Capa</label>
            <input name="coverPhotoUrl" defaultValue={work.coverPhotoUrl || ''} type="url" className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Latitude</label>
                <input name="geoLat" defaultValue={work.geoLat} type="number" step="any" className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Longitude</label>
                <input name="geoLng" defaultValue={work.geoLng} type="number" step="any" className="w-full p-2 border rounded" />
            </div>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
            {loading ? 'Salvando...' : 'Atualizar Obra'}
        </button>

    </form>
  )
}
