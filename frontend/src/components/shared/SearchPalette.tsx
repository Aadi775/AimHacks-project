'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCity } from '@/context/CityContext';
import { geocodeCities } from '@/lib/cities';

interface PaletteItem {
  id: string;
  group: 'CITY' | 'PAGE' | 'TRANSIT';
  label: string;
  hint: string;
  icon: string;
  action: () => void;
}

const PAGE_ITEMS = [
  { path: '/', label: 'Home', hint: 'Civic dashboard', icon: 'home' },
  { path: '/overview', label: 'Overview & Pulse', hint: 'Terminal GIS map deck', icon: 'map' },
  { path: '/weather', label: 'Weather & Environment', hint: 'Live AQI + forecast', icon: 'thermostat' },
  { path: '/transit', label: 'Transit & Incidents', hint: 'Metro + bus network', icon: 'tram' },
  { path: '/complaints', label: '181 Complaints', hint: 'Nagar Nigam helpline', icon: 'campaign' },
  { path: '/insights', label: 'Causes & Correlation', hint: 'Cross-stream analysis', icon: 'insights' },
  { path: '/login', label: 'Resident Login', hint: 'Access portal', icon: 'person' },
];

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { cities, setCity, addCityToList, city: selectedCity } = useCity();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [geo, setGeo] = useState<{ name: string; admin1?: string; country_code?: string; latitude: number; longitude: number }[]>([]);

  const close = useCallback(() => {
    setQuery('');
    setActive(0);
    setGeo([]);
    onClose();
  }, [onClose]);

  // Debounced geocode for unknown cities
  useEffect(() => {
    if (query.trim().length < 3) {
      setGeo([]);
      return;
    }
    const known = cities.some((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
    if (known) return;
    const t = setTimeout(async () => {
      const results = await geocodeCities(query.trim());
      setGeo(results.filter((g) => g.country_code === 'IN').slice(0, 2));
    }, 350);
    return () => clearTimeout(t);
  }, [query, cities]);

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase();
    const list: PaletteItem[] = [];

    cities
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((c) =>
        list.push({
          id: `city-${c.id}`,
          group: 'CITY',
          label: c.name,
          hint: `${c.state} — switch telemetry${c.name === selectedCity?.name ? ' (active)' : ''}`,
          icon: 'location_city',
          action: () => {
            setCity(c);
            close();
          },
        })
      );

    PAGE_ITEMS.filter((p) => !q || p.label.toLowerCase().includes(q) || p.hint.toLowerCase().includes(q)).forEach((p) =>
      list.push({
        id: `page-${p.path}`,
        group: 'PAGE',
        label: p.label,
        hint: p.hint,
        icon: p.icon,
        action: () => {
          router.push(p.path);
          close();
        },
      })
    );

    geo.forEach((g, i) =>
      list.push({
        id: `geo-${i}`,
        group: 'CITY',
        label: `Add city: ${g.name}`,
        hint: `${g.admin1 ?? ''} — geocode + stream`,
        icon: 'add_location_alt',
        action: async () => {
          try {
            const r = await fetch('http://localhost:8001/api/cities', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: g.name, state: g.admin1 ?? '', lat: g.latitude, lng: g.longitude }),
            });
            const created = await r.json();
            addCityToList(created);
          } catch {
            /* ignore */
          }
          close();
        },
      })
    );

    return list.slice(0, 12);
  }, [query, cities, geo, selectedCity, setCity, addCityToList, router, close]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        items[active]?.action();
      } else if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items, active, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[12vh] px-4" style={{ background: '#00000099' }} onClick={close}>
      <div
        className="w-full max-w-xl bg-surface-container-lowest border border-surface-container rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-2 px-4 h-12 border-b border-surface-container">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant select-none">search</span>
          <input
            autoFocus
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search cities, pages, or add any city…"
            type="text"
            value={query}
          />
          <kbd className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {items.length === 0 && (
            <div className="px-4 py-6 text-center font-body-sm text-body-sm text-on-surface-variant">
              No matches — try a city name (e.g. “Kota”, “Jodhpur”) or a page.
            </div>
          )}
          {items.map((item, i) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === active ? 'bg-surface-container-low' : 'hover:bg-surface-container-low/60'
              }`}
              onClick={item.action}
              onMouseEnter={() => setActive(i)}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">{item.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-body-md text-body-md text-on-surface truncate">{item.label}</span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant truncate">{item.hint}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-label-xs text-label-xs text-on-surface-variant shrink-0">
                {item.group}
              </span>
            </button>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-surface-container bg-surface-container-low/50">
          <span className="font-label-xs text-label-xs text-on-surface-variant flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </span>
          <span className="font-label-xs text-label-xs text-secondary">CivicPulse Command Palette</span>
        </div>
      </div>
    </div>
  );
}
