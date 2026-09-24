'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import CitySwitcher from '@/components/shared/CitySwitcher';
import { useCity } from '@/context/CityContext';

interface TransitLine {
  name: string;
  mode: string;
  operator: string;
  route: string;
  stations: number;
  first: string;
  last: string;
  headway: number;
  status: string;
  arrivals: { destination: string; eta_min: number; platform: number }[];
}

const MODE_ICONS: Record<string, string> = {
  metro: 'tram',
  bus: 'directions_bus',
  rail: 'directions_railway',
};

const STATUS_COLORS: Record<string, string> = {
  'ON TIME': 'text-on-tertiary-container',
  'MINOR DELAY': 'text-amber-500',
};

export default function TransitPage() {
  const { city } = useCity();
  const [lines, setLines] = useState<TransitLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [dispatches, setDispatches] = useState<{ id: string; title: string; time: string; severity: string; org: string }[]>([]);
  const [feedOffline, setFeedOffline] = useState(false);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const load = () =>
      fetch(`http://localhost:8001/api/transit?city=${encodeURIComponent(city.name)}`)
        .then((r) => r.json())
        .then((d) => {
          setLines(d.lines ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    load();
    const t = setInterval(load, 60000); // live refresh every minute
    return () => clearInterval(t);
  }, [city]);

  // Live 181 dispatch feed: RESIDENT REPORTS FIRST, then traffic/incidents — polls every 30s
  useEffect(() => {
    if (!city) return;
    const load = () => {
      fetch(`http://localhost:8001/api/events?city=${encodeURIComponent(city.name.toLowerCase())}&limit=200`)
        .then((r) => r.json())
        .then((events: { id: string; description: string; timestamp: string; severity: string; category: string }[]) => {
          const reports = events.filter((e) => e.category === 'report').slice(0, 3);
          const others = events
            .filter((e) => e.category === 'emergency' || e.category === 'traffic')
            .slice(-6)
            .reverse();
          setFeedOffline(false);
          const feed = [...reports, ...others.slice(0, Math.max(0, 6 - reports.length))].slice(0, 6);
          setDispatches(
            feed.map((e) => ({
              id: e.id,
              title: e.description,
              time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              severity: e.severity,
              org: e.category === 'report' ? 'Resident Report' : e.category === 'emergency' ? '181 Control Room' : 'Traffic Cell',
            }))
          );
        })
        .catch(() => setFeedOffline(true));
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [city]);

  // INSTANT updates: listen to the live WebSocket — new reports/traffic appear immediately
  useEffect(() => {
    let ws: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout>;
    let disposed = false;
    const connect = () => {
      if (disposed) return;
      try {
        ws = new WebSocket('ws://localhost:8001/ws/pulse');
        ws.onopen = () => setFeedOffline(false);
        ws.onclose = () => {
          retry = setTimeout(connect, 5000);
        };
        ws.onerror = () => ws?.close();
        ws.onmessage = (msg) => {
          try {
            const ev = JSON.parse(msg.data);
            const cname = city?.name.toLowerCase();
            if (!cname || ev.city !== cname) return;
            if (ev.category !== 'report' && ev.category !== 'emergency') return;
            setDispatches((prev) => {
              if (prev.some((d) => d.id === ev.id)) return prev;
              const next = [
                {
                  id: ev.id,
                  title: ev.description,
                  time: new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  severity: ev.severity,
                  org: ev.category === 'report' ? 'Resident Report' : '181 Control Room',
                },
                ...prev,
              ];
              return next.slice(0, 6);
            });
          } catch {
            /* ignore */
          }
        };
      } catch {
        retry = setTimeout(connect, 5000);
      }
    };
    connect();
    return () => {
      disposed = true;
      clearTimeout(retry);
      ws?.close();
    };
  }, [city]);

  const filteredLines = useMemo(
    () => (activeTab === 'all' ? lines : lines.filter((l) => l.mode === activeTab)),
    [lines, activeTab]
  );

  const onTimeCount = useMemo(() => lines.filter((l) => l.status === 'ON TIME').length, [lines]);
  const modes = useMemo(() => Array.from(new Set(lines.map((l) => l.mode))), [lines]);

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <div className="w-full px-gutter md:px-margin max-w-[1360px] mx-auto py-space-lg">
        {/* Top context + live summary */}
        <section className="flex flex-col gap-space-sm mb-space-lg">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Active {city?.name ?? 'City'} Telemetry
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {city ? `${city.name} Transit` : 'Transit'} & Community Activity
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Live metro, bus, and suburban rail network health with real-time arrivals and citizen-reported 181 civic events.
          </p>
          <CitySwitcher />
        </section>

        {/* Quick status pills bento strip */}
        <section className="mb-space-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
            {[
              { icon: 'check_circle', text: `${lines.length ? Math.round((onTimeCount / lines.length) * 100) : 0}% Lines On Schedule`, color: 'text-on-tertiary-container' },
              { icon: 'tram', text: `${lines.filter((l) => l.mode === 'metro' || l.mode === 'rail').length} Rail / Metro Lines`, color: 'text-secondary' },
              { icon: 'directions_bus', text: `${lines.filter((l) => l.mode === 'bus').length} Bus Routes`, color: 'text-on-surface-variant' },
              { icon: 'assignment', text: `${dispatches.length} Active 181 Reports`, color: 'text-error' },
            ].map((s) => (
              <div key={s.text} className="flex items-center gap-space-xs px-space-md py-3 rounded-2xl bg-surface-container-low shadow-sm">
                <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
                <span className="font-label-md text-label-md text-on-surface font-medium">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        {loading && !lines.length ? (
          <div className="w-full rounded-2xl bg-surface-container-lowest shadow-md p-space-xl flex items-center justify-center mb-space-lg">
            <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              Fetching {city?.name} network data…
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left column: line health */}
            <section className="lg:col-span-7 flex flex-col gap-space-md min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">Network Line Health</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Live arrivals refresh every 60s • {modes.map((m) => m.toUpperCase()).join(' + ')} operators
                  </p>
                </div>
                <div className="flex items-center p-1 bg-surface-container-low rounded-full self-start">
                  {[
                    { id: 'all', label: 'All Lines' },
                    ...modes.map((m) => ({ id: m, label: m === 'metro' ? 'Metro' : m === 'bus' ? 'Bus' : 'Rail' })),
                  ].map((tab) => (
                    <button
                      className={`tab-btn px-space-sm py-1 rounded-full font-label-md text-label-md transition-all ${
                        activeTab === tab.id ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-space-sm" id="lines-container">
                {filteredLines.map((line) => (
                  <article className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-sm" key={line.name}>
                    <div className="flex items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface shrink-0">
                          <span className="material-symbols-outlined text-[20px]">{MODE_ICONS[line.mode] ?? 'directions_bus'}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">{line.name}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-xs text-label-xs font-semibold shrink-0">
                              {line.operator}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{line.route}</span>
                        </div>
                      </div>
                      <span className={`px-space-sm py-1 rounded-full bg-surface-container-low font-label-md text-label-md shrink-0 flex items-center gap-1.5 font-medium ${STATUS_COLORS[line.status] ?? 'text-on-surface'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {line.status}
                      </span>
                    </div>

                    {/* Live arrivals strip */}
                    <div className="flex flex-wrap gap-2 pt-space-xs">
                      {line.arrivals.map((a, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low/70">
                          <span className="material-symbols-outlined text-[13px] text-secondary">schedule</span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            <strong className="font-semibold">{a.eta_min < 1 ? 'Arriving' : `${a.eta_min}m`}</strong>
                            <span className="text-on-surface-variant"> → {a.destination}</span>
                          </span>
                          <span className="font-label-xs text-label-xs text-on-surface-variant border-l border-outline-variant pl-1.5">P{a.platform}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-y-2 bg-surface-container-low/50 px-space-sm py-2 rounded-xl">
                      <span className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[15px] text-on-surface">timelapse</span>
                        Headway: <strong className="text-on-surface font-medium">{line.headway} min</strong>
                      </span>
                      <span className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[15px] text-on-surface">toll</span>
                        {line.stations} stations
                      </span>
                      <span className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[15px] text-on-surface">schedule</span>
                        {line.first} – {line.last}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Right column: live 181 community feed */}
            <section className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center justify-between gap-space-xs">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">Community 181 Feed</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Live civic response dispatch</p>
                </div>
                <Link className="flex items-center gap-space-xs px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm" href="/complaints" id="open-report-btn">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span className="hidden sm:inline">Report Issue</span>
                </Link>
              </div>
              <div className="flex flex-col gap-space-sm">
                {dispatches.map((d) => (
                  <article className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-space-sm" key={d.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                          <span className="material-symbols-outlined text-[18px]">{d.org === 'Traffic Cell' ? 'traffic' : 'emergency'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold text-sm">{d.org}</span>
                          <span className="font-label-xs text-label-xs text-on-surface-variant">{d.time}</span>
                        </div>
                      </div>
                      <span className={`font-label-xs text-label-xs font-medium ${d.severity === 'CRITICAL' ? 'text-error' : d.severity === 'WARNING' ? 'text-amber-500' : 'text-on-tertiary-container'}`}>
                        {d.severity}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">{d.title}</p>
                  </article>
                ))}
                {feedOffline && (
                  <div className="bg-error-container/30 border border-error/30 p-space-md rounded-2xl text-center">
                    <span className="font-body-sm text-body-sm text-on-error-container">181 feed offline — backend not reachable on port 8001. Retrying…</span>
                  </div>
                )}
                {dispatches.length === 0 && !feedOffline && (
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm text-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">No active 181 reports in the current window — streets are calm.</span>
                  </div>
                )}
              </div>

              {/* SMS alert shelf */}
              <div className="w-full bg-surface-container-low p-space-md rounded-2xl shadow-sm flex flex-col gap-space-sm mt-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-secondary">cell_tower</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Civic SMS Push Alerts</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Subscribe to instant SMS alerts for localized {city?.name ?? 'city'} Metro delays, power cuts, and road closures.
                </p>
                <form className="flex flex-col sm:flex-row items-center gap-space-xs mt-space-xs w-full" onSubmit={(e) => e.preventDefault()}>
                  <input className="w-full sm:flex-1 h-11 px-space-md rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none shadow-sm" placeholder="Ward number or locality…" type="text" />
                  <button className="w-full sm:w-auto h-11 px-space-md rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm shrink-0" type="submit">
                    Subscribe
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
