'use client'

import { useEffect, useState } from 'react'
import { submitReport } from '@/app/actions/game'
import { useRouter } from 'next/navigation'

export default function PendingReportHandler() {
    const router = useRouter()
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    useEffect(() => {
        const checkPendingReport = async () => {
            const pendingReportJson = localStorage.getItem('pendingReport')
            if (!pendingReportJson) return

            try {
                setStatus('submitting')
                const reportData = JSON.parse(pendingReportJson)

                const formData = new FormData()
                formData.append('assetId', reportData.assetId)
                formData.append('problemType', reportData.problemType)
                formData.append('description', reportData.description)
                formData.append('evidenceUrl', reportData.evidenceUrl)

                const result = await submitReport(formData)

                if (result && result.success) {
                    setStatus('success')
                    localStorage.removeItem('pendingReport')
                    // Optional: Show success message or refresh
                    router.refresh()
                    // Remove the query param if it exists to clean up url
                    router.replace('/dashboard?success=report_submitted')
                } else {
                    setStatus('error')
                }
            } catch (e) {
                console.error("Failed to submit pending report", e)
                setStatus('error')
            }
        }

        checkPendingReport()
    }, [router])

    if (status === 'idle') return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {status === 'submitting' && (
                <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Enviando sua indicação pendente...
                </div>
            )}
            {status === 'success' && (
                <div className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                    <i className="fa-solid fa-check-circle"></i>
                    Indicação enviada com sucesso!
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                    <i className="fa-solid fa-exclamation-circle"></i>
                    Erro ao enviar indicação pendente.
                </div>
            )}
        </div>
    )
}
