'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { createAsset } from '@/app/actions/admin'

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('@/app/components/admin/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Carregando Mapa...</div>
})

export default function CreateAssetPage() {
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Cadastrar Novo Ativo</h1>

      <form action={createAsset} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização (Clique no mapa)</label>
            <div className="border rounded-lg overflow-hidden">
                <MapPicker onSelect={(l, lg) => { setLat(l); setLng(lg) }} />
            </div>
            {lat && lng && (
                <p className="text-sm text-emerald-600 mt-2">
                    Selecionado: {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
            )}
            <input type="hidden" name="lat" value={lat || ''} />
            <input type="hidden" name="lng" value={lng || ''} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ativo</label>
                <select name="type" className="w-full border rounded-lg px-3 py-2 bg-white" required>
                    <option value="Poste">Poste de Luz</option>
                    <option value="Praca">Praça Pública</option>
                    <option value="Monumento">Monumento</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hash Code (Gerado Auto)</label>
                <input type="text" disabled placeholder="Gerado após salvar" className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea name="description" rows={3} className="w-full border rounded-lg px-3 py-2" placeholder="Ex: Poste em frente ao mercado..."></textarea>
        </div>

        <div className="pt-4 flex justify-end gap-3">
            <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button
                type="submit"
                disabled={!lat}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Salvar Ativo
            </button>
        </div>
      </form>
    </div>
  )
}
