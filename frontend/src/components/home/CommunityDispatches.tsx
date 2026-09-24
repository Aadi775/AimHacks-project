'use client';

export default function CommunityDispatches() {
  const dispatches = [
    { category: 'Clean Power SF', catColor: 'bg-surface-container-low text-on-tertiary-container', time: '2h ago', title: 'Residential Clean Energy Rebate Program', desc: 'New municipal subsidies up to $2,400 for heat pump conversions and domestic induction cooktops now open to renters and homeowners.', action: 'Apply Now →' },
    { category: 'Rec & Parks', catColor: 'bg-surface-container-low text-secondary', time: 'Scheduled This Sat', title: 'Weekend Open Streets: Golden Gate Park', desc: 'JFK Promenade car-free festival with family outdoor fitness, live acoustic pavilions, and mobile air-quality sensor crafting workshops.', action: 'Event Map →' },
    { category: 'JAIUC Water', catColor: 'bg-surface-container-low text-on-surface', time: 'Final inspection passed', title: 'Geary Corridor Water Main Modernization', desc: 'Seismic ducting installation between 15th and 22nd Ave final pavement phase. Water pressure sensors nominal.', action: 'Read Dispatch →' },
  ];

  return (
    <section className="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
        <div>
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-secondary font-semibold">City Dispatches &amp; Action</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">Resident Pulse Bulletin</h2>
        </div>
        <span className="font-label-xs text-label-xs text-on-surface-variant">Verified by SF JCTSLcipal Agencies</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dispatches.map((d, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full font-label-xs text-label-xs font-semibold ${d.catColor}`}>{d.category}</span>
                <span className="font-label-xs text-label-xs text-on-surface-variant">{d.time}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{d.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">{d.desc}</p>
            </div>
            <div className="pt-6 mt-4 flex items-center justify-between">
              <span className="font-label-xs text-label-xs text-on-surface-variant">Application window open</span>
              <a href="#" className="font-label-md text-label-md text-secondary font-medium hover:underline">{d.action}</a>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Action Bar */}
      <div className="mt-8 bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left w-full lg:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">flash_on</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-medium">Direct Civic Actions</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Quick pathways to report, monitor, or consume open city streams</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px] text-error">campaign</span>
            <span>Report Issue via 311</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px] text-secondary">sms</span>
            <span>Subscribe to AQI Alerts</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary hover:bg-surface-container-highest hover:text-on-surface font-label-md text-label-md transition-all shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px]">dataset</span>
            <span>Download GeoJSON</span>
          </button>
        </div>
      </div>
    </section>
  );
}
