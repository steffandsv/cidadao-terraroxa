'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Filter, X } from 'lucide-react'

// Mock Data for the map
const POINTS_OF_INTEREST = [
  { id: 1, type: 'Patrimônio', name: 'Poste #1234', lat: -23.123, lng: -50.123, category: 'public' },
  { id: 2, type: 'Lazer', name: 'Praça Central', lat: -23.125, lng: -50.120, category: 'leisure' },
  { id: 3, type: 'Saúde', name: 'UBS Centro', lat: -23.128, lng: -50.125, category: 'health' },
]

export default function MapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    { id: 'public', name: 'Patrimônio Público', icon: '🏛️' },
    { id: 'leisure', name: 'Lazer e Cultura', icon: '🌳' },
    { id: 'health', name: 'Saúde', icon: '🏥' },
    { id: 'education', name: 'Educação', icon: '🏫' },
  ]

  const filteredPoints = activeCategory
    ? POINTS_OF_INTEREST.filter(p => p.category === activeCategory)
    : POINTS_OF_INTEREST

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
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left p-3 rounded-xl transition ${!activeCategory ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-50'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${activeCategory === cat.id ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-50'}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
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

      {/* Map Area (Mock) */}
      <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-100">
          {/* In real app, render Leaflet Map here */}
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-2 opacity-50" />
            <p>Mapa Interativo</p>
            <p className="text-sm opacity-75">Exibindo {filteredPoints.length} pontos</p>
          </div>
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
