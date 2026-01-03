'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPublicWork } from '@/app/actions/admin/public-works'
import { v4 as uuidv4 } from 'uuid'
import ImageUpload from '@/app/components/admin/ImageUpload'
import dynamic from 'next/dynamic'

// Import MapPicker dynamically to avoid SSR issues
const MapPicker = dynamic(() => import('@/app/components/admin/MapPicker'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg">Carregando mapa...</div>
})

export default function NewWorkPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [geoLat, setGeoLat] = useState<number | null>(null)
  const [geoLng, setGeoLng] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

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
        coverPhotoUrl: photoUrl,
        geoLat: geoLat,
        geoLng: geoLng,
        progress: Number(progress),
        metadata: {}
    }

    const res = await createPublicWork(data)
    if (res.success) {
        router.push('/admin/works')
    } else {
        alert('Erro ao criar obra')
    }
    setLoading(false)
  }

  const generatedHash = uuidv4().substring(0, 8)

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Nova Obra Pública</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow max-w-2xl">
            <div>
                <label className="block text-sm font-bold mb-1">Título da Obra</label>
                <input name="title" required className="w-full p-2 border rounded" />
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">Slug/Hash (Único)</label>
                <input name="qrHash" defaultValue={generatedHash} required className="w-full p-2 border rounded" />
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
                <label className="block text-sm font-bold mb-1">Progresso: {progress}%</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            <ImageUpload
                label="Foto de Capa"
                value={photoUrl}
                onChange={setPhotoUrl}
            />

            <div>
                <label className="block text-sm font-bold mb-2">Localização</label>
                <div className="border rounded-lg overflow-hidden">
                    <MapPicker
                        onSelect={(lat, lng) => {
                            setGeoLat(lat)
                            setGeoLng(lng)
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <input name="geoLat" value={geoLat || ''} readOnly className="p-2 border rounded bg-gray-50 text-sm" placeholder="Latitude" />
                    <input name="geoLng" value={geoLng || ''} readOnly className="p-2 border rounded bg-gray-50 text-sm" placeholder="Longitude" />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
                {loading ? 'Criando...' : 'Criar Obra'}
            </button>
        </form>
    </div>
  )
}
