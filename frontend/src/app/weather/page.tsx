'use client';

import { useEffect, useState } from 'react';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import CitySwitcher from '@/components/shared/CitySwitcher';
import { useCity } from '@/context/CityContext';
import { fetchWeather, AQI_SEVERITY_COLORS, WeatherData } from '@/lib/cities';
import { NEIGHBORHOOD_METRICS } from '@/lib/constants';

export default function WeatherPage() {
  const { city, setCity } = useCity();
  const [wx, setWx] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    setFeedError(false);
    fetchWeather(city.name)
      .then((d) => {
        setWx(d);
        setLoading(false);
      })
      .catch(() => {
        setFeedError(true);
        setLoading(false);
      });
    const retry = setTimeout(() => {
      fetchWeather(city.name).then(setWx).catch(() => {});
    }, 60000);
    return () => clearTimeout(retry);
  }, [city]);

  const aqiColor = wx ? AQI_SEVERITY_COLORS[wx.air_quality.severity] ?? '#eab308' : '#eab308';
  const isJaipur = (city?.name ?? '').toLowerCase() === 'jaipur';
  const aqiPct = wx?.air_quality.us_aqi ? Math.min(wx.air_quality.us_aqi, 200) / 200 : 0.5;

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <section className="w-full px-gutter md:px-margin py-space-lg flex flex-col gap-space-lg max-w-[1360px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              Live OpenMeteo Feed
            </span>
            <span className="font-label-xs text-label-xs text-on-surface-variant">Refreshed every 2 min • No API key needed</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {city ? `${city.name} Weather` : 'Weather'} & Environment
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Real-time atmospheric conditions, air quality, and 7-day outlook streamed from global sensor models
            {city?.state ? ` for ${city.name}, ${city.state}` : ''}.
          </p>
          <CitySwitcher />
        </div>

        {feedError && !wx && (
          <div className="w-full rounded-2xl bg-error-container/30 border border-error/30 p-space-md flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[20px] text-error">wifi_off</span>
            <span className="font-body-sm text-body-sm text-on-error-container flex-1">
              The OpenMeteo feed is rate-limiting right now. Retrying automatically every minute — data will appear shortly.
            </span>
          </div>
        )}
        {loading && !wx && (
          <div className="w-full rounded-2xl bg-surface-container-lowest shadow-md p-space-xl flex items-center justify-center">
            <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              Fetching live atmospheric telemetry…
            </span>
          </div>
        )}

        {wx && (wx.current.temp == null || (wx as unknown as { stale?: boolean }).stale) && (
          <div className="w-full rounded-2xl bg-error-container/30 border border-error/30 p-space-md flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[20px] text-error">wifi_off</span>
            <span className="font-body-sm text-body-sm text-on-error-container flex-1">
              The OpenMeteo feed is temporarily rate-limited — showing the last known snapshot. Live values resume automatically within minutes.
            </span>
          </div>
        )}
        {wx && (
          <>
            {/* Current conditions hero */}
            <section className="relative w-full rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden p-space-lg md:p-space-xl">
              <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-tertiary-fixed opacity-30 blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
                <div className="flex flex-col gap-space-sm max-w-2xl">
                  <div className="flex items-baseline gap-3">
                    <span className="font-metric-display text-metric-display text-on-surface tracking-tighter">
                      {wx.current.temp != null ? Math.round(wx.current.temp) : '–'}°C
                    </span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[20px] text-secondary">
                          {wx.current.is_day ? 'wb_sunny' : 'bedtime'}
                        </span>
                        {wx.current.condition}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {city?.name}
                        {city?.state ? `, ${city.state}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-space-sm pt-space-xs">
                    {wx.daily[0] && (
                      <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[18px] text-secondary">thermostat</span>
                        <span>
                          High <strong className="text-on-surface font-medium">{wx.daily[0].max != null ? Math.round(wx.daily[0].max) : '–'}°</strong> / Low{' '}
                          <strong className="text-on-surface font-medium">{wx.daily[0].min != null ? Math.round(wx.daily[0].min) : '–'}°</strong>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">water_drop</span>
                      <span>Humidity {wx.current.humidity ?? '–'}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">air</span>
                      <span>Wind {wx.current.wind_kmh != null ? Math.round(wx.current.wind_kmh) : '–'} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px] text-secondary">wb_sunny</span>
                      <span>UV Index {wx.current.uv != null ? Math.round(wx.current.uv) : '–'}</span>
                    </div>
                  </div>
                </div>

                {/* AQI gauge */}
                <div className="flex items-center gap-space-sm bg-surface-container-low/80 backdrop-blur-md rounded-xl p-space-md shadow-sm">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle className="stroke-surface-container-high" cx="24" cy="24" fill="none" r="20" strokeWidth="4"></circle>
                      <circle
                        cx="24"
                        cy="24"
                        fill="none"
                        r="20"
                        stroke={aqiColor}
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 * (1 - aqiPct)}
                        strokeLinecap="round"
                        strokeWidth="4"
                      ></circle>
                    </svg>
                    <span className="material-symbols-outlined absolute text-[20px] text-on-tertiary-container">eco</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold" style={{ color: aqiColor }}>
                      AQI {wx.air_quality.us_aqi ?? '–'} • {wx.air_quality.severity}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      PM2.5: {wx.air_quality.pm2_5 ?? '–'} µg/m³
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 7-day real forecast */}
            <section className="w-full rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-secondary">calendar_today</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">7-Day Atmospheric Outlook</span>
                </div>
                <span className="font-label-xs text-label-xs uppercase text-on-surface-variant tracking-wider font-medium">
                  Live forecast model data
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-space-sm pt-space-xs">
                {wx.daily.map((f, i) => (
                  <div
                    key={f.date}
                    className={`flex flex-col items-center justify-between p-space-md rounded-xl transition-all hover:shadow-md cursor-pointer ${
                      i === selectedIdx ? 'bg-surface-container-low shadow-sm' : 'bg-surface hover:bg-surface-container-low'
                    }`}
                    onClick={() => setSelectedIdx(i)}
                  >
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      {i === 0 ? 'Today' : new Date(f.date).toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                    <span className="font-label-xs text-label-xs text-on-surface-variant mt-0.5">
                      {new Date(f.date).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                    </span>
                    <div className="my-space-md flex flex-col items-center">
                      <span className="font-headline-md text-headline-md text-secondary font-semibold">{f.condition.split(' ')[0]}</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant mt-1">{f.precip ?? 0}% Precip</span>
                    </div>
                    <div className="w-full flex flex-col gap-1 items-center">
                      <div className="flex items-center justify-between w-full text-on-surface font-body-sm text-body-sm font-medium">
                        <span className="text-on-surface-variant">{f.min != null ? Math.round(f.min) : '–'}°</span>
                        <span>{f.max != null ? Math.round(f.max) : '–'}°</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden relative">
                        <div className="absolute inset-0 h-full rounded-full bg-gradient-to-r from-secondary-fixed-dim to-secondary-container"></div>
                      </div>
                    </div>
                    <span className="font-label-xs text-label-xs text-on-surface-variant mt-2 text-center">{f.condition}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Pollutant breakdown — real */}
            <section className="w-full rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: aqiColor }}></span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">Air Quality Telemetry</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Live pollutant concentrations from OpenMeteo's CAMS global air-quality model for {city?.name}.
                  </p>
                </div>
                <div className="flex items-center gap-space-sm px-space-md py-2 rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: aqiColor }}>
                    sensor_occupied
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">
                    Now: <span className="font-semibold">{wx.air_quality.us_aqi ?? '–'} AQI</span> ({wx.air_quality.severity})
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
                {[
                  { label: 'Fine Particulate (PM2.5)', value: wx.air_quality.pm2_5, unit: 'µg/m³', status: 'Live' },
                  { label: 'Coarse Dust (PM10)', value: wx.air_quality.pm10, unit: 'µg/m³', status: 'Live' },
                  { label: 'Ground Ozone', value: wx.air_quality.ozone, unit: 'µg/m³', status: 'Live' },
                  { label: 'Nitrogen Dioxide', value: wx.air_quality.nitrogen_dioxide, unit: 'µg/m³', status: 'Live' },
                ].map((p) => (
                  <div key={p.label} className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">{p.label}</span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-tertiary-container font-label-xs text-label-xs">{p.status}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        {p.value != null ? p.value : '–'}
                      </span>
                      <span className="block font-label-xs text-label-xs text-on-surface-variant">{p.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Neighborhood microclimates — Jaipur sensor grid */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
                <div>
                  <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">Localized Grid Array</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Neighborhood Microclimate Readings</h2>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {isJaipur ? '4 Active Sensor Quadrants' : 'Citywide aggregated reading'}
                </span>
              </div>
              {isJaipur ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {NEIGHBORHOOD_METRICS.map((n) => (
                    <div key={n.id} className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-xs text-label-xs font-semibold">
                            {n.name.split(' ')[0]} Node
                          </span>
                          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                        </div>
                        <div className="mt-space-md">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">{n.name}</h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-headline-lg text-headline-lg text-on-surface">{n.temp}°C</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Aravalli plains sector</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-space-md flex flex-col gap-2">
                        <div className="flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">shield</span> AQI
                          </span>
                          <span className="font-semibold text-on-tertiary-container">
                            {n.aqi} ({n.aqiLabel})
                          </span>
                        </div>
                        <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-on-tertiary-container rounded-full" style={{ width: `${n.aqi}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between font-body-sm text-body-sm pt-1">
                          <span className="text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-secondary">wb_sunny</span> UV Index
                          </span>
                          <span className="font-semibold text-on-surface">{n.uv}</span>
                        </div>
                        <div className="flex items-center justify-between font-body-sm text-body-sm pt-1">
                          <span className="text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-secondary">air</span> Wind & Air
                          </span>
                          <span className="text-on-surface">
                            {n.wind} • {n.hum}
                          </span>
                        </div>
                      </div>
                      <div className="mt-space-lg pt-space-sm bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-secondary">info</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{n.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-[22px]">sensors</span>
                    </div>
                    <div>
                      <span className="font-headline-sm text-headline-sm text-on-surface block">Citywide Reading Active</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        The hyperlocal neighborhood sensor grid is currently deployed in Jaipur. {city?.name} is streaming
                        citywide conditions: {wx.current.temp != null ? Math.round(wx.current.temp) : '–'}°C, AQI {wx.air_quality.us_aqi ?? '–'}.
                      </span>
                    </div>
                  </div>
                  <button
                    className="px-space-md py-2 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1.5 shrink-0"
                    onClick={() =>
                      setCity({ id: 1, name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, is_default: true })
                    }
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">explore</span> View Jaipur Grid
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </section>
      <Footer />
      <AIAssistant />
    </main>
  );
}
