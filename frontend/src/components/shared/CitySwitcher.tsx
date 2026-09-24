'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCity } from '@/context/CityContext';
import { geocodeCities, addCity, GeoResult } from '@/lib/cities';

export default function CitySwitcher() {
  const { city: selected, cities, setCity, addCityToList } = useCity();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [geo, setGeo] = useState<GeoResult[]>([]);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortedCities = useMemo(() => {
    const list = [...cities];
    list.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
    return list;
  }, [cities]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5);
  }, [cities, query]);

  // Debounced geocoding for cities not yet in the DB
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.trim().length < 3) {
      setGeo([]);
      return;
    }
    timer.current = setTimeout(async () => {
      const already = new Set(cities.map((c) => c.name.toLowerCase()));
      const results = await geocodeCities(query.trim());
      setGeo(results.filter((g) => !already.has(g.name.toLowerCase())).slice(0, 4));
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, cities]);

  const pick = useCallback(
    (c: { id: number; name: string; state: string; lat: number; lng: number; is_default: boolean }) => {
      setCity(c);
      setQuery('');
      setOpen(false);
    },
    [setCity]
  );

  const pickGeo = useCallback(
    async (g: GeoResult) => {
      setBusy(true);
      try {
        const created = await addCity({ name: g.name, state: g.admin1 ?? '', lat: g.latitude, lng: g.longitude });
        addCityToList(created);
      } catch {
        // Offline fallback: still allow selecting with geocoded coords
        addCityToList({ id: -1, name: g.name, state: g.admin1 ?? '', lat: g.latitude, lng: g.longitude, is_default: false });
      }
      setBusy(false);
      setQuery('');
      setOpen(false);
    },
    [addCityToList]
  );

  return (
    <div className="w-full flex flex-col items-center gap-space-sm">
      {/* City pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider font-semibold mr-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-secondary">location_city</span>
          City:
        </span>
        {sortedCities.map((c) => {
          const active = selected?.name === c.name;
          return (
            <button
              key={c.id}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all shadow-sm flex items-center gap-1.5 ${
                active
                  ? 'bg-surface-container-lowest text-on-surface font-semibold ring-1 ring-secondary/40'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              onClick={() => pick(c)}
              type="button"
            >
              {c.is_default && <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>}
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Search any city */}
      <div className="relative w-full max-w-md">
        <div className="flex items-center bg-surface-container-lowest rounded-full p-1.5 shadow-sm border border-surface-container">
          <span className="material-symbols-outlined text-[17px] text-on-surface-variant ml-3 mr-1 select-none">search</span>
          <input
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none pr-3"
            placeholder="Search any city — India or worldwide…"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches.length > 0) pick(matches[0]);
              if (e.key === 'Escape') setOpen(false);
            }}
          />
        </div>

        {open && (matches.length > 0 || geo.length > 0 || busy) && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-surface-container-lowest rounded-xl shadow-2xl border border-surface-container overflow-hidden z-50">
            {matches.map((c) => (
              <button
                key={`m-${c.id}`}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container-low transition-colors flex items-center justify-between"
                onClick={() => pick(c)}
                type="button"
              >
                <span className="font-body-sm text-body-sm text-on-surface">{c.name}</span>
                <span className="font-label-xs text-label-xs text-on-surface-variant">
                  {c.state}
                  {c.is_default ? ' • Home' : ''}
                </span>
              </button>
            ))}
            {geo.map((g, i) => (
              <button
                key={`g-${i}`}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container-low transition-colors flex items-center justify-between border-t border-surface-container/60"
                onClick={() => pickGeo(g)}
                type="button"
                disabled={busy}
              >
                <span className="font-body-sm text-body-sm text-on-surface">
                  {g.name}
                  {g.country_code === 'IN' && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-label-xs text-label-xs">IN</span>
                  )}
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant">
                  {g.admin1 ?? ''} {g.country ?? ''}
                </span>
              </button>
            ))}
            {busy && (
              <div className="px-4 py-2 font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Adding city…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
