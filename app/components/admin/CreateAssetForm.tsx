'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createAsset } from '@/app/actions/admin'

const MapPicker = dynamic(() => import('@/app/components/admin/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Carregando Mapa...</div>
})

export default function CreateAssetPage({ types, mapConfig }: { types: any[], mapConfig: any }) {
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [schema, setSchema] = useState<any>(null)

  useEffect(() => {
      if(selectedType) {
          const t = types.find(x => x.id === Number(selectedType))
          setSchema(t?.schema)
      }
  }, [selectedType, types])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Cadastrar Novo Patrimônio</h1>

      <form action={createAsset} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização (Clique no mapa)</label>
            <div className="border rounded-lg overflow-hidden">
                <MapPicker
                    onSelect={(l, lg) => { setLat(l); setLng(lg) }}
                    initialLat={mapConfig.lat}
                    initialLng={mapConfig.lng}
                    initialZoom={mapConfig.zoom}
                />
            </div>
            <input type="hidden" name="lat" value={lat || ''} />
            <input type="hidden" name="lng" value={lng || ''} />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Patrimônio</label>
            <select
                name="assetTypeId"
                className="w-full border rounded-lg px-3 py-2 bg-white"
                required
                onChange={(e) => setSelectedType(Number(e.target.value))}
            >
                <option value="">Selecione...</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea name="description" rows={3} className="w-full border rounded-lg px-3 py-2" placeholder="Descrição geral..."></textarea>
        </div>

        {/* Dynamic Fields */}
        {schema && schema.fields && schema.fields.map((field: any, idx: number) => (
            <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label || field.name}</label>
                <input
                    name={`data_${field.name}`}
                    type={field.type || 'text'}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder={field.placeholder}
                />
            </div>
        ))}

        <div className="pt-4 flex justify-end gap-3">
            <button
                type="submit"
                disabled={!lat || !selectedType}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Salvar Patrimônio
            </button>
        </div>
      </form>
    </div>
  )
}
