'use client'

import { useState } from 'react'
import { verifyAction } from '@/app/actions/verification'
import { useRouter } from 'next/navigation'

interface VerificationPopupProps {
    action: any // UserAction with relations
    user?: any // Current User
    onClose?: () => void
}

export default function VerificationPopup({ action, user, onClose }: VerificationPopupProps) {
    const router = useRouter()
    const [step, setStep] = useState<'INITIAL' | 'URGENCY' | 'THANKS'>('INITIAL')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [locationStatus, setLocationStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS' | 'ERROR'>('IDLE')

    // Data parsing
    const problemType = action.data?.problemType || 'Indicação'
    const description = action.data?.description
    const reporterName = action.user?.name || 'Cidadão Anônimo'
    const date = new Date(action.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

    // Check if user has already verified
    const userVerification = action.verifications?.find((v: any) => v.userId === user?.id)

    // Haversine Distance
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const d = R * c; // in metres
        return d;
    }

    const verifyLocation = (onSuccess: () => void) => {
        setError('')
        setLocationStatus('CHECKING')

        if (!navigator.geolocation) {
            setError('Geolocalização não suportada.')
            setLocationStatus('ERROR')
            return
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude
            const userLng = position.coords.longitude
            const targetLat = Number(action.asset.geoLat)
            const targetLng = Number(action.asset.geoLng)

            const dist = calculateDistance(userLat, userLng, targetLat, targetLng)

            if (dist > 200) { // 200 meters tolerance
                 setError(`Você está muito longe (${Math.round(dist)}m). Aproxime-se para verificar.`)
                 setLocationStatus('ERROR')
            } else {
                setLocationStatus('SUCCESS')
                onSuccess()
            }
        }, (err) => {
            console.error(err)
            setError('Erro ao obter localização. Permita o acesso ao GPS.')
            setLocationStatus('ERROR')
        }, { enableHighAccuracy: true, timeout: 10000 })
    }

    const handleYes = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        verifyLocation(() => setStep('URGENCY'))
    }

    const handleNo = async (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        verifyLocation(async () => {
            setLoading(true)
            const result = await verifyAction(action.id, 0) // 0 = Not happening / Resolved
            setLoading(false)
            if (result.success) {
                setStep('THANKS')
            } else {
                setError(result.message || 'Erro ao enviar.')
            }
        })
    }

    const handleUrgency = async (score: number, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setLoading(true)
        const result = await verifyAction(action.id, score)
        setLoading(false)
        if (result.success) {
            setStep('THANKS')
        } else {
            setError(result.message || 'Erro ao enviar.')
        }
    }

    // Unauthenticated View
    if (!user) {
        return (
            <div className="p-3 min-w-[250px]">
                 <div className="mb-3 border-b pb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{problemType}</h3>
                    <p className="text-xs text-gray-500">Por {reporterName} em {date}</p>
                    {description && <p className="text-sm text-gray-700 mt-1 italic">"{description}"</p>}
                </div>
                <p className="text-sm text-gray-600 mb-2">Faça login para verificar esta indicação.</p>
                <a href="/login" className="block w-full bg-emerald-600 text-white text-center p-2 rounded text-sm font-bold hover:bg-emerald-700">Entrar</a>
            </div>
        )
    }

    // Success/Already Voted View
    if (step === 'THANKS' || (userVerification && step === 'INITIAL')) {
         return (
             <div className="p-4 text-center min-w-[250px]">
                 <div className="text-emerald-500 text-4xl mb-2"><i className="fa-solid fa-check-circle"></i></div>
                 <h3 className="font-bold text-gray-800">Obrigado!</h3>
                 <p className="text-sm text-gray-600 mt-1">
                     {userVerification
                        ? "Sua opinião já foi registrada e priorizada."
                        : "Obrigado por nos ajudar a cuidar da cidade!"}
                 </p>
                 {userVerification && (
                     <button onClick={(e) => { e.stopPropagation(); setStep('URGENCY') }} className="text-xs text-blue-500 mt-2 underline">
                         Alterar opinião
                     </button>
                 )}
             </div>
         )
    }

    // Urgency Selection View
    if (step === 'URGENCY') {
        return (
            <div className="p-2 min-w-[280px]">
                <h3 className="font-bold text-gray-800 mb-2 text-center text-sm">Qual a urgência para o bairro?</h3>
                <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                        onClick={(e) => handleUrgency(3, e)}
                        disabled={loading}
                        className="bg-blue-100 text-blue-700 p-2 rounded-lg text-xs font-bold hover:bg-blue-200 transition"
                    >
                        Baixa
                    </button>
                    <button
                        onClick={(e) => handleUrgency(6, e)}
                        disabled={loading}
                        className="bg-orange-100 text-orange-700 p-2 rounded-lg text-xs font-bold hover:bg-orange-200 transition"
                    >
                        Média
                    </button>
                    <button
                        onClick={(e) => handleUrgency(10, e)}
                        disabled={loading}
                        className="bg-red-100 text-red-700 p-2 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                    >
                        Crítica
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                <button onClick={(e) => { e.stopPropagation(); setStep('INITIAL') }} className="w-full text-center text-xs text-gray-400 hover:text-gray-600">Voltar</button>
            </div>
        )
    }

    // Initial Verification View
    return (
        <div className="p-2 min-w-[260px]">
            <div className="mb-3 border-b pb-2">
                <h3 className="font-bold text-gray-800 text-lg">{problemType}</h3>
                <p className="text-xs text-gray-500">Por {reporterName} em {date}</p>
                {description && <p className="text-sm text-gray-700 mt-1 italic">"{description}"</p>}
            </div>

            <h3 className="font-bold text-gray-800 mb-2 text-sm">Verificação Cidadã</h3>
            <p className="text-sm text-gray-600 mb-3">Este problema continua acontecendo?</p>

            {locationStatus === 'CHECKING' ? (
                <div className="text-center p-2 text-gray-500 text-sm animate-pulse">
                    <i className="fa-solid fa-location-dot mr-2"></i> Verificando localização...
                </div>
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={handleNo}
                        disabled={loading}
                        className="flex-1 bg-gray-100 text-gray-600 p-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                    >
                        Não
                    </button>
                    <button
                        onClick={handleYes}
                        disabled={loading}
                        className="flex-1 bg-emerald-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition"
                    >
                        Sim
                    </button>
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
        </div>
    )
}
