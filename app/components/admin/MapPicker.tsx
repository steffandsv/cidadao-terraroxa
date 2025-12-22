'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Next.js
// We need to re-point to the images because webpack/next messes up the paths
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

function LocationMarker({ onLocationSelect, initialPosition }: { onLocationSelect: (lat: number, lng: number) => void, initialPosition: L.LatLng | null }) {
  const [position, setPosition] = useState<L.LatLng | null>(initialPosition)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  // If initialPosition changes (e.g. from props), we might want to update local state,
  // but usually for edit form it's stable.
  // However, if we want to support external updates we could add a useEffect.
  // For now, simple initialization is enough for the "Edit" use case.

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  )
}

interface MapPickerProps {
    onSelect: (lat: number, lng: number) => void
    initialLat?: number
    initialLng?: number
    initialZoom?: number
    markerPosition?: [number, number] | null
}

export default function MapPicker({ onSelect, initialLat, initialLng, initialZoom, markerPosition }: MapPickerProps) {
    const center: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : [-24.2323, -53.8407]
    const zoom = initialZoom || 13

    const initialMarkerPos = markerPosition ? new L.LatLng(markerPosition[0], markerPosition[1]) : null

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationSelect={onSelect} initialPosition={initialMarkerPos} />
        </MapContainer>
    )
}
