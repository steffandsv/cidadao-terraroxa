'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPublicWork } from '@/app/actions/admin/public-works'

export default function NewWorkPage() {
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
        metadata: {} // Allow adding meta later
    }

    const res = await createPublicWork(data)
    if (res.success) {
        router.push('/admin/works')
    } else {
        alert('Erro ao criar obra')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Nova Obra</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">

        <div>
            <label className="block text-sm font-bold mb-1">Título da Obra</label>
            <input name="title" required className="w-full p-2 border rounded" />
        </div>

        <div>
            <label className="block text-sm font-bold mb-1">Slug/Hash (Único)</label>
            <input name="qrHash" required className="w-full p-2 border rounded" placeholder="ex: reforma-praca-central" />
        </div>

        <div>
            <label className="block text-sm font-bold mb-1">Descrição</label>
            <textarea name="description" className="w-full p-2 border rounded" rows={3}></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Orçamento (R$)</label>
                <input name="budgetValue" type="number" step="0.01" className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Prazo Final</label>
                <input name="deadlineDate" type="date" className="w-full p-2 border rounded" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Status Atual</label>
                <select name="currentStatus" className="w-full p-2 border rounded">
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
                <input name="statusDeadline" type="date" className="w-full p-2 border rounded" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold mb-1">URL da Foto de Capa</label>
            <input name="coverPhotoUrl" type="url" className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Latitude</label>
                <input name="geoLat" type="number" step="any" className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Longitude</label>
                <input name="geoLng" type="number" step="any" className="w-full p-2 border rounded" />
            </div>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
            {loading ? 'Salvando...' : 'Cadastrar Obra'}
        </button>

      </form>
    </div>
  )
}
