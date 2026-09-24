import { City } from '@/types';

export const API_BASE = 'http://localhost:8001';

export interface GeoResult {
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  city: string;
  current: {
    temp: number | null;
    humidity: number | null;
    wind_kmh: number | null;
    condition: string;
    is_day: number | null;
    uv: number | null;
  };
  air_quality: {
    us_aqi: number | null;
    pm2_5: number | null;
    pm10: number | null;
    ozone: number | null;
    nitrogen_dioxide: number | null;
    severity: string;
  };
  daily: { date: string; max: number | null; min: number | null; precip: number | null; condition: string }[];
}

export const AQI_SEVERITY_COLORS: Record<string, string> = {
  GOOD: '#10b981',
  MODERATE: '#eab308',
  SENSITIVE: '#f59e0b',
  UNHEALTHY: '#ef4444',
};

export async function fetchCities(): Promise<City[]> {
  const r = await fetch(`${API_BASE}/api/cities`);
  if (!r.ok) throw new Error('Failed to load cities');
  return r.json();
}

export async function geocodeCities(q: string): Promise<GeoResult[]> {
  if (q.trim().length < 3) return [];
  try {
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
    );
    const data = await r.json();
    const results: GeoResult[] = data.results ?? [];
    // India results first — India is home
    results.sort((a, b) => (b.country_code === 'IN' ? 1 : 0) - (a.country_code === 'IN' ? 1 : 0));
    return results;
  } catch {
    return [];
  }
}

export async function addCity(payload: { name: string; state?: string; lat: number; lng: number }): Promise<City> {
  const r = await fetch(`${API_BASE}/api/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: payload.name, state: payload.state ?? '', lat: payload.lat, lng: payload.lng }),
  });
  if (!r.ok) throw new Error('Failed to add city');
  return r.json();
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const r = await fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(city)}`);
  if (!r.ok) throw new Error('Weather fetch failed');
  return r.json();
}
