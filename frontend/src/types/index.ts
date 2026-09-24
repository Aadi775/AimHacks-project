export interface CivicEvent {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  category: string;
  severity: string;
  description: string;
  metadata: Record<string, string | number>;
}

export interface TransitLine {
  id: string;
  name: string;
  route: string;
  status: string;
  headway: string;
  mode: 'rail' | 'bus' | 'ferry';
}

export interface District {
  id: string;
  name: string;
  quadrant: string;
  temp: number;
  aqi: number;
  aqiLabel: string;
  uv: number;
  wind: string;
  hum: string;
  tip: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  icon: string;
  high: number;
  low: number;
  precip: string;
  condition: string;
}

export interface Ticket {
  id: string;
  time: string;
  title: string;
  status: string;
  statusColor: string;
  desc: string;
  confirmed: number;
  district: string;
}

export interface DispatchItem {
  org: string;
  orgIcon: string;
  verified: boolean;
  time: string;
  title: string;
  desc: string;
  likes: number;
  comments: number;
  verifiedBy?: string;
  ticket?: string;
  status?: string;
}
