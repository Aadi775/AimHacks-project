'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapBoundary from '@/components/shared/MapBoundary';

interface HoodNode {
  name: string;
  lat: number;
  lng: number;
  temp: number | null;
  humidity: number | null;
  wind_kmh: number | null;
  us_aqi: number | null;
  severity: string;
  score: number;
  tip: string;
}

function scoreColor(score: number) {
  if (score >= 70) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

function hoodIcon(n: HoodNode) {
  const color = scoreColor(n.score);
  return L.divIcon({
    className: 'cp-hood-wrapper',
    html: `<span class="cp-hood" style="--cp-hood-color:${color}"><b>${n.score}</b></span>`,
    iconSize: [34, 26],
    iconAnchor: [17, 26],
  });
}

function FitBounds({ nodes }: { nodes: HoodNode[] }) {
  const map = useMap();
  useEffect(() => {
    if (nodes.length >= 2) {
      const lats = nodes.map((n) => n.lat);
      const lngs = nodes.map((n) => n.lng);
      map.fitBounds(
        [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ],
        { padding: [28, 28] }
      );
    }
  }, [map, nodes]);
  return null;
}

export default function NeighborhoodMap({ cityName }: { cityName: string }) {
  const [nodes, setNodes] = useState<HoodNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    if (mapFailed) {
      setMapFailed(false);
      setMapKey((k) => k + 1);
    }
  }, [mapFailed]);

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    setOffline(false);
    const load = () =>
      fetch(`http://localhost:8001/api/neighborhoods?city=${encodeURIComponent(cityName)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('offline'))))
        .then((d) => {
          setNodes(d.nodes ?? []);
          setLoading(false);
        })
        .catch(() => {
          setOffline(true);
          setLoading(false);
        });
    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, [cityName]);

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-inner">
      <MapBoundary onError={() => setMapFailed(true)}>
        <MapContainer
          key={mapKey}
          center={[26.9124, 75.7873]}
          zoom={12}
          zoomControl={false}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ background: '#f8f9ff' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds nodes={nodes} />
          {nodes.map((n) => (
            <Marker icon={hoodIcon(n)} key={n.name} position={[n.lat, n.lng]}>
              <Popup>
                <div style={{ minWidth: 170 }}>
                  <strong>{n.name}</strong> — <span style={{ color: scoreColor(n.score), fontWeight: 700 }}>{n.score}/100 civic score</span>
                  <br />
                  {n.temp != null ? `${Math.round(n.temp)}°C` : '–'} · AQI {n.us_aqi ?? '–'} ({n.severity})
                  <br />
                  Wind {n.wind_kmh != null ? Math.round(n.wind_kmh) : '–'} km/h · Humidity {n.humidity ?? '–'}%
                  <br />
                  <span style={{ color: '#64748B', fontSize: 11 }}>{n.tip}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapBoundary>

      {/* Score legend */}
      <div className="absolute bottom-2 left-2 z-[500] bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow flex items-center gap-2.5">
        {[
          { c: '#10B981', t: 'Good 70+' },
          { c: '#F59E0B', t: 'Fair 50-69' },
          { c: '#EF4444', t: 'Poor <50' },
        ].map((l) => (
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600" key={l.t}>
            <span className="w-2 h-2 rounded-full" style={{ background: l.c }}></span>
            {l.t}
          </span>
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 z-[600] bg-white/70 flex items-center justify-center">
          <span className="font-body-sm text-body-sm text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Reading neighborhood sensors…
          </span>
        </div>
      )}
      {offline && !loading && (
        <div className="absolute top-2 left-2 z-[600] bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded-lg shadow">
          <span className="font-body-sm text-body-sm text-amber-700">Sensor feed offline — showing last known grid</span>
        </div>
      )}
    </div>
  );
}
