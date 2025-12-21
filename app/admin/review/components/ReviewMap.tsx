'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for Leaflet icons
const fixLeafletIcons = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

// Create custom icons for different statuses
const createIcon = (color: string) => new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const icons = {
    PENDING: createIcon('#EAB308'), // Yellow
    APPROVED: createIcon('#22C55E'), // Green
    REJECTED: createIcon('#EF4444'), // Red
    DEFAULT: createIcon('#3B82F6')   // Blue for others
};

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function ReviewMap({ reviews, onSelectReview, selectedId }: { reviews: any[], onSelectReview: (r: any) => void, selectedId: number | null }) {

    useEffect(() => {
        fixLeafletIcons()
    }, [])

    // Calculate center based on reviews or default to Terra Roxa
    const defaultCenter: [number, number] = [-21.0365, -48.5135]

    // If selected review has location, center on it
    const selectedReview = reviews.find(r => r.id === selectedId)
    const center = selectedReview?.asset?.geoLat && selectedReview?.asset?.geoLng
        ? [Number(selectedReview.asset.geoLat), Number(selectedReview.asset.geoLng)] as [number, number]
        : defaultCenter

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {reviews.map(review => {
                if (!review.asset?.geoLat || !review.asset?.geoLng) return null;
                const icon = icons[review.status as keyof typeof icons] || icons.DEFAULT;

                return (
                    <Marker
                        key={review.id}
                        position={[Number(review.asset.geoLat), Number(review.asset.geoLng)]}
                        icon={icon}
                        eventHandlers={{
                            click: () => onSelectReview(review),
                        }}
                    >
                    </Marker>
                )
            })}
            <MapController center={center} />
        </MapContainer>
    )
}
