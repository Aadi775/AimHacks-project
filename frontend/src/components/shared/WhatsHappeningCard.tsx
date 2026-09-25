'use client';

import { useEffect, useState, useTransition } from 'react';
import { useCity } from '@/context/CityContext';

export interface CivicInsightData {
  city: string;
  area: string | null;
  location_display: string;
  summary: string;
  breakdown: {
    now: string;
    unusual_signals: string[];
    signals_text: string;
    relationship: string;
    why_it_matters: string;
    what_next: string;
  };
  signals: {
    weather: {
      condition: string;
      temp: number | null;
      humidity: number | null;
      wind_kmh: number | null;
      status: string;
    };
    traffic: {
      speed_kmh: number | null;
      congestion: string;
      corridor: string;
      status: string;
    };
    transit: {
      delay_minutes: number | null;
      cause: string;
      status: string;
    };
    air_quality: {
      aqi: number | null;
      severity: string | null;
      pm2_5: number | null;
      status: string;
    };
    grid: {
      load_percent: number | null;
      frequency_hz: number | null;
      status: string;
    };
  };
  forecast: {
    available: boolean;
    text: string;
    next_hours: number;
  };
  feeds_status: Record<string, string>;
  generated_at: string;
}

interface WhatsHappeningCardProps {
  compact?: boolean;
  className?: string;
}

export default function WhatsHappeningCard({ compact = false, className = '' }: WhatsHappeningCardProps) {
  const { city, selectedArea, setSelectedArea } = useCity();
  const [data, setData] = useState<CivicInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [, startTransition] = useTransition();

  // Load available areas for the city
  useEffect(() => {
    if (!city) return;
    fetch(`http://localhost:8001/api/neighborhoods?city=${encodeURIComponent(city.name)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.nodes) {
          const names = d.nodes.map((n: { name: string }) => n.name);
          setAvailableAreas(names);
        } else {
          setAvailableAreas([]);
        }
      })
      .catch(() => setAvailableAreas([]));
  }, [city]);

  // Fetch the civic insight whenever city or selectedArea changes, or interval fires
  useEffect(() => {
    if (!city) return;
    let isMounted = true;

    const fetchInsight = () => {
      setLoading(true);
      setError(null);
      const url = new URL('http://localhost:8001/api/civic-insight');
      url.searchParams.set('city', city.name);
      if (selectedArea && selectedArea !== 'Citywide') {
        url.searchParams.set('area', selectedArea);
      }

      fetch(url.toString())
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((res: CivicInsightData) => {
          if (!isMounted) return;
          setData(res);
          setLoading(false);
          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error('[WhatsHappeningCard] Error fetching insight:', err);
          setError('Live civic telemetry stream syncing...');
          setLoading(false);
        });
    };

    fetchInsight();
    const interval = setInterval(fetchInsight, 30000); // 30-sec live poll

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [city, selectedArea]);

  const handleAreaChange = (area: string | null) => {
    startTransition(() => {
      setSelectedArea(area);
    });
  };

  const hasAnomalies =
    data &&
    (data.signals.weather.status === 'ANOMALY' ||
      data.signals.traffic.status === 'ANOMALY' ||
      data.signals.transit.status === 'ANOMALY' ||
      data.signals.air_quality.status === 'ANOMALY');

  const staleFeeds = data
    ? Object.entries(data.feeds_status)
        .filter(([, status]) => status === 'stale')
        .map(([feed]) => feed)
    : [];

  return (
    <div
      id="whats-happening-card"
      className={`relative w-full rounded-3xl bg-surface-container-lowest/95 backdrop-blur-xl border border-surface-container shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all overflow-hidden ${className}`}
    >
      {/* Top Gradient Accent Bar */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${
          hasAnomalies
            ? 'from-amber-500 via-rose-500 to-primary'
            : 'from-primary via-teal-400 to-on-tertiary-container'
        }`}
      />

      <div className="p-5 md:p-6 space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-surface-container/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[20px] text-secondary">psychology_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
                  What’s happening?
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-xs text-label-xs font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  AI Civic Insight
                </span>
              </div>
              <p className="font-label-xs text-label-xs text-on-surface-variant mt-0.5">
                Resident-friendly telemetry synthesis • Grounded in verified civic data
              </p>
            </div>
          </div>

          {/* Area / District Selector Dropdown & Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative inline-flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                location_on
              </span>
              <select
                id="whats-happening-area-select"
                aria-label="Filter insight by area"
                value={selectedArea ?? 'Citywide'}
                onChange={(e) => handleAreaChange(e.target.value === 'Citywide' ? null : e.target.value)}
                className="pl-8 pr-8 py-1.5 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-medium border border-surface-container hover:bg-surface-container transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="Citywide">Whole City ({city?.name ?? 'Citywide'})</option>
                {availableAreas.map((areaName) => (
                  <option key={areaName} value={areaName}>
                    {areaName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 text-[16px] text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>

            <button
              type="button"
              title="Refresh live insight"
              onClick={() => {
                setLoading(true);
                fetch(`http://localhost:8001/api/civic-insight?city=${encodeURIComponent(city?.name ?? 'jaipur')}${selectedArea ? `&area=${encodeURIComponent(selectedArea)}` : ''}`)
                  .then((r) => r.json())
                  .then((d) => {
                    setData(d);
                    setLoading(false);
                    setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                  })
                  .catch(() => setLoading(false));
              }}
              className="p-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all"
            >
              <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
                sync
              </span>
            </button>
          </div>
        </div>

        {/* Quick Area Filter Pills (if areas available) */}
        {availableAreas.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-nowrap">
            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider pr-1">
              Focus Area:
            </span>
            <button
              type="button"
              onClick={() => handleAreaChange(null)}
              className={`px-3 py-1 rounded-full font-label-xs text-label-xs font-semibold transition-all ${
                !selectedArea || selectedArea === 'Citywide'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Citywide
            </button>
            {availableAreas.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => handleAreaChange(a)}
                className={`px-3 py-1 rounded-full font-label-xs text-label-xs font-semibold transition-all ${
                  selectedArea === a
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        {loading && !data && (
          <div className="py-6 flex items-center justify-center space-x-3 text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
            <span className="font-body-sm text-body-sm font-medium">
              Synthesizing live telemetry and correlation models…
            </span>
          </div>
        )}

        {error && !data && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>{error}</span>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Primary Resident-Friendly Explanation */}
            <div className="bg-surface-container-low/70 rounded-2xl p-4 md:p-5 border border-surface-container/50">
              <p
                id="civic-insight-text"
                className="font-body-md text-body-md md:text-body-lg text-on-surface font-medium leading-relaxed"
              >
                {data.summary}
              </p>
            </div>

            {/* Grounded Live Telemetry Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {/* Weather Chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-label-xs text-label-xs font-semibold border ${
                  data.signals.weather.status === 'ANOMALY'
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">thermostat</span>
                <span>
                  {data.signals.weather.temp != null ? `${Math.round(data.signals.weather.temp)}°C` : '–'} •{' '}
                  {data.signals.weather.condition}
                </span>
                {data.signals.weather.status === 'ANOMALY' && (
                  <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] uppercase">Alert</span>
                )}
              </div>

              {/* Traffic Chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-label-xs text-label-xs font-semibold border ${
                  data.signals.traffic.status === 'ANOMALY'
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/20'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-amber-600">traffic</span>
                <span>
                  {data.signals.traffic.speed_kmh != null ? `${Math.round(data.signals.traffic.speed_kmh)} km/h` : '–'}{' '}
                  • {data.signals.traffic.congestion.replace('_', ' ').toLowerCase()}
                </span>
                {data.signals.traffic.status === 'ANOMALY' && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] uppercase">Slow</span>
                )}
              </div>

              {/* Transit Chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-label-xs text-label-xs font-semibold border ${
                  data.signals.transit.status === 'ANOMALY'
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/20'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-primary">tram</span>
                <span>
                  {data.signals.transit.delay_minutes != null
                    ? `+${data.signals.transit.delay_minutes}m delay`
                    : 'On schedule'}
                </span>
              </div>

              {/* Air Quality Chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-label-xs text-label-xs font-semibold border ${
                  data.signals.air_quality.status === 'ANOMALY'
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-teal-600">air</span>
                <span>
                  AQI {data.signals.air_quality.aqi ?? '–'}{' '}
                  {data.signals.air_quality.severity ? `• ${data.signals.air_quality.severity}` : ''}
                </span>
              </div>

              {/* Grid Chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-label-xs text-label-xs font-semibold bg-surface-container-low text-on-surface border border-surface-container">
                <span className="material-symbols-outlined text-[16px] text-amber-500">bolt</span>
                <span>Grid {data.signals.grid.load_percent ?? '–'}%</span>
              </div>
            </div>

            {/* Stale Feeds Notice (Graceful handling) */}
            {staleFeeds.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant font-label-xs text-label-xs">
                <span className="material-symbols-outlined text-[14px] text-amber-500">sync_problem</span>
                <span>
                  Telemetry for <span className="font-semibold">{staleFeeds.join(', ')}</span> is currently syncing with the sensor network; analysis reflects verified active streams.
                </span>
              </div>
            )}

            {/* Collapsible 5-Point Resident Breakdown */}
            <div className="pt-2">
              <button
                type="button"
                id="toggle-breakdown-btn"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="inline-flex items-center gap-1.5 font-label-xs text-label-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <span>{showBreakdown ? 'Hide Detailed Civic Breakdown' : 'View 5-Point Telemetry Breakdown'}</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform ${
                    showBreakdown ? 'rotate-180' : ''
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>

              {showBreakdown && (
                <div className="mt-3 p-4 rounded-2xl bg-surface-container-low/50 border border-surface-container space-y-3.5 animate-fadeIn">
                  {/* Point 1: What is happening NOW */}
                  <div className="space-y-1">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 1. What is happening NOW
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface pl-2.5 border-l-2 border-secondary/40">
                      {data.breakdown.now}
                    </p>
                  </div>

                  {/* Point 2: Which signals are unusually high/low */}
                  <div className="space-y-1">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-amber-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 2. Unusually High / Low Signals
                    </span>
                    <ul className="pl-2.5 border-l-2 border-amber-500/40 space-y-1">
                      {data.breakdown.unusual_signals.map((sig, i) => (
                        <li key={i} className="font-body-sm text-body-sm text-on-surface flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Point 3: Possible relationships between them */}
                  <div className="space-y-1">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 3. Possible Relationships / Correlations
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface pl-2.5 border-l-2 border-primary/40 font-medium">
                      {data.breakdown.relationship}
                    </p>
                    <span className="block text-[11px] text-on-surface-variant pl-2.5 italic">
                      * Statistical correlation indicates co-occurring trends; it does not claim causation.
                    </span>
                  </div>

                  {/* Point 4: Why it matters */}
                  <div className="space-y-1">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-rose-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 4. Why it Matters
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface pl-2.5 border-l-2 border-rose-500/40">
                      {data.breakdown.why_it_matters}
                    </p>
                  </div>

                  {/* Point 5: What may happen NEXT */}
                  <div className="space-y-1">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-teal-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> 5. What May Happen NEXT
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface pl-2.5 border-l-2 border-teal-500/40">
                      {data.breakdown.what_next}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer: Metadata & Grounding Notice */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-container/40 text-[11px] text-on-surface-variant font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                Grounded in active municipal telemetry • Updated {lastRefreshed}
              </span>
              <span>
                {data.location_display} • {data.city}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
