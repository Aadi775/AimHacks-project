'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';
import { API_BASE } from '@/lib/cities';

interface DispatchCard {
  key: string;
  category: string;
  catColor: string;
  time: string;
  title: string;
  desc: string;
  action: string;
  href: string;
}

export default function CommunityDispatches() {
  const { city } = useCity();
  const [dispatches, setDispatches] = useState<DispatchCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const cname = encodeURIComponent(city.name.toLowerCase());
    const load = () => Promise.all([
      fetch(`${API_BASE}/api/reports?city=${cname}&limit=6`).then((r) => r.json()).catch(() => []),
      fetch(`${API_BASE}/api/events?city=${cname}&limit=100`).then((r) => r.json()).catch(() => []),
    ])
      .then(
        ([
          reports,
          events,
        ]: [
          { ticket: string; category: string; description: string; location: string; username: string; severity: string; created_at: string }[],
          { id: string; category: string; description: string; severity: string; timestamp: string }[]
        ]) => {
          const cards: DispatchCard[] = [];

          reports.slice(0, 3).forEach((r) => {
            cards.push({
              key: `rep-${r.ticket}`,
              category: r.category,
              catColor: 'bg-surface-container-low text-on-tertiary-container',
              time: new Date(r.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
              title: r.description,
              desc: `${r.location} — filed by @${r.username} • ${r.severity} priority`,
              action: 'Track Ticket →',
              href: '/complaints',
            });
          });

          events
            .filter((e) => e.severity !== 'INFO' && e.category !== 'report')
            .slice(-6)
            .reverse()
            .slice(0, Math.max(0, 3 - cards.length))
            .forEach((e) => {
              cards.push({
                key: `ev-${e.id}`,
                category: e.category ? e.category.replace('_', ' ').toUpperCase() : 'TELEMETRY',
                catColor: 'bg-surface-container-low text-secondary',
                time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                title: e.description,
                desc: `${city.name} ${e.category} cell — live stream`,
                action: 'Open Map →',
                href: '/overview',
              });
            });

          setDispatches(cards.slice(0, 3));
          setLoading(false);
        }
      )
      .catch(() => setLoading(false));
    load(); // initial fetch — never leave the user stuck on "Syncing city feed…"
    const t = setInterval(() => { load().then(() => {}).catch(() => {}); }, 45000);
    return () => clearInterval(t);
  }, [city]);

  return (
    <section className="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
        <div>
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-secondary font-semibold">City Dispatches & Action</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">Resident Pulse Bulletin</h2>
        </div>
        <span className="font-label-xs text-label-xs text-on-surface-variant">
          {loading ? 'Syncing city feed…' : `Live 181 reports + ${city?.name ?? 'city'} telemetry`}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dispatches.map((d) => (
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col justify-between" key={d.key}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full font-label-xs text-label-xs font-semibold ${d.catColor}`}>{d.category}</span>
                <span className="font-label-xs text-label-xs text-on-surface-variant">{d.time}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{d.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">{d.desc}</p>
            </div>
            <div className="pt-6 mt-4 flex items-center justify-between">
              <span className="font-label-xs text-label-xs text-on-tertiary-container">Verified live entry</span>
              <Link className="font-label-md text-label-md text-secondary font-medium hover:underline" href={d.href}>
                {d.action}
              </Link>
            </div>
          </div>
        ))}
        {dispatches.length === 0 && !loading && (
          <div className="md:col-span-3 bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              No live dispatches in the current window for {city?.name ?? 'this city'} — file the first 181 report.
            </span>
          </div>
        )}
      </div>
      {/* Quick Action Bar */}
      <div className="mt-8 bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left w-full lg:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">flash_on</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-medium">Direct Civic Actions</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Quick pathways to report, monitor, or consume open city streams</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          <Link className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm" href="/complaints">
            <span className="material-symbols-outlined text-[18px] text-error">campaign</span>
            <span>Report Issue via 181</span>
          </Link>
          <Link className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm" href="/weather">
            <span className="material-symbols-outlined text-[18px] text-secondary">sms</span>
            <span>View AQI Alerts</span>
          </Link>
          <Link className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary hover:bg-surface-container-highest hover:text-on-surface font-label-md text-label-md transition-all shadow-sm" href="/insights">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span>Open Data Insights</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
