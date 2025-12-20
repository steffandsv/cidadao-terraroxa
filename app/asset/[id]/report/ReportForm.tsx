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
    const [selectedProblem, setSelectedProblem] = useState('')
    const [description, setDescription] = useState('')

    // Default problems if schema is missing (fallback)
    const defaultProblems = ["Lâmpada Queimada", "Fios Soltos", "Poste Caído", "Outro"]

    // Safely access problems from asset type schema
    const schema = asset.assetType?.schema as any
    const problems = (schema?.problems && Array.isArray(schema.problems)) ? schema.problems : defaultProblems

    const isOther = selectedProblem === 'Outro'

    // Validate: if "Outro", description is required
    const isValid = selectedProblem && (!isOther || description.trim().length > 0)

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
                <select
                    name="problemType"
                    className="w-full p-3 border rounded-xl bg-white"
                    required
                    value={selectedProblem}
                    onChange={(e) => setSelectedProblem(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {problems.map((p: string) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Adicional {isOther && <span className="text-red-600">*</span>}
                </label>
                <textarea
                    name="description"
                    rows={3}
                    className="w-full p-3 border rounded-xl"
                    placeholder={isOther ? "Descreva o problema (Obrigatório)..." : "Descreva detalhes (Opcional)..."}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required={isOther}
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
                disabled={submitting || !isValid}
                className="w-full bg-blue-800 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? 'Enviando...' : 'Enviar Ocorrência'}
            </button>
        </form>
    )
}
