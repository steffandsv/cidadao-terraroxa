'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Work {
    id: number
    title: string
    geoLat: number
    geoLng: number
    coverPhotoUrl?: string
}

export default function ProximityWatcher({ works }: { works: Work[] }) {
    const [nearbyWork, setNearbyWork] = useState<Work | null>(null)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        if (!works || works.length === 0) return

        // Check if recently notified (last 24h)
        const lastNotified = localStorage.getItem('last_proximity_notification')
        if (lastNotified) {
            const timeDiff = Date.now() - Number(lastNotified)
            if (timeDiff < 24 * 60 * 60 * 1000) return // 24h cooldown
        }

        if (!navigator.geolocation) return

        const id = navigator.geolocation.watchPosition((pos) => {
            const { latitude, longitude } = pos.coords

            const nearby = works.find(w => {
                if (!w.geoLat || !w.geoLng) return false
                const d = getDistance(latitude, longitude, Number(w.geoLat), Number(w.geoLng))
                return d < 200 // 200 meters
            })

            if (nearby && !dismissed) {
                setNearbyWork(nearby)
                // Set notification time
                localStorage.setItem('last_proximity_notification', Date.now().toString())
            }
        }, (err) => {
            console.error(err)
        }, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        })

        return () => navigator.geolocation.clearWatch(id)
    }, [works, dismissed])

    if (!nearbyWork) return null

    return createPortal(
        <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl p-4 relative overflow-hidden border border-blue-500/30">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                <button
                    onClick={() => {
                        setNearbyWork(null)
                        setDismissed(true)
                    }}
                    className="absolute top-2 right-2 p-1 text-blue-200 hover:text-white"
                >
                    &times;
                </button>

                <div className="flex gap-4 items-center relative z-10">
                    <div className="bg-white/10 p-3 rounded-full animate-pulse">
                        <AlertCircle className="text-yellow-400" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight mb-1">A Cidade precisa de você!</h3>
                        <p className="text-blue-100 text-sm mb-2">
                            Você está próximo a uma obra em andamento. Ajude-nos a fiscalizá-la e ganhe pontos!
                        </p>
                        <Link
                            href={`/obras/${nearbyWork.id}`}
                            className="inline-flex items-center gap-2 text-xs font-bold bg-white text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-50 transition shadow-lg"
                        >
                            FISCALIZAR AGORA <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3 // metres
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}
