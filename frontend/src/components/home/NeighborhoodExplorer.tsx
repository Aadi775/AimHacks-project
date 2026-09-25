'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';

interface HoodNode {
  name: string;
  lat: number;
  lng: number;
  temp: number | null;
  humidity: number | null;
  wind_kmh: number | null;
  us_aqi: number | null;
  pm2_5: number | null;
  severity: string;
  tip: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  GOOD: '#10b981',
  MODERATE: '#eab308',
  SENSITIVE: '#f59e0b',
  UNHEALTHY: '#ef4444',
};

export default function NeighborhoodExplorer() {
  const { city, setSelectedArea } = useCity();
  const [nodes, setNodes] = useState<HoodNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    fetch(`http://localhost:8001/api/neighborhoods?city=${encodeURIComponent(city.name)}`)
      .then((r) => r.json())
      .then((d) => {
        setNodes((d.nodes ?? []).slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  return (
    <section className="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
        <div>
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-secondary font-semibold">Spatial Urban Intelligence</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
            {city ? `${city.name} Neighborhood` : 'Neighborhood'} Explorer
          </h2>
        </div>
        <span className="font-label-xs text-label-xs text-on-surface-variant">
          {loading ? 'Probing sensor nodes…' : `Live readings via OpenMeteo • ${nodes.length} active nodes`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading &&
          nodes.length === 0 &&
          [0, 1, 2, 3].map((i) => (
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm h-72 animate-pulse" key={i}>
              <div className="h-32 bg-surface-container-low w-full"></div>
              <div className="p-5 space-y-2.5">
                <div className="h-3 w-2/3 bg-surface-container-low rounded"></div>
                <div className="h-3 w-1/3 bg-surface-container-low rounded"></div>
                <div className="h-8 w-full bg-surface-container-low rounded mt-4"></div>
              </div>
            </div>
          ))}

        {nodes.map((d) => (
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group" key={d.name}>
            <div className="relative h-40 w-full overflow-hidden">
              <img
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={`https://picsum.photos/seed/${encodeURIComponent(d.name.toLowerCase().replace(/\s+/g, '-'))}/600/300`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_COLORS[d.severity] ?? '#eab308' }}></span>
                <span className="font-label-xs text-label-xs text-on-surface font-medium">
                  AQI {d.us_aqi ?? '–'} • {d.severity}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block">
                  {d.lat.toFixed(2)}°N {d.lng.toFixed(2)}°E
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">{d.name}</h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="font-label-xs text-label-xs bg-surface-container-low px-2 py-1 rounded-lg text-on-surface-variant">
                    Wind {d.wind_kmh != null ? Math.round(d.wind_kmh) : '–'} km/h
                  </span>
                  <span className="font-label-xs text-label-xs bg-surface-container-low px-2 py-1 rounded-lg text-on-surface-variant">
                    Humidity {d.humidity ?? '–'}%
                  </span>
                  <span className="font-label-xs text-label-xs bg-surface-container-low px-2 py-1 rounded-lg text-on-surface-variant">
                    PM2.5 {d.pm2_5 ?? '–'}
                  </span>
                </div>
              </div>
              <div className="pt-4 mt-4 flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  {d.temp != null ? Math.round(d.temp) : '–'}°C
                </span>
                <button
                  className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high font-label-md text-label-md text-on-surface font-medium transition-colors"
                  onClick={() => {
                    const next = expandedId === d.name ? null : d.name;
                    setExpandedId(next);
                    setSelectedArea(next);
                  }}
                  type="button"
                >
                  {expandedId === d.name ? 'Collapse' : 'View District'}
                </button>
              </div>
              <div className="mt-3 pt-3 bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{d.tip}</span>
              </div>
              {expandedId === d.name && (
                <div className="mt-3 border-t border-surface-container pt-3 flex flex-col gap-space-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-container-low rounded-xl p-2.5">
                      <span className="block font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">Coordinates</span>
                      <span className="block font-mono text-body-sm text-body-sm text-on-surface mt-0.5">{d.lat.toFixed(4)}°N, {d.lng.toFixed(4)}°E</span>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-2.5">
                      <span className="block font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">Air Status</span>
                      <span className="block font-body-sm text-body-sm text-on-surface mt-0.5">PM2.5 {d.pm2_5 ?? '–'} µg/m³</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-2.5">
                    <span className="block font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Sensor actions</span>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/weather" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[15px] text-secondary">thermostat</span> Full forecast
                      </Link>
                      <Link href="/complaints" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[15px] text-error">campaign</span> File ward complaint
                      </Link>
                      <Link href="/insights" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[15px] text-secondary">insights</span> Correlations
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
