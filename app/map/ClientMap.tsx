'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Filter, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import VerificationPopup from '@/app/components/VerificationPopup'

// Dynamically import Map with no SSR
const ReviewMap = dynamic(() => import('@/app/admin/review/components/ReviewMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Carregando Mapa...</div>
})

export default function ClientMap({ actions, mapConfig, user }: { actions: any[], mapConfig: any, user?: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeType, setActiveType] = useState<number | null>(null)

  // Extract unique types from actions
  const types = Array.from(new Set(actions.map(a => JSON.stringify({ id: a.asset.assetTypeId, name: a.asset.assetType?.name || 'Geral' }))))
      .map(s => JSON.parse(s))

  const filteredActions = activeType
    ? actions.filter(a => a.asset.assetTypeId === activeType)
    : actions

  // ReviewMap expects "reviews" structure. We pass `actions` directly as they match closely (UserAction).
  // Need to ensure `status` maps to color if needed, or override.
  // We want to visualize "Criticality" maybe?
  // For now, let's keep status color logic (PENDING = Yellow).

  return (
    <div className="relative h-screen w-full bg-gray-200 overflow-hidden">

      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 z-20 bg-white p-3 rounded-full shadow-lg text-gray-700 active:scale-95 transition"
      >
        <Filter size={24} />
      </button>

      {/* Sidebar */}
      <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl z-30 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveType(null)}
              className={`w-full text-left p-3 rounded-xl transition ${!activeType ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-50'}`}
            >
              Todos
            </button>
            {types.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${activeType === t.id ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-50'}`}
              >
                <span>🏛️</span>
                {t.name}
              </button>
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
             <Link href="/dashboard" className="block text-center text-gray-500 hover:text-gray-800 font-medium">
               Voltar ao Painel
             </Link>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="h-full w-full bg-gray-100 relative z-10">
          <ReviewMap
            reviews={filteredActions}
            onSelectReview={() => {}}
            selectedId={null}
            defaultCenter={mapConfig}
            defaultZoom={mapConfig.zoom}
            renderPopup={(action) => <VerificationPopup action={action} user={user} />}
          />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-20"
        ></div>
      )}
    </div>
  )
}
