'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface DashboardInteractionsProps {
    profile: any
}

export default function DashboardInteractions({ profile }: DashboardInteractionsProps) {
    // Check if level up is available
    const isLevelUpAvailable = profile.calculatedLevel !== profile.levelTitle
    // Rank logic for comparison (primitive)
    const ranks = ['Cidadão', 'Cidadão Verificado', 'Colaborador', 'Autoridade', 'Conselheiro']
    const currentRankIdx = ranks.indexOf(profile.levelTitle)
    const calcRankIdx = ranks.indexOf(profile.calculatedLevel)

    // Only show if it's an upgrade
    const showLevelUp = isLevelUpAvailable && calcRankIdx > currentRankIdx

    // Check verification status
    // Show banner if: Not verified AND Level is Cidadão (meaning they are stuck at bottom)
    const showVerificationBanner = profile.verificationStatus !== 'APPROVED' && profile.levelTitle === 'Cidadão'

    return (
        <>
            {showLevelUp && (
                <div className="fixed bottom-24 right-4 z-40 animate-bounce">
                    <button
                         onClick={() => {
                             // This is a hacky way to trigger the overlay which is rendered in the parent server component?
                             // No, the parent imports this client component.
                             // Wait, I need to pass the "claim" function or logic here.
                             // Actually, better to render the Overlay inside this Client Component if active.
                             // Since the overlay is in page.tsx, this button just serves as a visual reminder or we can trigger it.
                             // Actually, page.tsx renders the overlay automatically if showLevelUp is true.
                             // But we might want a manual trigger if they closed it?
                             // For now, let's assume page.tsx handles it.
                             window.location.reload()
                         }}
                         className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full shadow-lg border-2 border-white"
                    >
                        Evolução Disponível! 🚀
                    </button>
                </div>
            )}

            {showVerificationBanner && (
                 <Link href="/verify" className="block mb-6 mx-6 -mt-4 relative z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg text-white flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full animate-pulse">
                                <CheckCircle className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Verifique seu perfil</p>
                                <p className="text-xs text-blue-100">Ganhe o selo e suba de nível!</p>
                            </div>
                        </div>
                         <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold group-hover:scale-105 transition-transform">
                             Verificar
                         </div>
                    </div>
                 </Link>
            )}
        </>
    )
}
