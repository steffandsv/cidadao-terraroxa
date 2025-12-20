'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix Leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

export default function MapView({ lat, lng }: { lat: number, lng: number }) {
  useEffect(() => {
    // Leaflet generic icon fix
    // We are using a custom icon definition above, but we need to ensure images exist in public
    // or use CDN
  }, [])

  return (
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={new L.Icon.Default()}>
        <Popup>Local do Patrimônio</Popup>
      </Marker>
    </MapContainer>
  )
}
