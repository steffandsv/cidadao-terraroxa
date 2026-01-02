'use client'

import { useState } from 'react'
import { updateInspectionStatus } from '@/app/actions/admin/public-works'
import { Check, X } from 'lucide-react'

export default function InspectionActions({ id, userId, isVerifiedLoc }: { id: number, userId: number | null, isVerifiedLoc: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleAction(status: 'APPROVED' | 'REJECTED') {
    if (!confirm(status === 'APPROVED' ? 'Aprovar esta vistoria e conceder pontos?' : 'Rejeitar vistoria?')) return

    setLoading(true)
    // Points rule: 20 points for approved inspection.
    // Maybe verify location strictly? The prompt says "IsVerifiedLocation TRUE obrigatório para pontuar".
    // So if verifiedLoc is false, we might want to warn admin or force 0 points.

    const points = (status === 'APPROVED' && isVerifiedLoc) ? 20 : 0
    await updateInspectionStatus(id, status, points)
    setLoading(false)
  }

  return (
    <div className="flex gap-3">
        <button
            onClick={() => handleAction('APPROVED')}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold disabled:opacity-50"
        >
            <Check size={18} /> Aprovar (+20pts)
        </button>
        <button
            onClick={() => handleAction('REJECTED')}
            disabled={loading}
            className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-bold disabled:opacity-50"
        >
            <X size={18} /> Rejeitar
        </button>
    </div>
  )
}
