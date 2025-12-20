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

    // Safely access schema
    const schema = asset.assetType?.schema as any
    const problems = (schema?.problems && Array.isArray(schema.problems)) ? schema.problems : defaultProblems
    const validation = schema?.validation || { photo: "required", location: true, description: "optional" }

    const isOther = selectedProblem === 'Outro'

    // Validation Logic
    const isDescriptionRequired = validation.description === "required" || isOther
    const isPhotoRequired = validation.photo === "required"

    // Form validity check
    const isValid = selectedProblem && (!isDescriptionRequired || description.trim().length > 0)

    return (
        <form action={submitReport} onSubmit={() => setSubmitting(true)} className="space-y-6">
            <input type="hidden" name="assetId" value={asset.id} />

            {/* Location Confirmation */}
            {validation.location !== false && (
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
                        <input type="checkbox" required className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                        Confirmo que estou neste local
                    </label>
                </div>
            )}


            {/* Problem Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">O que você deseja indicar?</label>
                <select
                    name="problemType"
                    className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                    value={selectedProblem}
                    onChange={(e) => setSelectedProblem(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {problems.map((p: string | {id: string, label: string}) => {
                        // Support both ["String"] and [{id: "x", label: "X"}]
                        const value = typeof p === 'string' ? p : p.id
                        const label = typeof p === 'string' ? p : p.label
                        return <option key={value} value={value}>{label}</option>
                    })}
                </select>
            </div>

            {/* Description */}
            {validation.description !== 'none' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição da Indicação {isDescriptionRequired && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder={isDescriptionRequired ? "Descreva a indicação (Obrigatório)..." : "Descreva detalhes (Opcional)..."}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required={isDescriptionRequired}
                    ></textarea>
                </div>
            )}

            {/* Photo (Mock) */}
            {validation.photo !== 'none' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto (Opcional) {isPhotoRequired && <span className="text-red-600">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 bg-white">
                        <input type="hidden" name="evidenceUrl" value="https://placehold.co/600x400/png" />
                        <p>📸 Simulação de Upload de Câmera</p>
                        <p className="text-xs mt-1">{isPhotoRequired ? '(Obrigatória)' : '(Opcional)'}</p>
                    </div>
                </div>
            )}


            <button
                type="submit"
                disabled={submitting || !isValid}
                className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? 'Enviando...' : 'Enviar Indicação'}
            </button>
        </form>
    )
}
