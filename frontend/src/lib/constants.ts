export const COLORS = {
  onTertiary: '#ffffff',
  onTertiaryContainer: '#009669',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#45464d',
  surface: '#f8f9ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',
  secondary: '#00668a',
  secondaryContainer: '#40c2fd',
  secondaryFixed: '#c4e7ff',
  secondaryFixedDim: '#7bd0ff',
  tertiaryFixed: '#68fcbf',
  tertiaryFixedDim: '#45dfa4',
  primary: '#000000',
  primaryContainer: '#131b2e',
  primaryFixed: '#dae2fd',
  primaryFixedDim: '#bec6e0',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  inverseSurface: '#213145',
  inversePrimary: '#bec6e0',
  inverseOnSurface: '#eaf1ff',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#004d6a',
  onSecondaryFixed: '#001e2c',
  onSecondaryFixedVariant: '#004c69',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#7c839b',
  onPrimaryFixed: '#131b2e',
  onPrimaryFixedVariant: '#3f465c',
  onTertiaryFixed: '#002114',
  onTertiaryFixedVariant: '#005137',
  onBackground: '#0b1c30',
  background: '#f8f9ff',
} as const;

export const NAV_ITEMS = [
  { path: 'home', label: 'Home' },
  { path: 'overview', label: 'Overview & Pulse' },
  { path: 'weather', label: 'Weather & Environment' },
  { path: 'transit', label: 'Transit & Incidents' },
  { path: 'complaints', label: '181 Complaints' },
  { path: 'insights', label: 'Causes & Correlation' },
] as const;

export const CITIES = [
  'Jaipur', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad',
  'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Lucknow',
];

export const METRICS = {
  civicIndex: { value: 88, label: 'Civic Index', status: 'Optimal', trend: '+3.2 pts' },
  aqi: { value: 42, label: 'Air Quality', status: 'Moderate', unit: 'PM2.5' },
  transitCadence: { value: 91, label: 'Transit On-Time', status: 'Nominal', unit: '%' },
  gridPower: { value: 100, label: 'Municipal Power', status: 'Zero Carbon', unit: '%' },
} as const;

export const DISTRICTS = [
  { id: 'c-scheme', name: 'C-Scheme & Ashok Nagar', quadrant: 'central', temp: 33, aqi: 42, aqiLabel: 'Moderate', icon: 'location_city' },
  { id: 'vaishali', name: 'Vaishali Nagar', quadrant: 'west', temp: 34, aqi: 45, aqiLabel: 'Moderate', icon: 'storefront' },
  { id: 'malviya', name: 'Malviya Nagar & Jagatpura', quadrant: 'southeast', temp: 35, aqi: 48, aqiLabel: 'Moderate', icon: 'business' },
  { id: 'amer', name: 'Amer & Kukas', quadrant: 'north', temp: 32, aqi: 38, aqiLabel: 'Good', icon: 'fort' },
] as const;

export const TRANSIT_LINES = [
  { id: 'metro-pink', name: 'Jaipur Metro Pink Line', route: 'Mansarovar ↔ Chandpole', status: 'On Time', headway: 'Every 10 mins', mode: 'rail' },
  { id: 'metro-orange', name: 'Jaipur Metro Orange Line', route: 'Sitapura ↔ Ambabari', status: 'On Time', headway: 'Every 12 mins', mode: 'rail' },
  { id: 'jctsl-ac1', name: 'JCTSL AC1 Air-Conditioned', route: 'Sanganeri Gate ↔ Vaishali Nagar', status: 'Minor Delays (+6m)', headway: 'Every 15 mins', mode: 'bus' },
  { id: 'jctsl-r9', name: 'JCTSL Route 9', route: 'Sindhi Camp ↔ Jagatpura', status: 'On Time', headway: 'Every 8 mins', mode: 'bus' },
  { id: 'jctsl-r7', name: 'JCTSL Route 7', route: 'Amer Fort ↔ Tonk Phatak', status: 'On Time', headway: 'Every 10 mins', mode: 'bus' },
  { id: 'low-floor', name: 'JCTSL Low-Floor City Bus', route: 'Vidhan Sabha ↔ Mansarovar Metro', status: 'On Time', headway: 'Every 12 mins', mode: 'bus' },
] as const;

export const HEADLINES = [
  { category: 'Infrastructure', time: '18m ago', title: 'Water supply maintenance on JLN Marg', desc: 'Jal Board crews completing scheduled valve upgrades near Gandhi Nagar Metro station.', org: 'Civil Lines • JLN Marg Corridor', status: 'Active Crew' },
  { category: 'Sustainability', time: '1h ago', title: 'Nagar Nigam Rooftop Solar Drive Crosses 40 MW', desc: 'New municipal subsidy registrations crossed 4,200 households this week across Jaipur.', org: 'JMC Green Jaipur Mission', status: '+40 MW Clean' },
  { category: 'Transit', time: '2h ago', title: 'Jaipur Metro Festive Schedule Active', desc: 'Extra frequency on Pink and Orange lines for the Teej procession corridors.', org: 'Jaipur Metro Rail Corporation', status: '10-Min Headways' },
] as const;

export const DISPATCH_ITEMS = [
  { org: 'Jaipur Development Authority', orgIcon: 'directions_car', verified: true, time: '5m ago', title: 'Minor traffic collision cleared at JLN Marg & Gandhi Nagar', desc: 'All lanes reopened, residual slow traffic easing.', likes: 14, comments: 3, verifiedBy: 'Control Room #412', status: 'Lanes Reopened' },
  { org: 'Resident Report', orgIcon: 'construction', verified: false, time: '24m ago', ticket: '#181-8942', title: 'Pothole reported on Tonk Road near Gandhi Nagar Metro', desc: 'Nagar Nigam dispatched maintenance crew.', likes: 8, comments: 1, status: 'NN Unit 14 En Route' },
  { org: 'JMC Parks Dept', orgIcon: 'park', verified: true, time: '1h ago', title: 'Fallen neem branch safely removed from Central Park', desc: 'Walking trail fully cleared and open for morning walkers.', likes: 32, comments: 0, status: 'Trail Cleared' },
  { org: 'JVVNL', orgIcon: 'lightbulb', verified: true, time: '2h ago', title: 'Routine streetlamp LED upgrade on MI Road completed', desc: 'Lighting lux levels increased by 18% with reduced draw.', likes: 19, comments: 0, status: 'Upgrade Complete' },
] as const;

export const NEIGHBORHOOD_METRICS = [
  { id: 'c-scheme', name: 'C-Scheme & Ashok Nagar', temp: 33, aqi: 42, aqiLabel: 'Moderate', uv: 7, wind: '9 km/h W', hum: '38%', tip: 'Mid-day sun is strong — stay hydrated.' },
  { id: 'vaishali', name: 'Vaishali Nagar', temp: 34, aqi: 45, aqiLabel: 'Moderate', uv: 7, wind: '7 km/h SW', hum: '34%', tip: 'Best for evening market strolls after 6 PM.' },
  { id: 'malviya', name: 'Malviya Nagar & Jagatpura', temp: 35, aqi: 48, aqiLabel: 'Moderate', uv: 8, wind: '11 km/h E', hum: '36%', tip: 'World Trade Park area busier during rush hour.' },
  { id: 'amer', name: 'Amer & Kukas', temp: 32, aqi: 38, aqiLabel: 'Good', uv: 6, wind: '12 km/h NW', hum: '30%', tip: 'Cleanest air in the city near the Aravalli foothills.' },
] as const;

export const FORECAST = [
  { day: 'Today', date: 'Sep 24', icon: 'wb_sunny', high: 35, low: 22, precip: '0%', condition: 'Clear & hot' },
  { day: 'Thu', date: 'Sep 25', icon: 'partly_cloudy_day', high: 34, low: 22, precip: '10%', condition: 'Partly cloudy' },
  { day: 'Fri', date: 'Sep 26', icon: 'thunderstorm', high: 32, low: 23, precip: '40%', condition: 'Evening storms' },
  { day: 'Sat', date: 'Sep 27', icon: 'rainy', high: 31, low: 23, precip: '50%', condition: 'Showers likely' },
  { day: 'Sun', date: 'Sep 28', icon: 'filter_drama', high: 33, low: 22, precip: '20%', condition: 'Cloudy spells' },
  { day: 'Mon', date: 'Sep 29', icon: 'wb_sunny', high: 34, low: 21, precip: '0%', condition: 'Clear skies' },
  { day: 'Tue', date: 'Sep 30', icon: 'sunny', high: 35, low: 22, precip: '0%', condition: 'Hot & dry' },
] as const;

export const COMPLAINT_CATEGORIES = [
  { id: 'pothole', name: 'Pothole & Road Hazard', dept: 'JMC Public Works', icon: 'handyman' },
  { id: 'lighting', name: 'Streetlight & Grid', dept: 'JVVNL Power Systems', icon: 'lightbulb' },
  { id: 'dumping', name: 'Sanitation & Waste', dept: 'JMC Swachh Bharat', icon: 'delete_sweep' },
  { id: 'transit', name: 'Transit & Bus Shelter', dept: 'JCTSL Municipal Transit', icon: 'directions_bus' },
  { id: 'parks', name: 'Tree & Park Hazard', dept: 'JMC Parks & Gardens', icon: 'park' },
  { id: 'water', name: 'Water Supply & Drainage', dept: 'Jaipur Jal Board', icon: 'water_drop' },
] as const;

export const TICKETS = [
  { id: '#NN-181-89421', time: '45m ago', title: 'Deep pothole on Tonk Road near Gandhi Nagar Metro', status: 'Crew En Route (ETA 22m)', statusColor: 'secondary', desc: 'Northbound asphalt depression impacting JCTSL Route 9 city bus line.', confirmed: 14, district: 'Ward 62 — Malviya Nagar' },
  { id: '#NN-181-89390', time: '3h ago', title: 'Flickering high-output streetlight at Central Park', status: 'Scheduled (Tomorrow 08:30 AM)', statusColor: 'surface', desc: 'Ballast malfunction causing stroboscopic flicker on the south walking track.', confirmed: 0, district: 'JVVNL Line Unit #04' },
  { id: '#NN-181-89215', time: '2h ago', title: 'Overflowing dustbin on MI Road & Ajmeri Gate', status: 'Resolved & Cleared', statusColor: 'on-tertiary-container', desc: 'Inspection passed by JMC Sanitation District Lead.', confirmed: 0, district: '' },
  { id: '#NN-181-89104', time: '5h ago', title: 'Broken Metro Pink Line shelter glass at Chandpole', status: 'Safety Cordoned', statusColor: 'surface', desc: 'Tempered safety glass shattered during evening peak.', confirmed: 0, district: '' },
] as const;
