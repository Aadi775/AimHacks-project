'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapBoundary from '@/components/shared/MapBoundary';

interface PickerProps {
  lat: number | null;
  lng: number | null;
  onPick: (lat: number, lng: number) => void;
  center: [number, number];
}

function ClickCatcher({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ lat, lng, onPick, center }: PickerProps) {
  const [mapKey, setMapKey] = useState(0);
  const [mapFailed, setMapFailed] = useState(false);

  // Self-heal Leaflet double-init crashes (Suspense/Fast Refresh remounts)
  useEffect(() => {
    if (mapFailed) {
      setMapFailed(false);
      setMapKey((k) => k + 1);
    }
  }, [mapFailed]);

  const pinIcon = L.divIcon({
    className: 'cp-pin-wrapper',
    html: `<span class="cp-pin"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 14],
  });

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner">
      <MapBoundary onError={() => setMapFailed(true)}>
      <MapContainer key={mapKey} center={center} zoom={12} zoomControl={false} className="h-full w-full" style={{ background: '#f8f9ff' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher onPick={onPick} />
        {lat !== null && lng !== null && <Marker icon={pinIcon} position={[lat, lng]} />}
      </MapContainer>
      </MapBoundary>
      <div className="absolute bottom-2 left-2 z-[500] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-[11px] text-slate-700 shadow">
        {lat !== null && lng !== null ? `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E` : 'Click the map to pin the incident location'}
      </div>
      {lat !== null && lng !== null && (
        <div className="absolute top-2 right-2 z-[500]">
          <button
            className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-[10px] text-red-600 shadow hover:bg-white"
            onClick={() => onPick(NaN, NaN)}
            type="button"
          >
            ✕ CLEAR PIN
          </button>
        </div>
      )}
    </div>
  );
}
