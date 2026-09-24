'use client';

import { useState } from 'react';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';

export default function OverviewPage() {
  const [clockTime] = useState(new Date().toLocaleString());

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <section className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin py-space-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md bg-surface-container-lowest/80 backdrop-blur-md p-space-lg rounded-2xl shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-secondary font-semibold">Civic Baseline Telemetry</span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-xs text-label-xs text-on-surface-variant font-medium" id="live-clock">{clockTime}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Good afternoon, Jaipur</h1>
            <div className="flex flex-wrap items-center gap-space-sm pt-0.5">
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface"><span className="material-symbols-outlined text-secondary text-[18px]">wb_sunny</span><span className="font-body-sm text-body-sm font-medium">68°F • Crisp &amp; Sunny</span></div>
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface"><span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span><span className="font-body-sm text-body-sm font-medium">AQI 24 • Pristine Air</span></div>
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface"><span className="material-symbols-outlined text-secondary text-[18px]">verified</span><span className="font-body-sm text-body-sm text-on-surface-variant">Grid Frequency: 60.01 Hz</span></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-xs bg-surface-container-low p-1.5 rounded-xl self-stretch lg:self-auto">
            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider px-space-sm font-semibold">Metropolis:</span>
            {['Jaipur', 'New York', 'Seattle', 'Austin'].map((c) => (
              <button key={c} className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${c === 'Jaipur' ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'hover:bg-surface-container text-on-surface-variant'}`} type="button">{c}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          {/* Left - Pulse Radial */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm space-y-space-lg">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container shadow-[0_0_8px_rgba(0,150,105,0.6)]"></span><span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-on-surface-variant">Live Composite Index</span></div><span className="font-label-xs text-label-xs px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-medium">99.4% Sensor Uptime</span></div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-space-lg py-space-sm">
              <div className="relative w-44 h-44 flex items-center justify-center"><svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160"><defs><linearGradient id="pulse-gradient" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stopColor="#40c2fd"></stop><stop offset="100%" stopColor="#009669"></stop></linearGradient></defs><circle cx="80" cy="80" fill="transparent" r="66" stroke="#eff4ff" strokeWidth="12"></circle><circle className="transition-all duration-1000 ease-out" cx="80" cy="80" fill="transparent" r="66" stroke="url(#pulse-gradient)" strokeDasharray="414.69" strokeDashoffset="49.76" strokeLinecap="round" strokeWidth="12"></circle></svg><div className="absolute flex flex-col items-center justify-center text-center"><span className="font-metric-display text-metric-display font-semibold text-on-surface leading-none tracking-tight">88</span><span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mt-1">Index Score</span></div></div>
              <div className="flex flex-col text-center sm:text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 self-center sm:self-start px-2.5 py-1 rounded-full bg-surface-container text-on-tertiary-container font-label-md text-label-md font-semibold"><span className="material-symbols-outlined text-[16px]">check_circle</span> Optimal Grade</div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-1">Excellent Civic Health</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[220px]">Urban ecosystem running smoothly across transit, air, and civil assets.</p>
              </div>
            </div>
            <div className="space-y-space-sm bg-surface-container-low/70 p-space-md rounded-xl">
              {[
                { icon: 'air', label: 'Air Quality', value: '92/100', sub: 'Pristine', color: 'on-tertiary-container', width: 92 },
                { icon: 'directions_transit', label: 'Transit Flow', value: '84/100', sub: 'Smooth', color: 'secondary', width: 84 },
                { icon: 'health_and_safety', label: 'Public Safety', value: '89/100', sub: 'Steady', color: 'on-surface', width: 89 },
                { icon: 'bolt', label: 'Grid Stability', value: '96/100', sub: '100% Green', color: 'on-tertiary-container', width: 96 },
              ].map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm"><span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">{m.icon}</span> {m.label}</span><span className="font-medium text-{m.color}">{m.value} <span className="text-on-surface-variant text-label-xs font-normal">{m.sub}</span></span></div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden"><div className="h-full bg-{m.color} rounded-full" style={{ width: `${m.width}%` }}></div></div>
                </div>
              ))}
            </div>
            <div className="p-space-md rounded-xl bg-surface-container-high flex items-start gap-space-sm text-on-surface"><span className="text-lg leading-none mt-0.5">✨</span><p className="font-body-sm text-body-sm leading-snug"><span className="font-semibold text-secondary">Civic trend:</span> Conditions are 6% better than last Friday. High solar generation and favorable coastal breezes make today ideal for outdoor recreation along the Embarcadero.</p></div>
          </div>

          {/* Right - Interactive Map */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm relative overflow-hidden min-h-[460px]">
            <div className="flex flex-wrap items-center justify-between gap-space-md z-10">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-1.5 rounded-full shadow-sm"><span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span><span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-on-surface">Viewing: Live Neighborhood Comfort</span></div>
              <div className="flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-full shadow-sm">
                <button aria-label="Zoom in" className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">add</span></button>
                <button aria-label="Zoom out" className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                <div className="w-px h-4 bg-surface-container"></div>
                <button aria-label="Reset" className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">my_location</span></button>
              </div>
            </div>
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-90 p-4">
              <svg className="w-full h-full max-w-[620px] max-h-[500px]" fill="none" viewBox="0 0 700 520">
                <path d="M510,0 C540,120 530,220 570,300 C610,380 670,440 700,480 L700,0 Z" fill="#eff4ff"></path>
                <path d="M510,0 C540,120 530,220 570,300 C610,380 670,440 700,480" stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="3"></path>
                <polygon fill="#45dfa4" fillOpacity="0.18" points="120,60 300,50 340,140 180,180" stroke="#009669" strokeWidth="1.5"></polygon>
                <polygon fill="#40c2fd" fillOpacity="0.22" points="340,140 500,110 540,240 370,250" stroke="#00668a" strokeWidth="1.5"></polygon>
                <polygon fill="#68fcbf" fillOpacity="0.25" points="260,260 410,255 390,390 230,370" stroke="#009669" strokeWidth="1.5"></polygon>
                <polygon fill="#40c2fd" fillOpacity="0.12" points="50,190 240,185 220,380 40,360" stroke="#40c2fd" strokeWidth="1.5"></polygon>
                <path d="M70,280 C200,280 320,220 480,160" stroke="#00668a" strokeDasharray="6 6" strokeLinecap="round" strokeWidth="2.5"></path>
                <path d="M330,60 C340,180 320,300 310,480" opacity="0.4" stroke="#76777d" strokeWidth="1.5"></path>
                <circle className="animate-ping" cx="230" cy="110" fill="#009669" fillOpacity="0.15" r="14"></circle><circle cx="230" cy="110" fill="#009669" r="7"></circle><circle cx="230" cy="110" fill="#ffffff" r="3"></circle>
                <circle className="animate-pulse" cx="440" cy="180" fill="#00668a" fillOpacity="0.15" r="16"></circle><circle cx="440" cy="180" fill="#00668a" r="7"></circle><circle cx="440" cy="180" fill="#ffffff" r="3"></circle>
                <circle cx="320" cy="320" fill="#009669" fillOpacity="0.15" r="14"></circle><circle cx="320" cy="320" fill="#009669" r="7"></circle><circle cx="320" cy="320" fill="#ffffff" r="3"></circle>
                <text fill="#0b1c30" fontFamily="Inter" fontSize="12" fontWeight="600" x="210" y="85">C-Scheme / Marina</text><text fill="#45464d" fontFamily="Inter" fontSize="10" x="210" y="100">AQI 18 • Pristine</text>
                <text fill="#0b1c30" fontFamily="Inter" fontSize="12" fontWeight="600" x="430" y="145">Downtown / SoMa</text><text fill="#45464d" fontFamily="Inter" fontSize="10" x="430" y="160">Transit Cadence: 98%</text>
                <text fill="#0b1c30" fontFamily="Inter" fontSize="12" fontWeight="600" x="290" y="295">Malviya Nagar</text><text fill="#45464d" fontFamily="Inter" fontSize="10" x="290" y="310">Microclimate: 71°F</text>
                <text fill="#0b1c30" fontFamily="Inter" fontSize="12" fontWeight="600" x="80" y="270">Sunset District</text><text fill="#45464d" fontFamily="Inter" fontSize="10" x="80" y="285">Ocean Fog: Dispersed</text>
              </svg>
            </div>
            <div className="mt-auto z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pt-40">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-2.5 rounded-xl shadow-md flex items-center gap-space-md"><div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary"><span className="material-symbols-outlined text-[20px]">sensors</span></div><div><div className="flex items-center gap-1.5"><span className="font-body-sm text-body-sm font-semibold text-on-surface">Mission Microgrid #04</span><span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span></div><span className="font-label-xs text-label-xs text-on-surface-variant">Active • Lat 37.7599 N, Lon 122.4148 W</span></div></div>
              <div className="bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-2 rounded-xl shadow-sm flex items-center gap-space-md font-label-xs text-label-xs text-on-surface-variant"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"></span> Optimal</span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span> Nominal</span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Maintenance</span></div>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <section className="space-y-space-md pt-space-sm">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"><div><div className="flex items-center gap-space-xs"><span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold text-secondary">Public Bulletins</span><span className="text-outline-variant">•</span><span className="font-label-xs text-label-xs text-on-tertiary-container font-medium">3 Active Real-Time Advisories</span></div><h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">Top Headlines</h2></div><a href="#" className="font-body-sm text-body-sm text-secondary hover:text-on-surface font-medium flex items-center gap-1 self-start sm:self-auto transition-colors">View all 14 neighborhood dispatches<span className="material-symbols-outlined text-[16px]">arrow_forward</span></a></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {[
              { category: 'Infrastructure', catBg: 'bg-surface-container text-secondary', title: 'Water Main Maintenance on Geary Blvd', desc: 'Crews completing scheduled valve upgrades between 4th & 6th Ave.', location: 'Inner Richmond • Geary Corridor', status: 'Active Crew', time: '18m ago' },
              { category: 'Sustainability', catBg: 'bg-surface-container text-on-tertiary-container', title: 'C-Scheme Community Solar Battery Online', desc: 'New 4.2 MWh municipal energy storage unit energized today.', location: 'C-Scheme District Microgrid', status: '+4.2 MWh Clean', time: '1h ago' },
              { category: 'Transit', catBg: 'bg-surface-container-high text-secondary', title: 'Jaipur Metro Weekend Express Schedule Active', desc: 'Extra train frequency on Yellow and Blue lines.', location: 'Jaipur Region Rapid Transit', status: '10-Min Headways', time: '2h ago' },
            ].map((h, i) => (
              <div key={i} className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between space-y-space-md hover:shadow-md transition-all group">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between"><span className={`px-2.5 py-0.5 rounded-full font-label-xs text-label-xs font-semibold uppercase tracking-wider ${h.catBg}`}>{h.category}</span><span className="font-label-xs text-label-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {h.time}</span></div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-secondary transition-colors">{h.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{h.desc}</p>
                </div>
                <div className="pt-space-sm flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl text-on-surface"><span className="font-label-xs text-label-xs text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-secondary">location_on</span> {h.location}</span><span className="font-label-xs text-label-xs text-secondary font-semibold">{h.status}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Ribbon */}
        <div className="bg-surface-container-low/80 p-space-md rounded-2xl flex flex-col md:flex-row items-center justify-between gap-space-md mt-space-lg">
          <div className="flex items-center gap-space-md"><div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-sm"><span className="material-symbols-outlined text-[22px]">contact_support</span></div><div><span className="font-headline-sm text-headline-sm text-on-surface font-medium">Resident Civic Telemetry Services</span><p className="font-body-sm text-body-sm text-on-surface-variant">Report public space anomalies, request sensor audits, or call emergency dispatch.</p></div></div>
          <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto justify-start lg:justify-end">
            <a href="tel:311" className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md shadow-sm font-semibold"><span className="material-symbols-outlined text-[16px] text-secondary">phone</span> Dial SF 311</a>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md shadow-sm font-semibold" type="button"><span className="material-symbols-outlined text-[16px] text-on-tertiary-container">campaign</span> Submit Resident Feedback</button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-surface-tint transition-all font-label-md text-label-md shadow-sm font-semibold" type="button"><span className="material-symbols-outlined text-[16px]">emergency_share</span> Emergency Directory</button>
          </div>
        </div>
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
