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

    // Check if user has already verified
    const userVerification = action.verifications?.find((v: any) => v.userId === user?.id)

    // If user has verified, maybe show their vote?
    // For now, if they voted, we just show the stats or allow re-vote.
    // Let's assume re-vote is allowed or just show "Thanks".
    // If it's the *reporter*, this popup might be different, but for now generic.

    const handleYes = () => setStep('URGENCY')

    const handleNo = async () => {
        setLoading(true)
        const result = await verifyAction(action.id, 0) // 0 = Not happening / Resolved
        setLoading(false)
        if (result.success) {
            setStep('THANKS')
        } else {
            setError(result.message || 'Erro ao enviar.')
        }
    }

    const handleUrgency = async (score: number) => {
        setLoading(true)
        const result = await verifyAction(action.id, score)
        setLoading(false)
        if (result.success) {
            setStep('THANKS')
        } else {
            setError(result.message || 'Erro ao enviar.')
        }
    }

    if (!user) {
        return (
            <div className="p-2 min-w-[200px]">
                <p className="text-sm text-gray-600 mb-2">Faça login para verificar esta indicação.</p>
                <a href="/login" className="block w-full bg-emerald-600 text-white text-center p-2 rounded text-sm font-bold">Entrar</a>
            </div>
        )
    }

    if (step === 'THANKS' || userVerification && step === 'INITIAL') {
         // Calculate average if available (or pass it down)
         // For now just thank.
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
                     <button onClick={() => setStep('URGENCY')} className="text-xs text-blue-500 mt-2 underline">
                         Alterar opinião
                     </button>
                 )}
             </div>
         )
    }

    if (step === 'URGENCY') {
        return (
            <div className="p-2 min-w-[280px]">
                <h3 className="font-bold text-gray-800 mb-2 text-center text-sm">Qual a urgência para o bairro?</h3>
                <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                        onClick={() => handleUrgency(3)}
                        disabled={loading}
                        className="bg-blue-100 text-blue-700 p-2 rounded-lg text-xs font-bold hover:bg-blue-200"
                    >
                        Baixa
                    </button>
                    <button
                        onClick={() => handleUrgency(6)}
                        disabled={loading}
                        className="bg-orange-100 text-orange-700 p-2 rounded-lg text-xs font-bold hover:bg-orange-200"
                    >
                        Média
                    </button>
                    <button
                        onClick={() => handleUrgency(10)}
                        disabled={loading}
                        className="bg-red-100 text-red-700 p-2 rounded-lg text-xs font-bold hover:bg-red-200"
                    >
                        Crítica
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                <button onClick={() => setStep('INITIAL')} className="w-full text-center text-xs text-gray-400">Voltar</button>
            </div>
        )
    }

    return (
        <div className="p-2 min-w-[250px]">
            <h3 className="font-bold text-gray-800 mb-2">Verificação Cidadã</h3>
            <p className="text-sm text-gray-600 mb-3">Este problema continua acontecendo?</p>

            <div className="flex gap-2">
                <button
                    onClick={handleNo}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-600 p-2 rounded-lg text-sm font-bold hover:bg-gray-200"
                >
                    Não
                </button>
                <button
                    onClick={handleYes}
                    disabled={loading}
                    className="flex-1 bg-emerald-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-emerald-700"
                >
                    Sim
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
        </div>
    )
}
