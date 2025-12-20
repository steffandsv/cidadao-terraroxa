'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// FontAwesome Marker Icon
const faIcon = L.divIcon({
  html: '<i class="fa-solid fa-map-pin fa-3x text-red-600 drop-shadow-md"></i>',
  className: 'custom-div-icon',
  iconSize: [30, 42],
  iconAnchor: [15, 42]
})

export default function MapView({ lat, lng }: { lat: number, lng: number }) {
  return (
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={faIcon}>
        <Popup>Local do Patrimônio</Popup>
      </Marker>
    </MapContainer>
  )
}
