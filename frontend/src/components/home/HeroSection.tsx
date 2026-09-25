'use client';

import { useEffect, useState } from 'react';
import CitySwitcher from '@/components/shared/CitySwitcher';
import { useCity } from '@/context/CityContext';
import { fetchWeather, WeatherData } from '@/lib/cities';

interface ScoreData {
  composite: number;
  grade: string;
  subscores: { transit: { score: number; detail: string } };
}
interface GridData {
  load_percent: number;
  frequency_hz: number;
  mix: { solar: number; wind: number; hydro: number; thermal: number };
}

export default function HeroSection() {
  const { city } = useCity();
  const [wx, setWx] = useState<WeatherData | null>(null);
  const [score, setScore] = useState<ScoreData | null>(null);
  const [grid, setGrid] = useState<GridData | null>(null);

  useEffect(() => {
    if (!city) return;
    fetchWeather(city.name)
      .then(setWx)
      .catch(() => setWx(null));
    const load = () => {
      fetch(`http://localhost:8001/api/score?city=${encodeURIComponent(city.name)}`)
        .then((r) => r.json()).then(setScore).catch(() => {});
      fetch(`http://localhost:8001/api/grid?city=${encodeURIComponent(city.name)}`)
        .then((r) => r.json()).then(setGrid).catch(() => {});
    };
    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, [city]);

  return (
    <section className="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin pt-8 md:pt-14 pb-12 flex flex-col items-center text-center">
      {/* Live Micro Ticker Pill */}
      <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm mb-6">
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-70"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-on-tertiary-container"></span>
        </span>
        <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">{city ? `${city.name} Telemetry Pulse` : 'CivicPulse Telemetry'}</span>
        <span className="text-outline-variant font-label-xs text-label-xs">/</span>
        <span className="font-label-xs text-label-xs text-on-tertiary-container font-medium">
            {wx && wx.current.temp != null ? `${Math.round(wx.current.temp)}°C • ${wx.current.condition}` : 'Optimal Conditions'}
          </span>
      </div>
      {/* Hero Heading */}
      <h1 className="font-display text-display-mobile md:text-display text-on-surface tracking-tight max-w-4xl font-semibold">
        Your city, in real time.
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed font-normal">
        Hyperlocal environmental vitals, seamless transit telemetry, and verified neighborhood dispatches across {city?.name ?? 'Jaipur'}.
      </p>
      {/* City Switcher */}
      <div className="w-full mt-6">
        <CitySwitcher />
      </div>
      {/* Search Bar */}
      <div className="w-full max-w-2xl mt-8">
        <div className="relative flex items-center bg-surface-container-lowest/95 backdrop-blur-xl rounded-full p-2 shadow-md">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant ml-3 mr-2 select-none">search</span>
          <input
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none pr-3"
            id="civicSearch"
            placeholder="Search neighborhood, air quality sensor, or transit line..."
            type="text"
          />
          <div className="hidden sm:flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant font-label-xs text-label-xs">
            <span>Filter</span>
            <span className="material-symbols-outlined text-[14px]">tune</span>
          </div>
        </div>
        {/* Quick Jump Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wide mr-1">Quick jumps:</span>
          {['Malviya Nagar', 'C-Scheme Solar', 'Jaipur Metro Pink Line', 'Jal Mahal Humidity'].map((q) => (
            <button
              key={q}
              className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm"
              onClick={() => {
                const input = document.getElementById('civicSearch') as HTMLInputElement;
                if (input) { input.value = q; input.focus(); }
              }}
              type="button"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      {/* Ambient Live City Status Banner */}
      <div className="w-full max-w-4xl mt-10 bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {[
            {
              icon: 'verified',
              label: 'Civic Index',
              value: score ? String(score.composite) : '–',
              sub: score ? score.grade : 'Computing',
              color: score ? (score.composite >= 70 ? 'on-tertiary-container' : score.composite >= 50 ? 'secondary' : 'error') : 'on-surface-variant',
            },
            {
              icon: 'air',
              label: 'Air Quality',
              value: wx?.air_quality.us_aqi != null ? String(wx.air_quality.us_aqi) : '–',
              sub: wx ? wx.air_quality.severity : 'Loading',
              color: 'secondary',
            },
            {
              icon: 'tram',
              label: 'Transit Cadence',
              value: score ? `${score.subscores?.transit?.score ?? '–'}%` : '–',
              sub: score ? score.subscores?.transit?.detail ?? 'On-Time' : 'Syncing',
              color: 'on-surface-variant',
            },
            {
              icon: 'bolt',
              label: 'Clean Grid',
              value: grid ? `${grid.mix.solar + grid.mix.wind + grid.mix.hydro}%` : '–',
              sub: grid ? `${grid.frequency_hz} Hz • ${grid.load_percent}% load` : 'Syncing',
              color: 'on-tertiary-container',
            },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low/50">
              <div className={`w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center ${m.color === 'error' ? 'text-error' : m.color === 'secondary' ? 'text-secondary' : m.color === 'on-surface-variant' ? 'text-on-surface-variant' : 'text-on-tertiary-container'}`}>
                <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
              </div>
              <div className="min-w-0">
                <span className="block font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider truncate">{m.label}</span>
                <span className="block font-headline-sm text-headline-sm text-on-surface font-semibold">{m.value} <span className={`font-label-xs text-label-xs font-medium ${m.color === 'error' ? 'text-error' : m.color === 'secondary' ? 'text-secondary' : m.color === 'on-surface-variant' ? 'text-on-surface-variant' : 'text-on-tertiary-container'}`}>{m.sub}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
