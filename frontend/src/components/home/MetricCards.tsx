'use client';

export default function MetricCards() {
  return (
    <section className="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
        <div>
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-secondary font-semibold">Atmospheric &amp; Operational Cadence</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">Live City Telemetry</h2>
        </div>
        <span className="font-label-xs text-label-xs text-on-surface-variant">Continuous aggregation from 1,420 IoT monitoring nodes</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Weather Microclimates */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span><span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-medium">Atmosphere &amp; Wind</span></div>
              <span className="font-label-xs text-label-xs px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-medium">Marine Inversion</span>
            </div>
            <div className="mt-4"><h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Hyperlocal Microclimates</h3><p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Wide 12° thermal spread across 7 miles due to Pacific marine layer compression.</p></div>
            <div className="grid grid-cols-3 gap-2.5 mt-5">
              {[
                { name: 'Sunset', temp: '61°', cond: 'Foggy', condColor: 'text-secondary', condIcon: 'cloud' },
                { name: 'Mission', temp: '73°', cond: 'Sunny', condColor: 'text-amber-500', condIcon: 'wb_sunny' },
                { name: 'Financial', temp: '67°', cond: 'Breezy', condColor: 'text-on-surface-variant', condIcon: 'air' },
              ].map((d) => (
                <div key={d.name} className="bg-surface-container-low/70 rounded-2xl p-3 text-center">
                  <span className="font-label-xs text-label-xs text-on-surface-variant block">{d.name}</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-semibold block mt-0.5">{d.temp}</span>
                  <span className={`font-label-xs text-label-xs ${d.condColor} flex items-center justify-center gap-0.5 mt-1`}><span className="material-symbols-outlined text-[13px]">{d.condIcon}</span> {d.cond}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 rounded-2xl bg-surface-container-low/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5"><span className="material-symbols-outlined text-[20px] text-secondary">explore</span><div className="min-w-0"><span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block">Pacific Coastal Vector</span><span className="font-body-sm text-body-sm text-on-surface font-medium block">WNW 14 mph • Gusting 21 mph</span></div></div>
              <svg className="w-12 h-6 text-secondary" fill="none" viewBox="0 0 48 24"><path d="M2 12C10 4 18 20 26 12C34 4 42 16 46 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path></svg>
            </div>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary font-medium hover:text-on-surface mt-6 pt-4 bg-transparent transition-colors"><span>Explore Weather &amp; Environment</span><span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span></a>
        </div>

        {/* Card 2: Transit & 311 */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span><span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-medium">Transit &amp; Services</span></div><span className="font-label-xs text-label-xs px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-tertiary-container font-medium">Nominal Flow</span></div>
            <div className="mt-4"><h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Real-time Transit &amp; 311</h3><p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Multi-modal artery monitoring with verified civic issue dispatch resolution.</p></div>
            <div className="space-y-2 mt-4">
              {[
                { agency: 'Jaipur Metro', color: 'bg-surface-container-high', textColor: 'text-on-surface', line: 'Yellow / Red Lines', status: 'Every 8 min • Nominal', statusColor: 'on-tertiary-container' },
                { agency: 'MUNI', color: 'bg-secondary-fixed', textColor: 'text-on-secondary-container', line: 'N-Judah / 38R Geary', status: '96% Cadence', statusColor: 'on-tertiary-container' },
              ].map((t) => (
                <div key={t.agency} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/60">
                  <div className="flex items-center gap-2.5"><span className={`px-2 py-0.5 rounded-md ${t.color} ${t.textColor} font-label-xs text-label-xs font-semibold`}>{t.agency}</span><span className="font-body-sm text-body-sm text-on-surface font-medium">{t.line}</span></div>
                  <div className="flex items-center gap-1.5 font-label-xs text-label-xs text-on-tertiary-container"><span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span><span>{t.status}</span></div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-2xl bg-surface-container-low/40"><div className="flex items-center gap-2 mb-1"><span className="material-symbols-outlined text-[15px] text-on-tertiary-container">task_alt</span><span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">311 Community Resolution</span></div><p className="font-body-sm text-body-sm text-on-surface truncate">Fell St Bike Lane Sweeper dispatch completed (Ticket #18942)</p><span className="font-label-xs text-label-xs text-on-surface-variant block mt-0.5">Resolved in 42 minutes • Hayes Valley</span></div>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary font-medium hover:text-on-surface mt-6 pt-4 bg-transparent transition-colors"><span>View Transit &amp; Incidents</span><span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span></a>
        </div>

        {/* Card 3: Civic Health Index */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span><span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-medium">Infrastructure Grid</span></div><span className="font-label-xs text-label-xs px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-tertiary-container font-medium">100% Clean Source</span></div>
            <div className="mt-4"><h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Civic Health Index &amp; Grid</h3><p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Synthesized composite score of air purity, grid resilience, and transit accuracy.</p></div>
            <div className="mt-4 flex items-center justify-between bg-surface-container-low/50 p-3.5 rounded-2xl">
              <div className="flex items-center gap-3"><div className="relative w-14 h-14 flex items-center justify-center"><svg className="w-full h-full -rotate-90" viewBox="0 0 36 36"><path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path><path className="text-on-tertiary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="3"></path></svg><span className="absolute font-headline-sm text-headline-sm font-semibold text-on-surface">88</span></div><div><span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block">Composite Health</span><span className="font-body-sm text-body-sm text-on-surface font-medium block">Upper 95th Percentile</span></div></div>
              <div className="text-right"><span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block mb-1">24h Cadence</span><svg className="w-20 h-7 text-on-tertiary-container" fill="none" viewBox="0 0 80 28"><path d="M2 20 Q 20 8, 35 15 T 60 7 T 78 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path><circle cx="78" cy="4" fill="currentColor" r="2.5"></circle></svg></div>
            </div>
            <div className="mt-3 p-3 rounded-2xl bg-surface-container-low/40"><div className="flex items-center justify-between text-label-xs font-label-xs mb-1.5"><span className="text-on-surface-variant">Bisalpur Water Grid + SF Solar</span><span className="font-medium text-on-surface">742 MW / 0g CO2 eq</span></div><div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex"><div className="h-full bg-on-tertiary-container" style={{ width: '72%' }}></div><div className="h-full bg-secondary-container" style={{ width: '28%' }}></div></div></div>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary font-medium hover:text-on-surface mt-6 pt-4 bg-transparent transition-colors"><span>Explore City Overview</span><span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span></a>
        </div>
      </div>
    </section>
  );
}
