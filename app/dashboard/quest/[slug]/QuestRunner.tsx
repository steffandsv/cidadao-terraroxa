'use client'

import { useState } from 'react'
import { checkImageQuality, submitQuestAction } from '@/app/actions/quest_runner'
import { Camera, MapPin, Upload, AlertCircle, CheckCircle } from 'lucide-react'

export default function QuestRunner({ rule }: { rule: any }) {
    const [step, setStep] = useState(1)
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
    const [image, setImage] = useState<string | null>(null)
    const [aiFeedback, setAiFeedback] = useState<{sufficient: boolean, feedback: string} | null>(null)
    const [analyzing, setAnalyzing] = useState(false)

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                },
                (err) => alert("Erro ao obter localização: " + err.message)
            )
        } else {
            alert("Geolocalização não suportada.")
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
                setAiFeedback(null) // Reset feedback on new image
            }
            reader.readAsDataURL(file)
        }
    }

    const runAICheck = async () => {
        if (!image) return
        setAnalyzing(true)
        const formData = new FormData()
        formData.append('slug', rule.slug)
        formData.append('image', image)

        const result = await checkImageQuality(formData)
        setAiFeedback(result)
        setAnalyzing(false)
    }

    const canSubmit = () => {
        if (rule.requiresLocation && !location) return false
        if (rule.requiresPhoto && !image) return false
        if (rule.aiValidation && (!aiFeedback || !aiFeedback.sufficient)) return false
        return true
    }

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-emerald-600 p-6 text-white text-center">
                <span className="text-4xl">{rule.icon}</span>
                <h1 className="text-2xl font-bold mt-2">{rule.title}</h1>
                <p className="opacity-90">Ganhe +{rule.points} pontos</p>
            </div>

            <div className="flex-1 p-6 space-y-8">

                {/* Step 1: Location */}
                {rule.requiresLocation && (
                    <div className={`transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin size={20} className="text-blue-500" />
                            1. Localização
                        </h3>
                        {location ? (
                            <div className="mt-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle size={16} /> Localização capturada
                            </div>
                        ) : (
                            <button
                                onClick={handleLocation}
                                className="mt-2 w-full py-3 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                            >
                                <MapPin size={20} /> Capturar minha posição
                            </button>
                        )}
                    </div>
                )}

                {/* Step 2: Photo */}
                {rule.requiresPhoto && (
                    <div className={`transition-opacity ${(!rule.requiresLocation || location) ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Camera size={20} className="text-purple-500" />
                            2. Evidência Fotográfica
                        </h3>

                        {!image ? (
                            <label className="mt-2 w-full py-8 border-2 border-dashed border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition flex flex-col items-center justify-center gap-2 cursor-pointer">
                                <Camera size={32} />
                                <span>Tirar Foto / Upload</span>
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                            </label>
                        ) : (
                            <div className="mt-2 relative">
                                <img src={image} alt="Evidence" className="w-full rounded-lg shadow-sm" />
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs"
                                >
                                    Trocar
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: AI Check */}
                {rule.aiValidation && image && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
                            3. Análise Inteligente
                        </h3>

                        {!aiFeedback ? (
                            <button
                                onClick={runAICheck}
                                disabled={analyzing}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition disabled:opacity-70"
                            >
                                {analyzing ? 'Analisando...' : 'Verificar Foto com IA'}
                            </button>
                        ) : (
                            <div className={`p-4 rounded-lg border ${aiFeedback.sufficient ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-start gap-3">
                                    {aiFeedback.sufficient ? <CheckCircle className="text-green-600 shrink-0" /> : <AlertCircle className="text-red-600 shrink-0" />}
                                    <div>
                                        <p className={`font-bold ${aiFeedback.sufficient ? 'text-green-800' : 'text-red-800'}`}>
                                            {aiFeedback.sufficient ? 'Foto Aprovada!' : 'Atenção necessária'}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">{aiFeedback.feedback}</p>
                                    </div>
                                </div>
                                {!aiFeedback.sufficient && (
                                    <button onClick={() => setImage(null)} className="mt-3 text-sm text-red-600 underline">
                                        Tentar outra foto
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Submit */}
                <div className="pt-4">
                    <form action={submitQuestAction}>
                        <input type="hidden" name="slug" value={rule.slug} />
                        <input type="hidden" name="evidenceBase64" value={image || ''} />
                        <input type="hidden" name="locationLat" value={location?.lat || ''} />
                        <input type="hidden" name="locationLng" value={location?.lng || ''} />

                        <button
                            type="submit"
                            disabled={!canSubmit()}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Finalizar Missão
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
