'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Filter, X, Eye, HardHat } from 'lucide-react'
import dynamic from 'next/dynamic'
import VerificationPopup from '@/app/components/VerificationPopup'

// Dynamically import Map with no SSR
const ReviewMap = dynamic(() => import('@/app/admin/review/components/ReviewMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Carregando Mapa...</div>
})

export default function ClientMap({ actions, publicWorks = [], mapConfig, user }: { actions: any[], publicWorks?: any[], mapConfig: any, user?: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReports, setShowReports] = useState(true)
  const [showWorks, setShowWorks] = useState(true)

  // Combined data for the map
  // We need to shape public works like actions/reviews so the map can accept them,
  // OR modify ReviewMap to accept mixed types.
  // Modifying ReviewMap is better but risky if it breaks Admin Review.
  // Let's see if we can just pass them as "reviews" with a special flag.

  const mapData = [
    ...(showReports ? actions.map(a => ({ ...a, type: 'report' })) : []),
    ...(showWorks ? publicWorks.map(w => ({
        id: `work-${w.id}`,
        type: 'work',
        status: 'WORK_IN_PROGRESS', // Special status for icon
        asset: {
            geoLat: w.geoLat,
            geoLng: w.geoLng
        },
        // Pass original work data for popup
        originalData: w
    })) : [])
  ]

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

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">⚠️</div>
                 <span className="font-medium text-gray-700">Indicações</span>
               </div>
               <input
                 type="checkbox"
                 checked={showReports}
                 onChange={(e) => setShowReports(e.target.checked)}
                 className="w-5 h-5 text-blue-600 rounded"
               />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">🚧</div>
                 <span className="font-medium text-gray-700">Obras</span>
               </div>
               <input
                 type="checkbox"
                 checked={showWorks}
                 onChange={(e) => setShowWorks(e.target.checked)}
                 className="w-5 h-5 text-blue-600 rounded"
               />
            </div>
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
            reviews={mapData}
            onSelectReview={() => {}}
            selectedId={null}
            defaultCenter={mapConfig}
            defaultZoom={mapConfig.zoom}
            renderPopup={(item) => {
                if (item.type === 'work') {
                    const w = item.originalData
                    return (
                        <div className="min-w-[250px] p-2">
                             <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                                <img src={w.coverPhotoUrl || '/placeholder.jpg'} alt={w.title} className="object-cover w-full h-full" />
                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    {w.currentStatus}
                                </div>
                             </div>
                             <h3 className="font-bold text-gray-800 text-sm mb-1">{w.title}</h3>
                             <p className="text-xs text-gray-500 mb-3 line-clamp-2">{w.description}</p>

                             <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                             </div>

                             <Link
                               href={`/obras/${w.id}`}
                               className="block w-full text-center bg-blue-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-blue-700 transition"
                             >
                                VER DETALHES E FISCALIZAR
                             </Link>
                        </div>
                    )
                }
                return <VerificationPopup action={item} user={user} />
            }}
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
