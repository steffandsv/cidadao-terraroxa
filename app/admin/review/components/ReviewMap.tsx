'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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
const createIcon = (color: string, emoji?: string) => new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">${emoji || ''}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const icons = {
    PENDING: createIcon('#EAB308', '⚠️'), // Yellow
    APPROVED: createIcon('#22C55E'), // Green
    REJECTED: createIcon('#EF4444'), // Red
    WORK_IN_PROGRESS: createIcon('#2563EB', '🚧'), // Blue for works
    DEFAULT: createIcon('#3B82F6')   // Blue for others
};

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function ReviewMap({
    reviews,
    onSelectReview,
    selectedId,
    defaultCenter,
    defaultZoom,
    renderPopup
}: {
    reviews: any[],
    onSelectReview: (r: any) => void,
    selectedId: number | null,
    defaultCenter: { lat: number, lng: number },
    defaultZoom: number,
    renderPopup?: (review: any) => React.ReactNode
}) {

    useEffect(() => {
        fixLeafletIcons()
    }, [])

    // If selected review has location, center on it
    const selectedReview = reviews.find(r => r.id === selectedId)
    const center: [number, number] = selectedReview?.asset?.geoLat && selectedReview?.asset?.geoLng
        ? [Number(selectedReview.asset.geoLat), Number(selectedReview.asset.geoLng)]
        : [defaultCenter.lat, defaultCenter.lng]

    const zoom = selectedReview ? 18 : defaultZoom

    return (
        <MapContainer
            center={center}
            zoom={zoom}
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
                        {renderPopup && (
                            <Popup>
                                {renderPopup(review)}
                            </Popup>
                        )}
                    </Marker>
                )
            })}
            <MapController center={center} zoom={zoom} />
        </MapContainer>
    )
}
