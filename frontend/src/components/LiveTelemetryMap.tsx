'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import { CivicEvent, City } from '@/types';
import { useCity } from '@/context/CityContext';
import MapBoundary from '@/components/shared/MapBoundary';
import { AQI_SEVERITY_COLORS, WeatherData, GeoResult, API_BASE, WS_BASE } from '@/lib/cities';

const WS_URL = `${WS_BASE}/ws/pulse`;
const MAX_EVENTS = 300;
const EVENT_TTL_MS = 3 * 60 * 1000;

// Basemap provider — set NEXT_PUBLIC_MAP_PROVIDER in .env.local:
//   esri     → keyless dark gray canvas (default, no signup)
//   mapbox   → needs NEXT_PUBLIC_MAPBOX_TOKEN (card required, free <50k loads/mo)
//   maptiler → needs NEXT_PUBLIC_MAPTILER_KEY (free key, no card)
//   carto    → needs NEXT_PUBLIC_CARTO_KEY (free key)
const PROVIDER = (process.env.NEXT_PUBLIC_MAP_PROVIDER ?? 'osm').toLowerCase();
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? '';
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY ?? '';

// Terminal GIS status system (functional colors only)
const SEVERITY_COLORS: Record<string, string> = {
  INFO: '#3B82F6',
  WARNING: '#F59E0B',
  CRITICAL: '#EF4444',
};
const CONGESTION_COLORS: Record<string, string> = {
  FREE_FLOW: '#10B981',
  MODERATE: '#F59E0B',
  HEAVY: '#EF4444',
};

function sqPulseIcon(severity: string) {
  const color = SEVERITY_COLORS[severity] ?? '#3B82F6';
  return L.divIcon({
    className: 'cp-sq-wrapper',
    html: `<span class="cp-sq" style="--cp-color:${color}"></span>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function utcTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(11, 19);
  } catch {
    return '--:--:--';
  }
}

function timeAgo(iso: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return mins < 1 ? 'now' : `${mins}m`;
}

function MapFly({ city }: { city: City | null }) {
  const map = useMap();
  useEffect(() => {
    if (city) map.flyTo([city.lat, city.lng], 12, { duration: 1.2 });
  }, [city, map]);
  return null;
}

function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  useEffect(() => {
    interface HeatOptions { radius: number; blur: number; maxZoom: number; gradient: Record<number, string> }
    const options: HeatOptions = {
      radius: 28,
      blur: 20,
      maxZoom: 14,
      gradient: { 0.15: 'rgba(16,185,129,0)', 0.3: '#10B981', 0.55: '#F59E0B', 0.85: '#EF4444' },
    };
    // heatLayer is attached to L by leaflet.heat (untyped)
    const heatFn = (L as unknown as { heatLayer: (pts: [number, number, number][], opts: HeatOptions) => { addTo: (m: unknown) => void } }).heatLayer;
    if (typeof heatFn !== 'function') return;
    const layer = heatFn(points, options);
    layer.addTo(map);
    return () => {
      map.removeLayer(layer as never);
    };
  }, [map, points]);
  return null;
}

function StatusProbe({ onMove }: { onMove: (info: { lat: number; lng: number; zoom: number }) => void }) {
  const map = useMapEvents({
    moveend: () => onMove({ lat: map.getCenter().lat, lng: map.getCenter().lng, zoom: map.getZoom() }),
    zoomend: () => onMove({ lat: map.getCenter().lat, lng: map.getCenter().lng, zoom: map.getZoom() }),
  });
  useEffect(() => {
    onMove({ lat: map.getCenter().lat, lng: map.getCenter().lng, zoom: map.getZoom() });
  }, [map, onMove]);
  return null;
}

interface VehicleState {
  line: string;
  operator: string;
  mode: string;
  lat: number;
  lng: number;
  path: [number, number][];
  delay: number;
  cause: string;
  ts: number;
}

function vehicleIcon(mode: string, delayed: boolean) {
  const color = delayed ? '#F59E0B' : '#10B981';
  const icon = mode === 'metro' || mode === 'rail' ? 'tram' : 'directions_bus';
  return L.divIcon({
    className: 'cp-veh-wrapper',
    html: `<span class="cp-veh" style="--cp-veh-color:${color}"><span class="material-symbols-outlined" style="font-size:13px">${icon}</span></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function LiveTelemetryMap() {
  const { city: selectedCity, cities, setCity: setSelectedCity, addCityToList } = useCity();
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [query, setQuery] = useState('');
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [connected, setConnected] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewInfo, setViewInfo] = useState({ lat: 26.9124, lng: 75.7873, zoom: 12 });
  const [mobileView, setMobileView] = useState<'MAP' | 'FEED' | 'TABLE'>('MAP');
  const [tableOpen, setTableOpen] = useState(true);
  const [mapKey, setMapKey] = useState(0);
  const [mapFailed, setMapFailed] = useState(false);

  // Self-heal: a failed Leaflet init remounts the map on a fresh container
  useEffect(() => {
    if (mapFailed) {
      setMapFailed(false);
      setMapKey((k) => k + 1);
    }
  }, [mapFailed]);
  const wsRef = useRef<WebSocket | null>(null);
  const eventsRef = useRef<CivicEvent[]>([]);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const [vehicles, setVehicles] = useState<Record<string, VehicleState>>({});
  const vehiclesRef = useRef<Record<string, VehicleState>>({});
  const [trafficHistory, setTrafficHistory] = useState<[number, number, number][]>([]);
  const trafficHistRef = useRef<[number, number, number][]>([]);
  // Persistent corridor segments: latest state per corridor, kept up to 30 min
  const [segments, setSegments] = useState<
    Record<string, { id: string; waypoints: [number, number][]; level: string; speed: number; desc: string; corridor: string; ts: number }>
  >({});
  const segmentsRef = useRef<Record<string, { id: string; waypoints: [number, number][]; level: string; speed: number; desc: string; corridor: string; ts: number }>>({});

  // Hydrate history for selected city from the SQL DB (last 12h traffic for the persistent heatmap)
  useEffect(() => {
    if (!selectedCity) return;
    const cname = encodeURIComponent(selectedCity.name.toLowerCase());
    fetch(`${API_BASE}/api/events?city=${cname}&limit=150`)
      .then((r) => r.json())
      .then((history: CivicEvent[]) => {
        // Ledger = meaningful telemetry only: resident reports + live weather.
        // (traffic lives in the corridor layer, vehicles in the vehicle layer)
        const meaningful = history.filter((e) => e.category === 'weather' || e.category === 'report');
        eventsRef.current = meaningful;
        setEvents(meaningful);
      })
      .catch(() => console.error('[CivicPulse] Failed to load event history'));

    // Persistent traffic heatmap: 12h of congestion segments
    fetch(`${API_BASE}/api/events?city=${cname}&limit=500&hours=12`)
      .then((r) => r.json())
      .then((long: CivicEvent[]) => {
        const weights: Record<string, number> = { FREE_FLOW: 0.12, MODERATE: 0.55, HEAVY: 1.0 };
        const pts: [number, number, number][] = [];
        long
          .filter((e) => e.category === 'traffic' && e.waypoints?.length)
          .slice(-400)
          .forEach((e) => {
            const w = weights[(e.metadata?.congestion as string) ?? 'MODERATE'] ?? 0.5;
            (e.waypoints ?? []).forEach(([lat, lng]) => pts.push([lat, lng, w]));
          });
        trafficHistRef.current = pts;
        setTrafficHistory(pts);
      })
      .catch(() => {});

    // Vehicles: latest snapshot per line from history
    vehiclesRef.current = {};
    setVehicles({});

    // Corridor segments: latest state per corridor from the last 12h
    fetch(`${API_BASE}/api/events?city=${cname}&limit=500&hours=12`)
      .then((r) => r.json())
      .then((long: CivicEvent[]) => {
        const segs: typeof segmentsRef.current = {};
        long
          .filter((e) => e.category === 'traffic' && e.waypoints?.length)
          .forEach((e) => {
            const corridor = String(e.metadata?.corridor ?? 'Corridor');
            segs[corridor] = {
              id: e.id,
              waypoints: e.waypoints as [number, number][],
              level: String(e.metadata?.congestion ?? 'MODERATE'),
              speed: Number(e.metadata?.speed_kmh ?? 0),
              desc: e.description,
              corridor,
              ts: new Date(e.timestamp).getTime(),
            };
          });
        segmentsRef.current = segs;
        setSegments(segs);
      })
      .catch(() => {});
  }, [selectedCity]);

  // Real weather for the selected city (any city — via OpenMeteo through backend)
  useEffect(() => {
    if (!selectedCity) return;
    setWeather(null);
    fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(selectedCity.name)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: WeatherData) => setWeather(data))
      .catch(() => setWeather(null));
    const refresh = setInterval(() => {
      fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(selectedCity.name)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data: WeatherData) => setWeather(data))
        .catch(() => {});
    }, 120000);
    return () => clearInterval(refresh);
  }, [selectedCity]);

  // WebSocket live stream
  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;
        ws.onopen = () => setConnected(true);
        ws.onclose = () => {
          setConnected(false);
          reconnectTimer = setTimeout(connect, 4000);
        };
        ws.onerror = () => ws.close();
        ws.onmessage = (msg) => {
          try {
            const ev: CivicEvent = JSON.parse(msg.data);
            const now = Date.now();

            // Live transit vehicles -> dedicated vehicle layer (not the event ledger)
            const meta = ev.metadata as Record<string, unknown> | undefined;
            if (ev.category === 'transit' && meta?.vehicle) {
              const routePath = (meta.route_path as [number, number][]) ?? [];
              vehiclesRef.current[String(meta.line)] = {
                line: String(meta.line ?? '?'),
                operator: String(meta.operator ?? ''),
                mode: String(meta.mode ?? 'bus'),
                lat: ev.lat,
                lng: ev.lng,
                path: routePath,
                delay: Number(meta.delay_minutes ?? 0),
                cause: String(meta.cause ?? ''),
                ts: now,
              };
              // prune vehicles silent > 90s
              const vset = { ...vehiclesRef.current };
              Object.keys(vset).forEach((k) => {
                if (now - vset[k].ts > 90000) delete vset[k];
              });
              vehiclesRef.current = vset;
              setVehicles(vset);
              return;
            }

            // Traffic: persistent corridor layer + heat ONLY — never floods the ledger
            if (ev.category === 'traffic' && ev.waypoints?.length) {
              const weights: Record<string, number> = { FREE_FLOW: 0.12, MODERATE: 0.55, HEAVY: 1.0 };
              const w = weights[(meta?.congestion as string) ?? 'MODERATE'] ?? 0.5;
              const appended = [...trafficHistRef.current, ...(ev.waypoints ?? []).map(([lat, lng]) => [lat, lng, w] as [number, number, number])];
              if (appended.length > 600) appended.splice(0, appended.length - 600);
              trafficHistRef.current = appended;
              setTrafficHistory(appended);

              // Update the corridor's latest state (lanes stay until replaced, max 30 min)
              const corridor = String(meta?.corridor ?? 'Corridor');
              const segSet = { ...segmentsRef.current };
              segSet[corridor] = {
                id: ev.id,
                waypoints: ev.waypoints as [number, number][],
                level: String(meta?.congestion ?? 'MODERATE'),
                speed: Number(meta?.speed_kmh ?? 0),
                desc: ev.description,
                corridor,
                ts: now,
              };
              const cutoff = now - 30 * 60 * 1000;
              Object.keys(segSet).forEach((k) => {
                if (segSet[k].ts < cutoff) delete segSet[k];
              });
              segmentsRef.current = segSet;
              setSegments(segSet);
              return; // <- traffic never enters the event ledger
            }

            const next = [
              ...eventsRef.current.filter((e) => now - new Date(e.timestamp).getTime() < EVENT_TTL_MS),
              ev,
            ];
            if (next.length > MAX_EVENTS) next.splice(0, next.length - MAX_EVENTS);
            eventsRef.current = next;
            setEvents(next);
          } catch {
            /* ignore malformed frames */
          }
        };
      } catch {
        reconnectTimer = setTimeout(connect, 4000);
      }
    };

    connect();
    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, []);

  // Prune stale events periodically
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      const pruned = eventsRef.current.filter((e) => now - new Date(e.timestamp).getTime() < EVENT_TTL_MS);
      if (pruned.length !== eventsRef.current.length) {
        eventsRef.current = pruned;
        setEvents(pruned);
      }
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll telemetry ledger to newest
  useEffect(() => {
    if (ledgerRef.current) ledgerRef.current.scrollTop = 0;
  }, [events]);

  const cityEvents = useMemo(() => {
    if (!selectedCity) return [];
    const cname = selectedCity.name.toLowerCase();
    return events.filter((e) => e.city === cname);
  }, [events, selectedCity]);

  const trafficSegments = useMemo(
    () => Object.values(segments).filter((seg) => seg.waypoints.length >= 2),
    [segments]
  );
  // Traffic heat points: persistent history (12h) + live segments — congestion zones accumulate
  const heatPoints = useMemo(() => [...trafficHistory], [trafficHistory]);

  const vehicleList = useMemo(() => Object.values(vehicles), [vehicles]);
  const delayedVehicles = useMemo(() => vehicleList.filter((v) => v.delay >= 4).length, [vehicleList]);

  const pointEvents = useMemo(
    () => cityEvents.filter((e) => !(e.category === 'traffic' && e.waypoints && e.waypoints.length >= 2)),
    [cityEvents]
  );
  const tableEvents = useMemo(() => [...cityEvents].reverse().slice(0, 40), [cityEvents]);

  const eventStats = useMemo(() => {
    const counts = { INFO: 0, WARNING: 0, CRITICAL: 0 };
    cityEvents.forEach((e) => {
      if (e.severity in counts) counts[e.severity as keyof typeof counts] += 1;
    });
    return counts;
  }, [cityEvents]);

  const cityMatches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5);
  }, [cities, query]);

  const lookupGeo = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setGeoResults([]);
      return;
    }
    try {
      const r = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
      );
      const data = await r.json();
      const results: GeoResult[] = data.results ?? [];
      results.sort((a, b) => (b.country_code === 'IN' ? 1 : 0) - (a.country_code === 'IN' ? 1 : 0));
      setGeoResults(results.slice(0, 4));
    } catch {
      setGeoResults([]);
    }
  }, []);

  const addAndSelectCity = useCallback(
    async (c: { name: string; state?: string; lat: number; lng: number }) => {
      try {
        const r = await fetch(`${API_BASE}/api/cities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: c.name, state: c.state ?? '', lat: c.lat, lng: c.lng }),
        });
        const city: City = await r.json();
        addCityToList(city);
      } catch {
        addCityToList({ id: -1, name: c.name, state: c.state ?? '', lat: c.lat, lng: c.lng, is_default: false });
      }
      setQuery('');
      setGeoResults([]);
      setSearchOpen(false);
    },
    [addCityToList]
  );

  const handleSearch = useCallback(async () => {
    if (cityMatches.length > 0) {
      setSelectedCity(cityMatches[0]);
      setQuery('');
      setSearchOpen(false);
      return;
    }
    if (query.trim().length >= 3) await lookupGeo(query);
  }, [cityMatches, query, lookupGeo, setSelectedCity]);

  const fmtCoord = (v: number, axis: 'lat' | 'lng') => {
    const dir = axis === 'lat' ? (v >= 0 ? 'N' : 'S') : v >= 0 ? 'E' : 'W';
    return `${Math.abs(v).toFixed(4)}°${dir}`;
  };

  return (
    <div className="w-full max-w-full rounded-none bg-[#020617] border border-[#1E293B] text-[#dae2fd] overflow-hidden">
      {/* ============ TOP STATUS BAR ============ */}
      <div className="flex flex-wrap items-stretch gap-0 border-b border-[#1E293B] bg-[#0F172A] divide-x divide-[#1E293B]">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 h-8">
          <span className="w-1 h-1" style={{ background: connected ? '#10B981' : '#F59E0B' }}></span>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: connected ? '#10B981' : '#F59E0B' }}>
            {connected ? 'LIVE' : 'SYNC…'}
          </span>
        </div>

        {/* City search */}
        <div className="relative flex-1 min-w-0 lg:min-w-[180px]">
          <div className="flex items-center h-8">
            <span className="material-symbols-outlined text-[13px] text-[#64748B] ml-2 mr-1 select-none">location_city</span>
            <input
              className="w-full h-8 bg-transparent font-mono text-[11px] text-[#dae2fd] placeholder:text-[#475569] focus:outline-none uppercase"
              id="terminalCitySearch"
              placeholder="SEARCH CITY — INDIA OR WORLDWIDE"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
                lookupGeo(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => setSearchOpen(true)}
            />
          </div>
          {searchOpen && (cityMatches.length > 0 || geoResults.length > 0) && (
            <div className="absolute top-full left-0 right-0 bg-[#0F172A] border border-[#334155] rounded-none shadow-2xl z-[1001]">
              {cityMatches.map((c) => (
                <button
                  key={`m-${c.id}`}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] transition-colors flex items-center justify-between"
                  onClick={() => {
                    setSelectedCity(c);
                    setQuery('');
                    setSearchOpen(false);
                  }}
                  type="button"
                >
                  <span className="font-mono text-[11px] text-[#dae2fd] uppercase">{c.name}</span>
                  <span className="font-mono text-[9px] text-[#64748B] uppercase">{c.state}</span>
                </button>
              ))}
              {geoResults.map((g, i) => (
                <button
                  key={`g-${i}`}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] transition-colors flex items-center justify-between border-t border-[#1E293B]"
                  onClick={() => addAndSelectCity({ name: g.name, state: g.admin1, lat: g.latitude, lng: g.longitude })}
                  type="button"
                >
                  <span className="font-mono text-[11px] text-[#dae2fd] uppercase">
                    {g.name}
                    {g.country_code === 'IN' && <span className="ml-1.5 text-[9px] text-[#10B981]">IN</span>}
                  </span>
                  <span className="font-mono text-[9px] text-[#64748B] uppercase">
                    {g.admin1 ?? ''} {g.country ?? ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active city */}
        <div className="hidden sm:flex items-center px-3 h-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
            AO: <span className="text-[#3B82F6]">{selectedCity?.name?.toUpperCase() ?? '—'}</span>
          </span>
        </div>

        {/* Center coords + zoom */}
        <div className="hidden md:flex items-center px-3 h-8">
          <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
            {fmtCoord(viewInfo.lat, 'lat')} {fmtCoord(viewInfo.lng, 'lng')} · Z{viewInfo.zoom}
          </span>
        </div>

        {/* Vehicle + event counters */}
        <div className="flex items-center gap-3 px-3 h-8">
          <span className="font-mono text-[10px] text-[#64748B]">
            VEH:<span className="text-[#dae2fd]">{vehicleList.length}</span>
            {delayedVehicles > 0 && <span style={{ color: '#F59E0B' }}> ({delayedVehicles}D)</span>}
          </span>
          <span className="font-mono text-[10px] text-[#64748B]">
            EV:<span className="text-[#dae2fd]">{cityEvents.length}</span>
          </span>
          <span className="font-mono text-[10px]" style={{ color: '#EF4444' }}>{eventStats.CRITICAL}C</span>
          <span className="font-mono text-[10px]" style={{ color: '#F59E0B' }}>{eventStats.WARNING}W</span>
          <span className="font-mono text-[10px]" style={{ color: '#3B82F6' }}>{eventStats.INFO}I</span>
        </div>

        {/* Weather readout */}
        {weather && (
          <div className="hidden lg:flex items-center px-3 h-8 gap-3">
            <span className="font-mono text-[10px] text-[#dae2fd]">
              {weather.current.temp != null ? `${Math.round(weather.current.temp)}°C` : '–'} {weather.current.condition.toUpperCase()}
            </span>
            <span className="w-px h-3 bg-[#1E293B]"></span>
            <span className="font-mono text-[10px]" style={{ color: AQI_SEVERITY_COLORS[weather.air_quality.severity] ?? '#eab308' }}>
              AQI {weather.air_quality.us_aqi ?? '–'}
            </span>
          </div>
        )}
      </div>

      {/* ============ MAIN DECK: MAP + TELEMETRY LEDGER ============ */}
      <div className="flex flex-col lg:flex-row">
        {/* Vector map canvas */}
        <div className={`${mobileView === 'MAP' ? 'block' : 'hidden'} lg:block lg:flex-1 min-w-0 relative h-[520px] lg:h-[600px] overflow-hidden`}>
          <MapBoundary onError={() => setMapFailed(true)}>
          <MapContainer
            key={mapKey}
            center={[selectedCity?.lat ?? 26.9124, selectedCity?.lng ?? 75.7873]}
            zoom={12}
            zoomControl={false}
            scrollWheelZoom
            className="h-full w-full rounded-none"
            style={{ background: '#020617' }}
          >
            {PROVIDER === 'osm' && (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="cp-osm-dark"
              />
            )}
            {PROVIDER === 'esri' && (
              <>
                <TileLayer
                  attribution='Tiles &copy; Esri, HERE, Garmin, FAO, NOAA, USGS'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                />
                <TileLayer
                  attribution=""
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                />
              </>
            )}
            {PROVIDER === 'mapbox' && MAPBOX_TOKEN && (
              <TileLayer
                attribution="&copy; Mapbox"
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
              />
            )}
            {PROVIDER === 'maptiler' && MAPTILER_KEY && (
              <TileLayer
                attribution="&copy; MapTiler"
                url={`https://api.maptiler.com/maps/dark/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
              />
            )}
            {PROVIDER === 'carto' && CARTO_KEY && (
              <TileLayer
                attribution="&copy; OpenStreetMap &copy; CARTO"
                url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${CARTO_KEY}`}
                subdomains={['a', 'b', 'c', 'd']}
              />
            )}
            <MapFly city={selectedCity} />
            <StatusProbe onMove={setViewInfo} />

            {/* Traffic congestion heatmap (weighted by severity) */}
            {heatPoints.length >= 2 && <HeatLayer points={heatPoints} />}

            {/* Live transit vehicles on real routes */}
            {vehicleList.map((v) => (
              <Fragment key={v.line}>
                {v.path.length >= 2 && (
                  <Polyline positions={v.path} pathOptions={{ color: v.mode === 'bus' ? '#10B981' : '#3B82F6', weight: 2, opacity: 0.45, dashArray: '4 4' }} />
                )}
                <Marker icon={vehicleIcon(v.mode, v.delay >= 4)} position={[v.lat, v.lng]}>
                  <Popup>
                    <div className="font-mono text-[10px]" style={{ minWidth: 180 }}>
                      <strong>{v.line.toUpperCase()}</strong>
                      <br />
                      <span className="text-[#64748B]">{v.operator.toUpperCase()}</span>
                      <br />
                      {v.delay >= 1 ? (
                        <span style={{ color: '#F59E0B' }}>+{v.delay.toFixed(1)}m DELAY</span>
                      ) : (
                        <span style={{ color: '#10B981' }}>ON SCHEDULE</span>
                      )}
                      <br />
                      CAUSE: {v.cause.toUpperCase()}
                    </div>
                  </Popup>
                </Marker>
              </Fragment>
            ))}

            {/* Traffic congestion corridors — persistent latest-state per lane */}
            {trafficSegments.map((seg) => {
              const color = CONGESTION_COLORS[seg.level] ?? '#F59E0B';
              return (
                <Polyline
                  key={seg.corridor}
                  positions={seg.waypoints}
                  pathOptions={{ color, weight: 4, opacity: 0.9, lineCap: 'butt' }}
                >
                  <Popup>
                    <div className="font-mono text-[10px]">
                      <strong>{seg.corridor.toUpperCase()}</strong>
                      <br />
                      {seg.level.replace('_', ' ')} · {seg.speed} KM/H
                      <br />
                      {seg.desc}
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

            {/* Live event markers */}
            {pointEvents.map((ev) => (
              <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={sqPulseIcon(ev.severity)}>
                <Popup>
                  <div className="font-mono text-[10px]" style={{ minWidth: 170 }}>
                    <span
                      className="inline-block px-1 py-0.5 mb-1 text-[9px] font-bold text-[#020617] uppercase"
                      style={{ background: SEVERITY_COLORS[ev.severity] ?? '#3B82F6' }}
                    >
                      {ev.severity}
                    </span>
                    <span className="inline-block px-1 py-0.5 mb-1 ml-1 text-[9px] uppercase border border-[#475569] text-[#94A3B8]">
                      {ev.category}
                    </span>
                    <br />
                    {ev.description}
                    <br />
                    <span className="text-[#64748B]">{utcTime(ev.timestamp)} UTC</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          </MapBoundary>

          {/* Boxy layer legend (floating tool) */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-[#0F172A] border border-[#334155] rounded-none px-3 py-2">
            <div className="text-[9px] uppercase tracking-[0.03em] text-[#64748B] font-semibold mb-1 font-mono">Severity</div>
            <div className="flex items-center gap-3 mb-1.5">
              {Object.entries(SEVERITY_COLORS).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
                  <span className="w-1.5 h-1.5" style={{ background: v }}></span>
                  {k}
                </span>
              ))}
            </div>
            <div className="text-[9px] uppercase tracking-[0.03em] text-[#64748B] font-semibold mb-1 font-mono">Flow</div>
            <div className="flex items-center gap-3 mb-1.5">
              {Object.entries(CONGESTION_COLORS).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
                  <span className="w-3 h-[3px]" style={{ background: v }}></span>
                  {k.replace('_', ' ')}
                </span>
              ))}
            </div>
            <div className="text-[9px] uppercase tracking-[0.03em] text-[#64748B] font-semibold mb-1 font-mono">Vehicles</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
                <span className="w-1.5 h-1.5" style={{ background: '#3B82F6' }}></span> METRO/RAIL
              </span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
                <span className="w-1.5 h-1.5" style={{ background: '#10B981' }}></span> BUS
              </span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
                <span className="w-1.5 h-1.5" style={{ background: '#F59E0B' }}></span> DELAYED
              </span>
            </div>
          </div>

          {/* Weather mini-panel (floating tool, mono) */}
          {weather && (
            <div className="absolute top-3 right-3 z-[1000] bg-[#0F172A] border border-[#334155] rounded-none px-3 py-2 max-w-[290px]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[16px] font-bold text-[#dae2fd] leading-none">
                  {weather.current.temp != null ? Math.round(weather.current.temp) : '–'}°C
                </span>
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase leading-tight">
                  {weather.current.condition}
                  <br />
                  {weather.current.is_day ? 'DAY' : 'NIGHT'} · RH {weather.current.humidity ?? '–'}%
                </span>
                <span className="w-px h-7 bg-[#1E293B] mx-1"></span>
                <span className="font-mono text-[11px] font-bold" style={{ color: AQI_SEVERITY_COLORS[weather.air_quality.severity] ?? '#eab308' }}>
                  AQI {weather.air_quality.us_aqi ?? '–'}
                  <span className="block text-[8px] font-normal">{weather.air_quality.severity}</span>
                </span>
              </div>
              <div className="flex gap-0.5 mt-2 border-t border-[#1E293B] pt-1.5">
                {weather.daily.slice(0, 7).map((d) => (
                  <div key={d.date} className="flex flex-col items-center px-1 bg-[#020617] min-w-[26px]">
                    <span className="font-mono text-[8px] text-[#64748B]">
                      {new Date(d.date).toLocaleDateString('en', { weekday: 'narrow' })}
                    </span>
                    <span className="font-mono text-[9px] text-[#dae2fd]">{d.max != null ? Math.round(d.max) : '–'}°</span>
                    <span className="font-mono text-[8px] text-[#475569]">{d.min != null ? Math.round(d.min) : '–'}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry ledger (right panel) */}
        <div
          className={`${mobileView === 'FEED' ? 'block' : 'hidden'} lg:block w-full lg:w-[320px] lg:max-w-[320px] min-w-0 lg:h-[600px] h-[480px] border-l border-t lg:border-t-0 border-[#1E293B] bg-[#0F172A] flex flex-col`}
        >
          <div className="flex items-center justify-between h-7 px-3 border-b border-[#1E293B] bg-[#090D16] shrink-0">
            <span className="text-[10px] uppercase tracking-[0.03em] font-bold text-[#64748B]">Telemetry Ledger</span>
            <span className="font-mono text-[9px] text-[#64748B]">
              <span style={{ color: '#10B981' }}>●</span> {cityEvents.length} REC
            </span>
          </div>
          <div ref={ledgerRef} className="flex-1 overflow-y-auto">
            {tableEvents.map((e) => (
              <div key={e.id} className="flex items-start gap-2 px-2.5 py-1.5 border-b border-[#161F30] hover:bg-[#1E293B]/60 transition-colors">
                <span className="font-mono text-[9px] text-[#64748B] pt-px shrink-0">{utcTime(e.timestamp)}</span>
                <span
                  className="font-mono text-[8px] font-bold uppercase px-1 py-px shrink-0 border"
                  style={{
                    color: SEVERITY_COLORS[e.severity] ?? '#3B82F6',
                    borderColor: SEVERITY_COLORS[e.severity] ?? '#3B82F6',
                    background: `${SEVERITY_COLORS[e.severity] ?? '#3B82F6'}1A`,
                  }}
                >
                  {e.severity.slice(0, 4)}
                </span>
                <span className="font-mono text-[10px] text-[#c2c6d6] leading-snug break-words min-w-0">
                  <span className="text-[#64748B]">[{e.category.slice(0, 3).toUpperCase()}]</span> {e.description}
                </span>
              </div>
            ))}
            {tableEvents.length === 0 && (
              <div className="flex items-center justify-center h-full font-mono text-[10px] text-[#475569] uppercase">
                AWAITING TELEMETRY…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ BOTTOM: ATTRIBUTES TABLE ============ */}
      <div className={`${mobileView === 'TABLE' ? 'block' : 'hidden'} lg:block border-t border-[#1E293B] bg-[#0F172A]`}>
        <div className="flex items-center justify-between h-7 px-3 border-b border-[#1E293B] bg-[#090D16]">
          <button
            className="flex items-center gap-2 group"
            onClick={() => setTableOpen(!tableOpen)}
            type="button"
          >
            <span className="text-[10px] uppercase tracking-[0.03em] font-bold text-[#64748B] group-hover:text-[#94A3B8]">
              Attributes Table
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#64748B]" style={{ transform: tableOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
              expand_less
            </span>
          </button>
          <span className="font-mono text-[9px] text-[#64748B] uppercase">
            {selectedCity?.name ?? '—'} · last {tableEvents.length} records · ttl 180s
          </span>
        </div>
        {tableOpen && (
          <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-[#090D16]">
                  {['UTC TIME', 'AGE', 'CATEGORY', 'SEVERITY', 'DESCRIPTION', 'LAT', 'LNG'].map((h) => (
                    <th
                      key={h}
                      className={`px-2.5 h-[22px] text-[10px] font-bold uppercase text-[#64748B] border-b border-[#1E293B] whitespace-nowrap ${
                        h === 'LAT' || h === 'LNG' || h === 'UTC TIME' || h === 'AGE' ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableEvents.map((e, i) => (
                  <tr key={e.id} className={`${i % 2 === 0 ? 'bg-[#0F172A]' : 'bg-[#0B1120]'} hover:bg-[#1E293B]/80 border-b border-[#161F30]`}>
                    <td className="px-2.5 h-5 font-mono text-[10px] text-[#8c909f] text-right whitespace-nowrap">{utcTime(e.timestamp)}</td>
                    <td className="px-2.5 h-5 font-mono text-[10px] text-[#64748B] text-right whitespace-nowrap">{timeAgo(e.timestamp)}</td>
                    <td className="px-2.5 h-5 font-mono text-[10px] text-[#94A3B8] uppercase whitespace-nowrap">{e.category}</td>
                    <td className="px-2.5 h-5 whitespace-nowrap">
                      <span
                        className="font-mono text-[8px] font-bold uppercase px-1 py-px border"
                        style={{
                          color: SEVERITY_COLORS[e.severity] ?? '#3B82F6',
                          borderColor: SEVERITY_COLORS[e.severity] ?? '#3B82F6',
                          background: `${SEVERITY_COLORS[e.severity] ?? '#3B82F6'}1A`,
                        }}
                      >
                        {e.severity}
                      </span>
                    </td>
                    <td className="px-2.5 h-5 font-mono text-[10px] text-[#c2c6d6] max-w-[320px] truncate">{e.description}</td>
                    <td className="px-2.5 h-5 font-mono text-[10px] text-[#8c909f] text-right whitespace-nowrap">{e.lat.toFixed(4)}</td>
                    <td className="px-2.5 h-5 font-mono text-[10px] text-[#8c909f] text-right whitespace-nowrap">{e.lng.toFixed(4)}</td>
                  </tr>
                ))}
                {tableEvents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-2.5 py-4 text-center font-mono text-[10px] text-[#475569] uppercase">
                      NO RECORDS IN WINDOW
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ MOBILE VIEW TABS (< lg) ============ */}
      <div className="lg:hidden flex border-t border-[#1E293B] bg-[#090D16]">
        {(['MAP', 'FEED', 'TABLE'] as const).map((v) => (
          <button
            key={v}
            className={`flex-1 h-9 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              mobileView === v ? 'bg-[#1E293B] text-[#dae2fd] font-bold' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
            onClick={() => setMobileView(v)}
            type="button"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
