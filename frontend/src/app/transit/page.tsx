'use client';

import { useState } from 'react';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { TRANSIT_LINES, DISPATCH_ITEMS } from '@/lib/constants';

export default function TransitPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredLines = activeTab === 'all' ? TRANSIT_LINES : TRANSIT_LINES.filter((l) => l.mode === activeTab);

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <div className="w-full px-gutter md:px-margin max-w-[1360px] mx-auto py-space-lg">
        <section className="flex flex-col gap-space-sm mb-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">Active Jaipur Region Telemetry</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Jaipur Transit &amp; Community Activity</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Real-time updates on lines, stations, and citizen-reported 311/911 civic events.</p>
            </div>
            <div className="flex flex-wrap items-center gap-space-xs">
              {[
                { icon: 'check_circle', color: 'on-tertiary-container', text: '94% Transit Lines On Schedule' },
                { icon: 'assignment', color: 'secondary', text: '12 Active 311 Reports' },
                { icon: 'verified_user', color: 'on-surface-variant', text: '0 Critical Emergency Closures' },
              ].map((s) => (
                <div key={s.text} className="flex items-center gap-space-xs px-space-md py-2 rounded-full bg-surface-container-low shadow-sm"><span className="material-symbols-outlined text-[18px] text-{s.color}">{s.icon}</span><span className="font-label-md text-label-md text-on-surface font-medium">{s.text}</span></div>
              ))}
            </div>
          </div>
        </section>
        <section className="mb-space-lg">
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col md:flex-row items-center gap-space-md relative overflow-hidden">
            <div className="w-full md:w-2/5 flex flex-col gap-space-xs z-10">
              <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-xs text-label-xs">GIS Corridor Visualizer</span><span className="font-label-xs text-label-xs text-on-tertiary-container font-medium">Auto-Refreshes live</span></div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Mission &amp; Market Mobility Concourse</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">All subway lines running with sub-4-minute headway. Autonomous shuttle trial zones open on California St.</p>
              <div className="flex items-center gap-space-md mt-space-xs"><div className="flex flex-col"><span className="font-label-xs text-label-xs text-on-surface-variant uppercase font-semibold">Average Fleet Speed</span><span className="font-headline-sm text-headline-sm text-on-surface font-semibold">24.2 mph</span></div><div className="flex flex-col"><span className="font-label-xs text-label-xs text-on-surface-variant uppercase font-semibold">Active Rolling Stock</span><span className="font-headline-sm text-headline-sm text-on-surface font-semibold">188 Vehicles</span></div></div>
            </div>
            <div className="w-full md:w-3/5 h-44 rounded-xl overflow-hidden relative shadow-sm"><img className="w-full h-full object-cover" src="https://picsum.photos/seed/transit-map/600/200" alt="Transit Map" /><div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-full flex items-center gap-1.5 shadow-sm"><span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span><span className="font-label-xs text-label-xs text-on-surface font-medium">Jaipur Metro/JCTSL Central Trunk</span></div></div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <section className="lg:col-span-7 flex flex-col gap-space-md min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs"><div><h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">Rail &amp; Bus Line Health</h2><p className="font-body-sm text-body-sm text-on-surface-variant">Live telemetry from SFMTA, Jaipur Metro API, and WETA</p></div><div className="flex items-center p-1 bg-surface-container-low rounded-full self-start" id="transit-tabs">{['All Lines', 'Rail/Metro', 'Bus', 'Ferry'].map((tab, i) => { const cats = ['all', 'rail', 'bus', 'ferry']; return <button key={tab} className={`tab-btn px-space-sm py-1 rounded-full font-label-md text-label-md transition-all ${activeTab === cats[i] ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`} data-category={cats[i]} onClick={() => setActiveTab(cats[i])} type="button">{tab}</button>; })}</div></div>
            <div className="flex flex-col gap-space-sm" id="lines-container">
              {filteredLines.map((line) => (
                <article key={line.id} className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-xs" data-mode={line.mode}>
                  <div className="flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0"><div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface shrink-0"><span className="material-symbols-outlined text-[20px]">{line.mode === 'rail' ? 'train' : line.mode === 'bus' ? 'directions_bus' : 'directions_boat'}</span></div><div className="flex flex-col min-w-0"><div className="flex items-center gap-space-xs"><span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">{line.name}</span><span className="text-on-surface-variant font-label-xs text-label-xs shrink-0">{line.route.split(' ')[0]}</span></div><span className="font-body-sm text-body-sm text-on-surface-variant truncate">{line.route}</span></div></div><span className="px-space-sm py-1 rounded-full bg-surface-container-low text-on-tertiary-container font-label-md text-label-md shrink-0 flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span> {line.status}</span></div>
                  <div className="flex flex-wrap items-center justify-between gap-y-2 pt-space-xs bg-surface-container-low/50 px-space-sm py-2 rounded-xl mt-space-xs"><div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm"><span className="material-symbols-outlined text-[16px] text-on-surface">timelapse</span><span>Headway: <strong className="text-on-surface font-medium">{line.headway}</strong></span></div><span className="material-symbols-outlined text-[18px] text-on-surface-variant ml-auto">chevron_right</span></div>
                </article>
              ))}
            </div>
          </section>
          <section className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center justify-between gap-space-xs"><div><h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">Community 311 Feed</h2><p className="font-body-sm text-body-sm text-on-surface-variant">Live civic response dispatch</p></div><button className="flex items-center gap-space-xs px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm" id="open-report-btn" type="button"><span className="material-symbols-outlined text-[18px]">add</span> Report Issue</button></div>
            <div className="flex flex-col gap-space-sm">
              {DISPATCH_ITEMS.map((item, i) => (
                <article key={i} className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-space-sm">
                  <div className="flex items-start justify-between gap-space-xs"><div className="flex items-center gap-space-sm"><div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0"><span className="material-symbols-outlined text-[18px]">{item.orgIcon}</span></div><div className="flex flex-col"><div className="flex items-center gap-1"><span className="font-headline-sm text-headline-sm text-on-surface font-semibold text-sm">{item.org}</span>{item.verified && <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>}</div><span className="font-label-xs text-label-xs text-on-surface-variant">{item.time}</span></div></div></div>
                  <p className="font-body-md text-body-md text-on-surface">{item.title}</p>
                  <div className="flex items-center justify-between pt-space-xs"><div className="flex items-center gap-space-sm"><button className="like-btn flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">thumb_up</span><span className="like-count">{item.likes}</span></button><button className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span><span className="">{item.comments}</span></button></div><span className="font-label-xs text-label-xs text-on-tertiary-container font-medium">Verified</span></div>
                </article>
              ))}
            </div>
            <div className="w-full bg-surface-container-low p-space-md rounded-2xl shadow-sm flex flex-col gap-space-sm mt-space-xs"><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[20px] text-secondary">cell_tower</span><h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Civic SMS Push Alerts</h3></div><p className="font-body-sm text-body-sm text-on-surface-variant">Subscribe to instant SMS alerts for localized JCTSL delays, power alerts, and road closures.</p><form className="flex flex-col sm:flex-row items-center gap-space-xs mt-space-xs w-full" onSubmit={(e) => e.preventDefault()}><input className="w-full sm:flex-1 h-11 px-space-md rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none shadow-sm" placeholder="Zip code or neighborhood..." type="text" /><button className="w-full sm:w-auto h-11 px-space-md rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm shrink-0" type="submit">Subscribe</button></form></div>
          </section>
        </div>
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
