'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import WhatsHappeningCard from '@/components/shared/WhatsHappeningCard';
import { useCity } from '@/context/CityContext';
import { fetchWeather, AQI_SEVERITY_COLORS, WeatherData, API_BASE } from '@/lib/cities';

const NeighborhoodMap = dynamic(() => import('@/components/NeighborhoodMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-2xl bg-surface-container-low animate-pulse" />,
});

const LiveTelemetryMap = dynamic(() => import('@/components/LiveTelemetryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl bg-surface-container-lowest shadow-sm h-[480px] flex items-center justify-center">
      <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
        Loading telemetry grid…
      </span>
    </div>
  ),
});

export default function OverviewPage() {
  const { city, cities, setCity } = useCity();
  const [clockTime, setClockTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [wx, setWx] = useState<WeatherData | null>(null);
  const [headlines, setHeadlines] = useState<{ category: string; title: string; org: string; status: string; severity: string; time: string; kind: string }[]>([]);
  const [score, setScore] = useState<{ composite: number; grade: string; trend: number; subscores: Record<string, { score: number; label: string; detail: string; icon: string }> } | null>(null);
  const [grid, setGrid] = useState<{ load_percent: number; demand_mw: number; installed_mw: number; frequency_hz: number; mix: Record<string, number>; load_curve: number[]; peak_hour: number; discom: string } | null>(null);

  useEffect(() => {
    const update = () => {
      setClockTime(new Date().toLocaleString());
      const h = new Date().getHours();
      setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!city) return;
    fetchWeather(city.name)
      .then(setWx)
      .catch(() => setWx(null));
    const loadScoreGrid = () => {
      fetch(`${API_BASE}/api/score?city=${encodeURIComponent(city.name)}`)
        .then((r) => r.json()).then(setScore).catch(() => {});
      fetch(`${API_BASE}/api/grid?city=${encodeURIComponent(city.name)}`)
        .then((r) => r.json()).then(setGrid).catch(() => {});
    };
    loadScoreGrid();
    const tg = setInterval(loadScoreGrid, 60000);
    return () => clearInterval(tg);
  }, [city]);

  useEffect(() => {
    if (!city) return;
    const loadHeadlines = () => {
      fetch(`${API_BASE}/api/headlines?city=${encodeURIComponent(city.name)}`)
        .then((r) => r.json())
        .then((d) => setHeadlines(d.headlines ?? []))
        .catch(() => setHeadlines([]));
    };
    loadHeadlines();
    const t = setInterval(loadHeadlines, 45000);
    return () => clearInterval(t);
  }, [city]);

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <section className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin py-space-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md bg-surface-container-lowest/80 backdrop-blur-md p-space-lg rounded-2xl shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-secondary font-semibold">Civic Baseline Telemetry</span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-xs text-label-xs text-on-surface-variant font-medium" id="live-clock">{clockTime}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{greeting}, {city?.name ?? 'Jaipur'}</h1>
            <div className="flex flex-wrap items-center gap-space-sm pt-0.5">
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface"><span className="material-symbols-outlined text-secondary text-[18px]">{wx?.current.is_day ? 'wb_sunny' : 'bedtime'}</span><span className="font-body-sm text-body-sm font-medium">{wx && wx.current.temp != null ? `${Math.round(wx.current.temp)}°C • ${wx.current.condition}` : 'Loading live weather…'}</span></div>
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface"><span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span><span className="font-body-sm text-body-sm font-medium" style={{ color: wx ? (AQI_SEVERITY_COLORS[wx.air_quality.severity] ?? undefined) : undefined }}>AQI {wx?.air_quality.us_aqi ?? '–'} • {wx?.air_quality.severity ?? 'Loading'}</span></div>
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface"><span className="material-symbols-outlined text-secondary text-[18px]">verified</span><span className="font-body-sm text-body-sm text-on-surface-variant">Grid: {grid ? `${grid.load_percent}% · ${grid.frequency_hz} Hz` : 'syncing…'}</span></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-xs bg-surface-container-low p-1.5 rounded-xl self-stretch lg:self-auto">
            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider px-space-sm font-semibold">Metropolis:</span>
            {cities.slice(0, 5).map((c) => (
              <button
                key={c.id}
                className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${c.name === city?.name ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'hover:bg-surface-container text-on-surface-variant'}`}
                onClick={() => setCity(c)}
                type="button"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Civic Insight: What's happening? */}
      <section className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin pb-space-sm">
        <WhatsHappeningCard />
      </section>

      <section className="w-full pb-space-md">
        <div className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs mb-space-md">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-secondary font-semibold">Spatial Urban Intelligence</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight mt-0.5">Terminal GIS — Vector Map Deck</h2>
          </div>
          <span className="font-label-xs text-label-xs text-on-surface-variant">Live congestion corridors • 181 dispatches • Metro & grid telemetry</span>
        </div>
        <div className="w-full px-gutter md:px-margin">
          <LiveTelemetryMap />
        </div>
      </section>

      <div className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          {/* Left - Pulse Radial */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm space-y-space-lg">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container shadow-[0_0_8px_rgba(0,150,105,0.6)]"></span><span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-on-surface-variant">Live Civic Score Calculator</span></div><span className="font-label-xs text-label-xs px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-medium">computed from live telemetry</span></div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-space-lg py-space-sm">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  <defs><linearGradient id="pulse-gradient" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stopColor="#40c2fd"></stop><stop offset="100%" stopColor="#009669"></stop></linearGradient></defs>
                  <circle cx="80" cy="80" fill="transparent" r="66" stroke="#eff4ff" strokeWidth="12"></circle>
                  <circle className="transition-all duration-1000 ease-out" cx="80" cy="80" fill="transparent" r="66" stroke="url(#pulse-gradient)" strokeDasharray="414.69" strokeDashoffset={414.69 - 414.69 * ((score?.composite ?? 0) / 100)} strokeLinecap="round" strokeWidth="12"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-metric-display font-semibold text-on-surface leading-none tracking-tight">{score?.composite ?? '–'}</span>
                  <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mt-1">{city?.name ?? 'City'} Score</span>
                </div>
              </div>
              <div className="flex flex-col text-center sm:text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 self-center sm:self-start px-2.5 py-1 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-label-md font-semibold"><span className="material-symbols-outlined text-[16px]">insights</span> {score?.grade ?? 'Computing…'}</div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-1">{score ? `${score.grade} Civic Health` : 'Analyzing city telemetry…'}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[220px]">
                  {score ? `Composite index ${(score.trend >= 0 ? '+' : '') + score.trend} vs yesterday — weighted across air, mobility, transit, civic response, and grid.` : 'Scoring air quality, road mobility, transit health, civic response and grid headroom.'}
                </p>
              </div>
            </div>
            <div className="space-y-space-sm bg-surface-container-low/70 p-space-md rounded-xl">
              {score
                ? Object.values(score.subscores).map((m) => (
                    <div key={m.label} className="space-y-1">
                      <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">{m.icon}</span> {m.label}</span>
                        <span className="font-medium text-on-surface">{m.score}/100 <span className="text-on-surface-variant text-label-xs font-normal">{m.detail}</span></span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden"><div className={`h-full rounded-full ${m.score >= 70 ? 'bg-on-tertiary-container' : m.score >= 45 ? 'bg-secondary' : 'bg-error'}`} style={{ width: `${m.score}%` }}></div></div>
                    </div>
                  ))
                : [1, 2, 3, 4, 5].map((i) => <div key={i} className="h-6 rounded-lg bg-surface-container animate-pulse"></div>)}
            </div>

            {/* Grid telemetry panel */}
            <div className="bg-surface-container-low/70 p-space-md rounded-xl flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">bolt</span> Grid Telemetry</span>
                <span className="font-label-xs text-label-xs text-on-surface-variant">{grid?.discom ?? '—'}</span>
              </div>
              {grid ? (
                <>
                  <div className="flex items-center justify-between font-body-sm text-body-sm">
                    <span className="text-on-surface font-medium">{grid.load_percent}% load <span className="text-on-surface-variant">({grid.demand_mw.toLocaleString()} MW / {grid.installed_mw.toLocaleString()} MW)</span></span>
                    <span className="text-on-surface-variant">{grid.frequency_hz} Hz <span className="text-on-tertiary-container font-medium">●</span></span>
                  </div>
                  <svg className="w-full h-14" preserveAspectRatio="none" viewBox="0 0 240 40">
                    {grid.load_curve.map((v, i) => (
                      <rect key={i} fill={i === new Date().getHours() % 24 ? '#00668a' : '#dce9ff'} height={(v / 100) * 36} width="6.5" x={i * 10} y={40 - (v / 100) * 36} rx="1"></rect>
                    ))}
                  </svg>
                  <div className="flex items-center gap-1.5 h-2.5 w-full rounded-full overflow-hidden">
                    {Object.entries(grid.mix).map(([k, v]) => (
                      <div key={k} title={k} style={{ width: `${v}%` }} className={{ solar: 'bg-amber-400', wind: 'bg-teal-400', hydro: 'bg-blue-500', thermal: 'bg-slate-400' }[k as 'solar'] ?? 'bg-slate-300'}></div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between font-label-xs text-label-xs text-on-surface-variant">
                    <span>Solar {grid.mix.solar}% · Wind {grid.mix.wind}% · Hydro {grid.mix.hydro}% · Thermal {grid.mix.thermal}%</span>
                    <span>Peak {String(grid.peak_hour).padStart(2, '0')}:00</span>
                  </div>
                </>
              ) : (
                <div className="h-24 rounded-lg bg-surface-container animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Right - Interactive Map */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm relative overflow-hidden min-h-[460px]">
            <div className="flex flex-wrap items-center justify-between gap-space-md z-10">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-1.5 rounded-full shadow-sm"><span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span><span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-on-surface">Viewing: Live Neighborhood Civic Scores</span></div>
            </div>
            <div className="z-0">
              <NeighborhoodMap cityName={city?.name ?? 'Jaipur'} />
            </div>
            <div className="mt-space-md z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-2.5 rounded-xl shadow-md flex items-center gap-space-md"><div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary"><span className="material-symbols-outlined text-[20px]">sensors</span></div><div><div className="flex items-center gap-1.5"><span className="font-body-sm text-body-sm font-semibold text-on-surface">{city?.name ?? 'City'} Microgrid #04</span><span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span></div><span className="font-label-xs text-label-xs text-on-surface-variant">Active • Lat 26.9124 N, Lon 75.7873 E</span></div></div>
              <div className="bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-2 rounded-xl shadow-sm flex items-center gap-space-md font-label-xs text-label-xs text-on-surface-variant"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"></span> Optimal</span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span> Nominal</span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Maintenance</span></div>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <section className="space-y-space-md pt-space-sm">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"><div><div className="flex items-center gap-space-xs"><span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-secondary">Public Bulletins</span><span className="text-outline-variant">•</span><span className="font-label-xs text-label-xs text-on-tertiary-container font-medium">{headlines.length} Active Real-Time Advisories</span></div><h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">Top Headlines</h2></div><a href="#" className="font-body-sm text-body-sm text-secondary hover:text-on-surface font-medium flex items-center gap-1 self-start sm:self-auto transition-colors">View all city dispatches<span className="material-symbols-outlined text-[16px]">arrow_forward</span></a></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {headlines.slice(0, 3).map((h, i) => {
              const mins = Math.max(0, Math.floor((Date.now() - new Date(h.time).getTime()) / 60000));
              const ago = mins < 1 ? 'now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
              const catBg = h.kind === 'report' ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant' : h.severity === 'CRITICAL' ? 'bg-error-container/40 text-error' : 'bg-surface-container text-secondary';
              return (
              <div key={i} className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between space-y-space-md hover:shadow-md transition-all group">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between"><span className={`px-2.5 py-0.5 rounded-full font-label-xs text-label-xs font-semibold uppercase tracking-wider ${catBg}`}>{h.category}</span><span className="font-label-xs text-label-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {ago}</span></div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-secondary transition-colors">{h.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{h.org}</p>
                </div>
                <div className="pt-space-sm flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl text-on-surface"><span className="font-label-xs text-label-xs text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">location_on</span> {h.kind === 'report' ? 'Resident filed' : 'Live stream'}</span><span className="font-label-xs text-label-xs text-secondary font-semibold">{h.status}</span></div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Action Ribbon */}
        <div className="bg-surface-container-low/80 p-space-md rounded-2xl flex flex-col md:flex-row items-center justify-between gap-space-md mt-space-lg">
          <div className="flex items-center gap-space-md"><div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-sm"><span className="material-symbols-outlined text-[22px]">contact_support</span></div><div><span className="font-headline-sm text-headline-sm text-on-surface font-medium">Resident Civic Telemetry Services</span><p className="font-body-sm text-body-sm text-on-surface-variant">Report public space anomalies, request sensor audits, or call emergency dispatch.</p></div></div>
          <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto justify-start lg:justify-end">
            <a href="tel:181" className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md shadow-sm font-semibold"><span className="material-symbols-outlined text-[16px] text-secondary">phone</span> Dial Jaipur 181</a>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md shadow-sm font-semibold" type="button"><span className="material-symbols-outlined text-[16px] text-on-tertiary-container">campaign</span> Submit Resident Feedback</button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-surface-tint transition-all font-label-md text-label-md shadow-sm font-semibold" type="button"><span className="material-symbols-outlined text-[16px]">emergency_share</span> Emergency Directory</button>
          </div>
        </div>
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
