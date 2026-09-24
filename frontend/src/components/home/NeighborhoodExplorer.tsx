'use client';

export default function NeighborhoodExplorer() {
  const districts = [
    { id: 'presidio', name: 'C-Scheme & Marina', quadrant: 'northeast', temp: 63, aqi: 18, aqiLabel: 'Pristine', icon: 'water', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFWU_s7rniL3CBT1Zi8yW8tU9yfanQFiEr9EiisuC-8r4Q_VNl-zEU2Rrkl572PaiPrDZCP-Tj7mEJng75pbHIpJl-gps2TO6wI9afuNSEQZO6jSxGTyKtHpk_xr3HBTWhdfYfqhf7MCN5Hy4KTb10a6tr7h_hfo3AFMZeTdRKHZhJBP8yPTq4pe-EWzaKmq6qkIB1g9-DrjgS4dfMzCkV2LmUHr6lJOwqAkJMZNVXEdrwJVEoNi6QBA' },
    { id: 'mission', name: 'Mission & Noe Valley', quadrant: 'central', temp: 73, aqi: 28, aqiLabel: 'Warmest Zone', icon: 'wb_sunny', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxd3JuMlfhqDN57aQgPEQyIHSuidnBJFz32BRtIq_JJwiUQvlqIvLAOHF0tRGvjiVGCHxCg9AeJooXc49cJIxKclL81JnUjwiBWgG9OKnDtT6DMoBvTn-5V_WLJmNqydyy3reyrzJZj_chEYZjlBmH_VGMR4uoARdooA4pqx55Y7Nim1sDIX1GaCxyRmBdICMBWVlGU1HyK46pKe61t3qAtmaiY9mmgUBrnUSUekn_-Oqi7WDFmGestQ' },
    { id: 'financial', name: 'Financial & Embarcadero', quadrant: 'northeast', temp: 67, aqi: 21, aqiLabel: 'Bayside Promenade', icon: 'public', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVglx-menvHftrZVRX0XnFUvP3s0SsGIpC67EiR_Io6phnLOUkj0_BvXBdYBJQHLdH17XuN0t7XC6SR3Cp3hDHei2bgaCixY38YdoNlNu03Pt3Rrflk4PriZGkfykXi3H6UFqvpjOpE_OzgymZ24zEnUJyy8ckMdbRpcEVM0oeP2g1VXFC-rInLtwglwiT5gzJGTJ5lLHkSfdyelqpZka6oy_YQ_0gEk69L5_0BAOdFe8YYSObJDPCcg' },
    { id: 'sunset', name: 'Sunset & Ocean Beach', quadrant: 'west', temp: 61, aqi: 16, aqiLabel: 'Coastal Marine Layer', icon: 'water', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgK669XZ8c-5vfdb74O3PL6kHW9P-DqO_Gpp2Q6c5mIVmum9wMGugMSk9ehpdo1vHCDi3sAWNLR9dUMd1GIqQU41AN19BffdM4dhS3Hj7Q6HdJIjpv0u1K6ADPG4B7ZyckKDUJdtOgWkryXzD3TsBrn8XLA2oHmbbWC7GZUme0zuPaV3O4Kx68V4R5laMKHGOrrAPqID4lf9E1NuvZKZLEeppmudgRj8RWW4DKHys4cSbrmVTCXunFA' },
  ];

  return (
    <section className="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
        <div>
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-secondary font-semibold">Spatial Urban Intelligence</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">Neighborhood Explorer</h2>
        </div>
        <div className="flex items-center gap-2">
          {['All Quadrants', 'Bay Side', 'Ocean Side'].map((b) => (
            <button key={b} className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all ${
              b === 'All Quadrants' ? 'bg-surface-container-lowest text-on-surface' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`} type="button">{b}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {districts.map((d) => (
          <div key={d.id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="relative h-44 w-full overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={d.img} alt={d.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                <span className="font-label-xs text-label-xs text-on-surface font-medium">{d.aqi} AQI • {d.aqiLabel}</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block">{d.quadrant.replace('-', ' ')}</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">{d.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Active community solar microgrid running at full self-sufficiency.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['Breeze 12mph', 'Solar 98%', 'Humidity 68%'].map((tag) => (
                    <span key={tag} className="font-label-xs text-label-xs bg-surface-container-low px-2 py-1 rounded-lg text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="pt-5 mt-4 flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">{d.temp}°</span>
                <button className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high font-label-md text-label-md text-on-surface font-medium transition-colors" type="button">View District</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
