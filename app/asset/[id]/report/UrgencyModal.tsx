'use client'

import { useState } from 'react'
import { verifyAction } from '@/app/actions/verification'
import { useRouter } from 'next/navigation'

export default function UrgencyModal({ actionId, onClose }: { actionId: number, onClose: () => void }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleUrgency = async (score: number) => {
        setLoading(true)
        try {
            await verifyAction(actionId, score)
            // Redirect to success or dashboard
            router.push(`/dashboard?success=report_verified`)
        } catch (e) {
            console.error(e)
            alert("Erro ao salvar prioridade.")
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 text-2xl">
                        <i className="fa-solid fa-check"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Indicação Recebida!</h2>
                    <p className="text-gray-600 mt-2">
                        Na sua opinião de especialista local, qual a urgência disso para o bairro?
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => handleUrgency(3)}
                        disabled={loading}
                        className="bg-blue-50 border-2 border-blue-200 text-blue-700 p-4 rounded-xl font-bold hover:bg-blue-100 transition flex items-center justify-between"
                    >
                        <span>🟢 Baixa</span>
                        <span className="text-sm font-normal opacity-70">Pode esperar um pouco</span>
                    </button>
                    <button
                        onClick={() => handleUrgency(6)}
                        disabled={loading}
                        className="bg-orange-50 border-2 border-orange-200 text-orange-700 p-4 rounded-xl font-bold hover:bg-orange-100 transition flex items-center justify-between"
                    >
                        <span>🟠 Média</span>
                        <span className="text-sm font-normal opacity-70">Incomoda o bairro</span>
                    </button>
                    <button
                        onClick={() => handleUrgency(10)}
                        disabled={loading}
                        className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-between"
                    >
                        <span>🔴 Crítica</span>
                        <span className="text-sm font-normal opacity-70">Precisa ser agora!</span>
                    </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                    Sua opinião ajuda a definir o Ranking de Prioridades da Prefeitura.
                </p>
            </div>
        </div>
    )
}
