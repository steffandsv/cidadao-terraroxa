'use client'

import dynamic from 'next/dynamic'
import { submitReport } from '@/app/actions/game'
import { useState } from 'react'

// MapView must be client-side only (Leaflet requirement)
const MapView = dynamic(() => import('@/app/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-200 animate-pulse flex items-center justify-center">Carregando Mapa...</div>
})

export default function ReportForm({ asset }: { asset: any }) {
    const [submitting, setSubmitting] = useState(false)

    return (
        <form action={submitReport} onSubmit={() => setSubmitting(true)} className="space-y-6">
            <input type="hidden" name="assetId" value={asset.id} />

            {/* Location Confirmation */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
                <h3 className="font-bold mb-2">Confirmar Localização</h3>
                <div className="h-48 rounded-lg overflow-hidden border mb-2">
                    {asset.geoLat && asset.geoLng ? (
                        <MapView lat={Number(asset.geoLat)} lng={Number(asset.geoLng)} />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">Sem localização definida</div>
                    )}
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" required className="w-4 h-4 text-blue-600 rounded" />
                    Confirmo que estou neste local
                </label>
            </div>

            {/* Problem Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qual é o problema?</label>
                <select name="problemType" className="w-full p-3 border rounded-xl bg-white" required>
                    <option value="">Selecione...</option>
                    <option value="Lâmpada Queimada">Lâmpada Queimada</option>
                    <option value="Fios Soltos">Fios Soltos</option>
                    <option value="Poste Caído">Poste Caído/Torto</option>
                    <option value="Lixo/Entulho">Lixo/Entulho</option>
                    <option value="Depredação">Depredação</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Adicional</label>
                <textarea
                    name="description"
                    rows={3}
                    className="w-full p-3 border rounded-xl"
                    placeholder="Descreva detalhes..."
                ></textarea>
            </div>

            {/* Photo (Mock) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto (Opcional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 bg-white">
                    <input type="hidden" name="evidenceUrl" value="https://placehold.co/600x400/png" />
                    <p>📸 Simulação de Upload de Câmera</p>
                    <p className="text-xs mt-1">(Em produção, abriria a câmera nativa)</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-800 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {submitting ? 'Enviando...' : 'Enviar Ocorrência'}
            </button>
        </form>
    )
}
