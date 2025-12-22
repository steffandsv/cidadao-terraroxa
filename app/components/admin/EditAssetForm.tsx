'use client'

import { useState } from 'react'
import { updateAsset } from '@/app/actions/admin/assets'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Map component must be dynamic
const MapPicker = dynamic(() => import('@/app/components/admin/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />
})

export default function EditAssetForm({ asset, types }: { asset: any, types: any[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        hashCode: asset.hashCode || '',
        description: asset.description || '',
        assetTypeId: asset.assetTypeId,
        geoLat: asset.geoLat ? Number(asset.geoLat) : 0,
        geoLng: asset.geoLng ? Number(asset.geoLng) : 0,
        data: asset.data || {}
    })

    // Helper to get schema for current type
    const currentType = types.find(t => t.id === Number(formData.assetTypeId))
    const schema = currentType?.schema || {}

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleDataChange = (key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            data: { ...prev.data as object, [key]: value }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const res = await updateAsset(asset.id, formData)
        setIsLoading(false)

        if (res.success) {
            router.push('/admin/assets')
            router.refresh()
        } else {
            alert('Error updating asset')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/assets" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">Editar Ativo #{asset.id}</h1>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
                >
                    <Save size={20} />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                         <h2 className="font-semibold text-lg">Informações Básicas</h2>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hash Code (QR)</label>
                            <input
                                type="text"
                                name="hashCode"
                                value={formData.hashCode}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono bg-gray-50"
                                readOnly // Hash code usually shouldn't change easily as it breaks QR codes
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ativo</label>
                            <select
                                name="assetTypeId"
                                value={formData.assetTypeId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {types.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Localização</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Dynamic Fields based on Schema */}
                    {/* Simplified for now, just a JSON editor could be enough or specific fields if schema is known */}
                    {/*
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h2 className="font-semibold text-lg">Dados Específicos</h2>
                        <p className="text-sm text-gray-500">Campos definidos pelo tipo do ativo.</p>
                         // Render dynamic inputs here if needed
                    </div>
                    */}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <h2 className="font-semibold text-lg">Localização Geográfica</h2>
                    <div className="h-[400px] rounded-lg overflow-hidden border">
                         <MapPicker
                            initialLat={formData.geoLat || -24.2323}
                            initialLng={formData.geoLng || -53.8407}
                            markerPosition={formData.geoLat && formData.geoLng ? [formData.geoLat, formData.geoLng] : null}
                            onSelect={(lat, lng) => {
                                setFormData(prev => ({
                                    ...prev,
                                    geoLat: lat,
                                    geoLng: lng
                                }))
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.geoLat}
                                onChange={(e) => setFormData(p => ({ ...p, geoLat: Number(e.target.value) }))}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.geoLng}
                                onChange={(e) => setFormData(p => ({ ...p, geoLng: Number(e.target.value) }))}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
