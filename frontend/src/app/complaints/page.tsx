'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import CitySwitcher from '@/components/shared/CitySwitcher';
import { COMPLAINT_CATEGORIES } from '@/lib/constants';
import dynamic from 'next/dynamic';
import { useCity } from '@/context/CityContext';
import { useAuth } from '@/context/AuthContext';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-44 rounded-2xl bg-surface-container-low animate-pulse" />,
});

interface RealReport {
  id: number;
  ticket: string;
  username: string;
  category: string;
  description: string;
  location: string;
  status: string;
  severity: string;
  created_at: string;
}

export default function ComplaintsPage() {
  const [selectedCategory, setSelectedCategory] = useState('pothole');
  const { city } = useCity();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('urgent');
  const [submitting, setSubmitting] = useState(false);
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [reports, setReports] = useState<RealReport[]>([]);
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);

  const [feedOffline, setFeedOffline] = useState(false);
  const loadReports = () => {
    if (!city) return;
    fetch(`http://localhost:8001/api/reports?city=${encodeURIComponent(city.name)}`)
      .then((r) => {
        if (!r.ok) throw new Error('offline');
        setFeedOffline(false);
        return r.json();
      })
      .then(setReports)
      .catch(() => setFeedOffline(true));
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const submitReport = async () => {
    if (!user) {
      setSubmitError('Please sign in to file a verified complaint.');
      return;
    }
    if (!title.trim() || !desc.trim()) {
      setSubmitError('Add a subject and description for the complaint.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    try {
      const cat = COMPLAINT_CATEGORIES.find((c) => c.id === selectedCategory);
      const sevMap: Record<string, string> = { routine: 'INFO', urgent: 'WARNING', hazardous: 'CRITICAL' };
      const token = localStorage.getItem('civicpulse-token');
      const r = await fetch('http://localhost:8001/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          city: city?.name ?? 'Jaipur',
          category: cat?.name ?? selectedCategory,
          description: title.trim(),
          location: address.trim() || (pin ? `Pinned ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}` : 'Citywide'),
          severity: sevMap[severity] ?? 'WARNING',
          lat: pin?.lat ?? null,
          lng: pin?.lng ?? null,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail ?? 'Submission failed');
      setLastTicket(data.ticket);
      setTitle('');
      setDesc('');
      setAddress('');
      setPin(null);
      loadReports();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (iso: string) => {
    const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      {/* Emergency Alert */}
      <div className="w-full bg-error-container/60 text-on-error-container px-gutter-mobile md:px-margin-tablet lg:px-margin py-2.5 flex items-center justify-between backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between gap-space-sm text-body-sm font-body-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
            <span className="font-medium text-error">Life-Threatening Emergency Notice:</span>
            <span className="hidden sm:inline text-on-error-container">For immediate gas leaks, downed high-voltage wires, or violent hazards, dial 112 directly.</span>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="text-label-xs font-label-xs uppercase tracking-wider text-error font-semibold">Open311 Direct Uplink</span>
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin lg:px-margin py-space-lg flex flex-col gap-space-xl">
        {/* Hero */}
        <section className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-space-xs text-label-xs font-label-xs text-secondary uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
              <span>Municipal Action Protocol • City &amp; County of Jaipur</span>
            </div>
            <h1 className="text-display-mobile md:text-display font-display text-on-surface tracking-tight">Resident Resolution &amp; 181 Helpline</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">File localized municipal service requests, track neighborhood public works tickets in real time, and audit algorithmic dispatch timelines.</p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm w-full lg:w-auto">
            <button className="flex-1 sm:flex-initial h-10 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm" id="quick-track-btn" type="button">
              <span className="material-symbols-outlined text-[18px]">find_in_page</span> Track Ticket by ID
            </button>
            <a href="#complaint-form" className="flex-1 sm:flex-initial h-10 px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-md">
              <span className="material-symbols-outlined text-[18px]">add_task</span> File Service Request
            </a>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          {[
            { label: 'Active District Load', value: '142', unit: 'tickets', sub: '↓ 14% vs avg', subColor: 'on-tertiary-container', bg: 'bg-surface-container-lowest', subLabel: 'Malviya Nagar' },
            { label: 'Mean SLA Response', value: '3.4', unit: 'hours', sub: '99.2% on target', subColor: 'on-tertiary-container', bg: 'bg-surface-container-lowest' },
            { label: 'Resolution Ratio', value: '89%', unit: '+4.2%', subColor: 'on-tertiary-container', bg: 'bg-surface-container-lowest', barWidth: 89 },
            { label: 'Field Fleet Active', value: '38', unit: 'crews on road', sub: 'Telemetry synced', subColor: 'secondary', bg: 'bg-surface-container-lowest' },
          ].map((m) => (
            <div key={m.label} className={`${m.bg} p-space-lg rounded-2xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-label-xs font-label-xs text-on-surface-variant uppercase tracking-wider">{m.label}</span>
                {m.subLabel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-xs text-label-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> {m.subLabel}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-space-xs my-space-xs">
                <span className="text-metric-display font-metric-display text-on-surface">{m.value}</span>
                <span className="text-label-md font-label-md text-on-surface-variant">{m.unit}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                <span>Triage queue normal</span>
                <span className={`${m.subColor} font-medium`}>{m.sub}</span>
              </div>
              {m.barWidth && (
                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: `${m.barWidth}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Left: Complaint Form */}
          <div className="xl:col-span-7 flex flex-col gap-space-md" id="complaint-form">
            <div className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-3xl shadow-sm flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-xs border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs uppercase font-semibold">Incident Dispatcher</span>
                    <span className="text-label-xs text-on-surface-variant">Protocol Ver. 2025.4</span>
                  </div>
                  <h2 className="text-headline-md font-headline-md text-on-surface">File Public Service Request</h2>
                </div>
                <div className="flex items-center gap-1.5 text-label-xs font-label-xs text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
                  <span>Direct Link to Jaipur Nagar Nigam (181) Central</span>
                </div>
              </div>

              {/* Category Grid */}
              <div className="flex flex-col gap-space-sm">
                <label className="text-label-md font-label-md text-on-surface flex items-center justify-between">
                  <span>1. Incident Classification</span>
                  <span className="text-on-surface-variant font-normal">Select matching jurisdiction</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm" id="category-selector">
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-btn p-space-md rounded-xl text-left transition-all flex flex-col justify-between gap-space-xs relative group focus:outline-none ${
                        selectedCategory === cat.id ? 'bg-surface-container-high shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                      data-cat={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      type="button"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface font-semibold">{cat.name}</div>
                        <div className="font-label-xs text-label-xs text-on-surface-variant">{cat.dept}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-space-sm">
                <label className="text-label-md font-label-md text-on-surface flex items-center justify-between">
                  <span>2. Geographic Coordinates &amp; Address</span>
                  <span className="text-secondary font-label-xs text-label-xs">Jaipur Parcel Pinning</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-space-sm">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">location_on</span>
                    <input className="w-full h-11 pl-10 pr-4 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface outline-none transition-all shadow-inner" id="incident-address" onChange={(e) => setAddress(e.target.value)} placeholder="Enter street address, intersection, or coordinates..." type="text" value={address} />
                  </div>
                  <button className="h-11 px-space-md bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md rounded-xl flex items-center justify-center gap-space-xs transition-colors shrink-0" id="geolocate-btn" onClick={() => { if (!navigator.geolocation) return; navigator.geolocation.getCurrentPosition((pos) => setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS)`)); }} type="button">
                    <span className="material-symbols-outlined text-[18px]">my_location</span> Auto-Locate GPS
                  </button>
                </div>
                <LocationPicker
                  center={[city?.lat ?? 26.9124, city?.lng ?? 75.7873]}
                  lat={pin?.lat ?? null}
                  lng={pin?.lng ?? null}
                  onPick={(la, ln) => {
                    if (Number.isNaN(la) || Number.isNaN(ln)) setPin(null);
                    else setPin({ lat: la, lng: ln });
                  }}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-space-sm">
                <label className="text-label-md font-label-md text-on-surface">3. Complaint Summary &amp; Description</label>
                <input className="w-full h-11 px-4 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface outline-none transition-all shadow-inner" id="incident-title" onChange={(e) => setTitle(e.target.value)} placeholder="Brief subject" type="text" value={title} />
                <textarea className="w-full p-4 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface outline-none transition-all resize-none shadow-inner" id="incident-desc" onChange={(e) => setDesc(e.target.value)} placeholder="Provide context..." rows={3} value={desc}></textarea>
              </div>

              {/* Upload */}
              <div className="flex flex-col gap-space-xs">
                <span className="text-label-xs font-label-xs text-on-surface-variant uppercase tracking-wider">Visual Verification Artifacts</span>
                <div className="w-full p-space-lg rounded-2xl bg-surface-container-low/70 hover:bg-surface-container text-center flex flex-col items-center justify-center gap-space-xs cursor-pointer transition-all" id="drop-zone">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
                  </div>
                  <div className="font-label-md text-label-md text-on-surface font-medium">Drag &amp; drop inspection photographs or <span className="text-secondary underline">browse files</span></div>
                  <div className="font-label-xs text-label-xs text-on-surface-variant">Max 25MB (HEIC, JPG, PNG)</div>
                </div>
              </div>

              {/* Severity */}
              <div className="flex flex-col gap-space-sm">
                <label className="text-label-md font-label-md text-on-surface">4. Impact Severity</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm" id="severity-pills">
                  {[
                    { value: 'routine', label: 'Routine', sub: 'Scheduled cycle (48h-72h)', color: 'bg-surface-container-low' },
                    { value: 'urgent', label: 'Urgent', sub: 'Commute disruption (12h-24h)', color: 'bg-surface-container-high' },
                    { value: 'hazardous', label: 'Hazardous', sub: 'Immediate safety risk (<4h)', color: 'bg-error-container/40' },
                  ].map((s) => (
                    <label key={s.value} className={`p-space-sm px-space-md rounded-xl flex items-center gap-space-sm cursor-pointer transition-colors ${s.color}`}>
                      <input checked={severity === s.value} className="accent-primary" name="severity" onChange={() => setSeverity(s.value)} type="radio" value={s.value} />
                      <div>
                        <div className="text-label-md font-label-md text-on-surface font-semibold">{s.label}</div>
                        <div className="text-label-xs font-label-xs text-on-surface-variant">{s.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container">
                <div className="flex items-center gap-space-xs text-label-xs font-label-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">shield</span>
                  <span>Encrypted SHA-256 Civic Municipal Hash</span>
                </div>
                <div className="w-full sm:w-auto flex flex-col gap-2 items-end">
                  {lastTicket && (
                    <div className="w-full flex items-center gap-2 px-space-sm py-2 rounded-xl bg-on-tertiary-container/10 border border-on-tertiary-container/30">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">task_alt</span>
                      <span className="font-body-sm text-body-sm text-on-tertiary-container">
                        Filed as <strong className="font-mono font-semibold">{lastTicket}</strong> — now live on the {city?.name ?? 'city'} map & headlines.
                      </span>
                    </div>
                  )}
                  {submitError && (
                    <div className="w-full flex items-center gap-2 px-space-sm py-2 rounded-xl bg-error-container/40 border border-error/30">
                      <span className="material-symbols-outlined text-[18px] text-error">error</span>
                      <span className="font-body-sm text-body-sm text-on-error-container flex-1">{submitError}</span>
                      {!user && <Link href="/login" className="font-label-md text-label-md text-secondary underline shrink-0">Sign In</Link>}
                    </div>
                  )}
                  {user ? (
                    <button className="w-full sm:w-auto h-12 px-space-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-xl flex items-center justify-center gap-space-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-60" disabled={submitting} id="submit-ticket-btn" onClick={submitReport} type="button">
                      <span className="material-symbols-outlined text-[20px]">{submitting ? 'progress_activity' : 'send'}</span>
                      {submitting ? 'Filing with 181…' : 'Submit Verified 181 Complaint'}
                    </button>
                  ) : (
                    <Link href="/login" className="w-full sm:w-auto h-12 px-space-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-xl flex items-center justify-center gap-space-sm transition-all shadow-md" id="submit-ticket-btn">
                      <span className="material-symbols-outlined text-[20px]">login</span> Sign In to File Complaint
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* SLAs */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="text-headline-sm font-headline-sm text-on-surface">Target Service Level Agreements (SLAs)</h3>
                <span className="text-label-xs font-label-xs uppercase text-on-surface-variant">Department Timelines</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {[
                  { name: 'JMC Potholes', actual: '26h', sla: '48h', width: 54, color: 'on-tertiary-container' },
                  { name: 'JVVNL Lighting', actual: '38h', sla: '72h', width: 52, color: 'secondary' },
                  { name: 'Sidewalk Sanitation', actual: '14h', sla: '24h', width: 58, color: 'on-tertiary-container' },
                ].map((s) => (
                  <div key={s.name} className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-medium">{s.name}</span>
                      <span className={`text-label-xs font-label-xs px-2 py-0.5 rounded-full font-semibold ${s.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-on-tertiary-container/10 text-on-tertiary-container'}`}>{s.actual} Actual</span>
                    </div>
                    <div className="text-body-sm font-body-sm text-on-surface-variant">Statutory SLA: {s.sla} limit</div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full mt-1 overflow-hidden">
                      <div className={`${s.color === 'secondary' ? 'bg-secondary' : 'bg-on-tertiary-container'} h-full rounded-full`} style={{ width: `${s.width}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Ticket Ledger */}
          <div className="xl:col-span-5 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-label-xs font-label-xs uppercase tracking-wider text-secondary">Live Transparency Feed</span>
                  <h2 className="text-headline-sm font-headline-sm text-on-surface">Community Ticket Ledger</h2>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" title="Refresh Feed" type="button">
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                </button>
              </div>
              <div className="flex items-center gap-space-xs p-1 bg-surface-container-low rounded-xl overflow-x-auto text-nowrap">
                {['All Nearby (42)', 'My Tickets (3)', 'Dispatched', 'Resolved'].map((t, i) => (
                  <button key={t} className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                    i === 0 ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                  }`} type="button">{t}</button>
                ))}
              </div>
              {reports.map((t) => (
                <div key={t.id} className="p-space-md rounded-2xl bg-surface-container-low/60 hover:bg-surface-container-low transition-all flex flex-col gap-space-sm group">
                  <div className="flex items-start justify-between gap-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold font-mono">{t.ticket}</span>
                        <span className="text-label-xs text-label-xs text-on-surface-variant">{timeAgo(t.created_at)}</span>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface mt-1">{t.description}</h4>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full font-label-xs text-label-xs font-semibold flex items-center gap-1 ${
                      t.severity === 'CRITICAL' ? 'bg-error-container/40 text-error' :
                      t.severity === 'WARNING' ? 'bg-secondary-container/30 text-on-secondary-container' :
                      'bg-on-tertiary-container/10 text-on-tertiary-container'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">{t.location} • {t.category}</p>
                  <div className="flex items-center justify-between pt-space-xs border-t border-surface-container text-body-sm font-body-sm text-on-surface-variant">
                    <button className="flex items-center gap-1.5 hover:text-on-surface transition-colors py-1 px-2 rounded-lg bg-surface-container-lowest/80 text-label-xs font-label-xs" type="button">
                      <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                      <span className="font-medium text-on-surface">filed by @{t.username}</span>
                    </button>
                    <span className="text-label-xs font-label-xs text-on-surface-variant uppercase">{t.severity} priority</span>
                  </div>
                </div>
              ))}
              {feedOffline && (
                <div className="p-space-md rounded-2xl bg-error-container/30 border border-error/30 text-center">
                  <span className="font-body-sm text-body-sm text-on-error-container">181 ledger feed offline — retrying automatically. Make sure the backend is running on port 8001.</span>
                </div>
              )}
              {reports.length === 0 && !feedOffline && (
                <div className="p-space-md rounded-2xl bg-surface-container-low/60 text-center">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">No resident complaints filed in {city?.name ?? 'this city'} yet — be the first to report.</span>
                </div>
              )}
            </div>

            {/* Escalations */}
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
                <h3 className="text-headline-sm font-headline-sm text-on-surface">Direct Escalations &amp; Oversight</h3>
              </div>
              <p className="font-body-sm font-body-sm text-on-surface-variant">Unresolved tickets exceeding maximum SLA thresholds are immediately flagged to the Board of Supervisors district ombudsman.</p>
              <div className="flex flex-col gap-space-xs">
                {[
                  { label: 'Ward Councillor Liaison', value: '+91 141 274 1112' },
                  { label: 'Jaipur 181 24x7 Helpline', value: 'Dial 181 / +91 141 274 1111' },
                  { label: 'Nagar Nigam Open311 REST API', value: 'api.jaipur.gov.in/311/v2' },
                ].map((e) => (
                  <div key={e.label} className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low text-body-sm font-body-sm">
                    <span className="font-medium text-on-surface">{e.label}</span>
                    <span className="font-mono text-label-xs text-secondary">{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
