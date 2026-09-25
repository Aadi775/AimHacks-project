'use client';

import { useEffect, useState } from 'react';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import WhatsHappeningCard from '@/components/shared/WhatsHappeningCard';
import CitySwitcher from '@/components/shared/CitySwitcher';
import { useCity } from '@/context/CityContext';
import { API_BASE } from '@/lib/cities';

interface Correlation {
  pair: string;
  r: number;
  n: number;
  x: string;
  y: string;
  points: [number, number][];
  strength: string;
  note: string;
}

interface Insights {
  city: string;
  event_count: number;
  correlations: Correlation[];
  hourly: { hours: number[]; events: number[]; traffic_weight: number[]; aqi: (number | null)[] };
  categories: { category: string; INFO: number; WARNING: number; CRITICAL: number }[];
  peaks: { worst_traffic_hour: number | null; peak_aqi_hour: number | null; busiest_corridor: string | null };
  findings: string[];
  predictions: {
    aqi: { history: { hour: number; value: number }[]; forecast: { hour: number; value: number }[]; slope: number; confidence: number } | null;
    traffic: { history: { hour: number; value: number }[]; forecast: { hour: number; value: number }[]; slope: number; confidence: number } | null;
  };
}

function rColor(r: number) {
  const a = Math.abs(r);
  if (r > 0 && a >= 0.4) return '#10B981';
  if (r < 0 && a >= 0.4) return '#EF4444';
  if (a >= 0.2) return '#F59E0B';
  return '#94A3B8';
}

function ScatterPlot({ corr }: { corr: Correlation }) {
  const pts = corr.points;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const W = 320;
  const H = 180;
  const px = (x: number) => 34 + ((x - minX) / (maxX - minX || 1)) * (W - 48);
  const py = (y: number) => H - 30 - ((y - minY) / (maxY - minY || 1)) * (H - 52);

  return (
    <svg className="w-full h-auto" viewBox={`0 0 ${W} ${H}`} role="img">
      <rect fill="none" height={H - 42} stroke="#1E293B" width={W - 48} x={34} y={12} />
      {pts.map((p, i) => (
        <circle cx={px(p[0])} cy={py(p[1])} fill={rColor(corr.r)} fillOpacity="0.75" key={i} r="3.5" stroke="#020617" strokeWidth="1" />
      ))}
      <text fill="#64748B" fontSize="9" textAnchor="middle" x={W / 2} y={H - 4}>
        {corr.x}
      </text>
      <text fill="#64748B" fontSize="9" transform="rotate(-90)" textAnchor="middle" x={-(H / 2)} y={8}>
        {corr.y}
      </text>
    </svg>
  );
}

export default function InsightsPage() {
  const { city } = useCity();
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    fetch(`${API_BASE}/api/insights?city=${encodeURIComponent(city.name)}&hours=12`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  const maxEvents = data ? Math.max(1, ...data.hourly.events) : 1;

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <div className="w-full px-gutter md:px-margin max-w-[1360px] mx-auto py-space-lg flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Causal Analysis Engine
            </span>
            <span className="font-label-xs text-label-xs text-on-surface-variant">
              Pearson correlation over rolling {data ? `${data.event_count}` : '—'} events
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {city ? `${city.name} Causes` : 'Causes'} & Correlations
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Cross-stream analysis of traffic congestion, air quality, grid load, transit delays, and resident
            complaints — revealing what drives what across your city&apos;s telemetry.
          </p>
          <CitySwitcher />
        </div>

        {/* AI Civic Insight: What's happening? */}
        <WhatsHappeningCard />

        {loading && !data && (
          <div className="rounded-2xl bg-surface-container-lowest shadow-md p-space-xl flex items-center justify-center">
            <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Running correlation analysis…
            </span>
          </div>
        )}

        {data && (
          <>
            {/* Findings */}
            <section className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-md">Key Findings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {data.findings.map((f, i) => (
                  <div className="flex items-start gap-space-sm bg-surface-container-low rounded-xl p-space-sm" key={i}>
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">lightbulb</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Predictions */}
            {data.predictions.aqi && (
              <section className="flex flex-col gap-space-md">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
                  <div>
                    <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">Forecast Engine</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Predictions</h2>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Linear trend extrapolation • next 4 hours</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
                  {(['aqi', 'traffic'] as const).map((kind) => {
                    const pred = data.predictions[kind];
                    if (!pred) return null;
                    const isAqi = kind === 'aqi';
                    const all = [...pred.history, ...pred.forecast];
                    const vals = all.map((p) => p.value);
                    const minV = Math.min(...vals);
                    const maxV = Math.max(...vals);
                    const W = 460;
                    const H = 160;
                    const px = (i: number) => 34 + (i / (all.length - 1 || 1)) * (W - 48);
                    const py = (v: number) => H - 26 - ((v - minV) / (maxV - minV || 1)) * (H - 48);
                    const histPath = pred.history.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(p.value)}`).join(' ');
                    const fcStart = pred.history.length - 1;
                    const fcPath = [pred.history[pred.history.length - 1], ...pred.forecast]
                      .map((p, i) => `${i === 0 ? 'M' : 'L'}${px(fcStart + i)},${py(p.value)}`)
                      .join(' ');
                    const next = pred.forecast[pred.forecast.length - 1];
                    return (
                      <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-sm" key={kind}>
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{isAqi ? 'AQI Forecast' : 'Congestion Forecast'}</span>
                          <span className="font-label-xs text-label-xs px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-medium">
                            {pred.confidence * 100 > 0 ? Math.round(pred.confidence * 100) : 0}% confidence
                          </span>
                        </div>
                        <svg className="w-full h-auto" viewBox={`0 0 ${W} ${H}`} role="img">
                          <rect fill="none" height={H - 40} stroke="#e5eeff" width={W - 48} x={34} y={12} />
                          <path d={histPath} fill="none" stroke={isAqi ? '#00668a' : '#F59E0B'} strokeWidth="2" />
                          <path d={fcPath} fill="none" stroke={isAqi ? '#40c2fd' : '#fbbf24'} strokeWidth="2" strokeDasharray="5 4" />
                          {pred.history.map((p, i) => (
                            <circle cx={px(i)} cy={py(p.value)} fill={isAqi ? '#00668a' : '#F59E0B'} key={i} r="2.5" />
                          ))}
                          {pred.forecast.map((p, i) => (
                            <circle cx={px(fcStart + 1 + i)} cy={py(p.value)} fill="#fff" stroke={isAqi ? '#40c2fd' : '#fbbf24'} key={`f${i}`} r="3" strokeWidth="2" />
                          ))}
                          <text fill="#76777d" fontSize="10" textAnchor="middle" x={W / 2} y={H - 6}>
                            hourly buckets → dashed = next 4h
                          </text>
                        </svg>
                        <div className="flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-on-surface-variant">
                            {isAqi ? 'Air Quality Index' : 'Traffic weight (corridor congestion)'}
                          </span>
                          <span className={`font-medium ${pred.slope > 0 ? 'text-error' : 'text-on-tertiary-container'}`}>
                            {pred.slope > 0 ? '▲' : '▼'} {next ? `→ ~${Math.round(next.value)} @ ${String(next.hour).padStart(2, '0')}:00` : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Correlations */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
                <div>
                  <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">Statistical Layer</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Stream Correlations</h2>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Hourly-bucketed Pearson r • last 12h</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {data.correlations.length === 0 && (
                  <div className="md:col-span-3 rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm text-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Not enough overlapping data buckets yet — correlations unlock once more telemetry accumulates (~1h).
                    </span>
                  </div>
                )}
                {data.correlations.map((c) => (
                  <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-sm" key={c.pair}>
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{c.pair}</span>
                      <span
                        className="font-mono font-headline-sm text-headline-sm font-bold px-2 py-0.5 rounded-lg"
                        style={{ color: rColor(c.r), background: `${rColor(c.r)}1A` }}
                      >
                        {c.r > 0 ? '+' : ''}
                        {c.r.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-[#020617] rounded-xl p-1">
                      <ScatterPlot corr={c} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider font-semibold">{c.strength}</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant">n={c.n} buckets</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{c.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              {/* Hourly stream histogram */}
              <section className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-md">Hourly Telemetry Volume</h2>
                <div className="flex items-end gap-1.5 h-40">
                  {data.hourly.hours.map((h, i) => (
                    <div className="flex-1 flex flex-col items-center gap-1 group" key={h}>
                      <span className="font-label-xs text-label-xs text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">{data.hourly.events[i]}</span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-secondary to-secondary-container transition-all group-hover:from-primary"
                        style={{ height: `${(data.hourly.events[i] / maxEvents) * 100}%`, minHeight: '4px' }}
                      ></div>
                      <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{String(h).padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">
                  Traffic weight (amber) peaks around {data.peaks.worst_traffic_hour !== null ? `${String(data.peaks.worst_traffic_hour).padStart(2, '0')}:00` : '—'} 
                  {data.peaks.peak_aqi_hour !== null ? ` while AQI tops at ${String(data.peaks.peak_aqi_hour).padStart(2, '0')}:00` : ''}.
                  {data.peaks.busiest_corridor ? ` Busiest corridor: ${data.peaks.busiest_corridor}.` : ''}
                </p>
              </section>

              {/* Category severity mix */}
              <section className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-md">Severity Mix by Stream</h2>
                <div className="flex flex-col gap-space-sm">
                  {data.categories.map((c) => {
                    const total = c.INFO + c.WARNING + c.CRITICAL;
                    return (
                      <div className="flex flex-col gap-1" key={c.category}>
                        <div className="flex items-center justify-between">
                          <span className="font-body-sm text-body-sm text-on-surface capitalize">{c.category}</span>
                          <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{total} events</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex">
                          {c.INFO > 0 && <div className="h-full" style={{ width: `${(c.INFO / total) * 100}%`, background: '#10B981' }}></div>}
                          {c.WARNING > 0 && <div className="h-full" style={{ width: `${(c.WARNING / total) * 100}%`, background: '#F59E0B' }}></div>}
                          {c.CRITICAL > 0 && <div className="h-full" style={{ width: `${(c.CRITICAL / total) * 100}%`, background: '#EF4444' }}></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">
                  Green = INFO, amber = WARNING, red = CRITICAL. Streams dominated by warnings signal systemic stress.
                </p>
              </section>
            </div>
          </>
        )}
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
