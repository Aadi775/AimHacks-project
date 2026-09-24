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
  onTerritiaryContainer: '#009669',
  background: '#f8f9ff',
} as const;

export const NAV_ITEMS = [
  { path: 'home', label: 'Home' },
  { path: 'overview', label: 'Overview & Pulse' },
  { path: 'weather', label: 'Weather & Environment' },
  { path: 'transit', label: 'Transit & Incidents' },
  { path: 'complaints', label: '311 Complaints' },
] as const;

export const CITIES = ['Jaipur', 'New York', 'Seattle', 'Austin'];

export const METRICS = {
  civicIndex: { value: 88, label: 'Civic Index', status: 'Optimal', trend: '+3.2 pts' },
  aqi: { value: 24, label: 'Air Quality', status: 'Pristine', unit: 'PM2.5' },
  transitCadence: { value: 94, label: 'Transit On-Time', status: 'Nominal', unit: '%' },
  gridPower: { value: 100, label: 'JCTSLcipal Power', status: 'Zero Carbon', unit: '%' },
} as const;

export const DISTRICTS = [
  { id: 'presidio', name: 'C-Scheme & Marina', quadrant: 'northeast', temp: 63, aqi: 18, aqiLabel: 'Pristine', icon: 'water' },
  { id: 'mission', name: 'Mission & Noe Valley', quadrant: 'central', temp: 73, aqi: 28, aqiLabel: 'Good', icon: 'wb_sunny' },
  { id: 'financial', name: 'Financial & Embarcadero', quadrant: 'northeast', temp: 67, aqi: 32, aqiLabel: 'Good', icon: 'public' },
  { id: 'sunset', name: 'Sunset & Ocean Beach', quadrant: 'west', temp: 61, aqi: 14, aqiLabel: 'Pristine', icon: 'water' },
] as const;

export const TRANSIT_LINES = [
  { id: 'bart-yellow', name: 'Jaipur Metro Pink Line', route: 'Antioch ↔ SFO Airport / Millbrae', status: 'On Time', headway: 'Every 10 mins', mode: 'rail' },
  { id: 'muni-n', name: 'JCTSL Metro N-Judah', route: 'Ocean Beach ↔ 4th & King Caltrain', status: 'On Time', headway: 'Every 8 mins', mode: 'rail' },
  { id: 'bart-red', name: 'Jaipur Metro Red Line', route: 'Richmond ↔ Millbrae / SFO', status: 'Minor Delays (+6m)', headway: 'Every 15 mins', mode: 'rail' },
  { id: 'muni-38r', name: 'JCTSL 38R Geary Rapid', route: '48th Ave ↔ Salesforce Transit Center', status: 'On Time', headway: 'Every 6 mins', mode: 'bus' },
  { id: 'ferry', name: 'Jaipur Bay Ferry', route: 'Alameda & Oakland ↔ SF Ferry Building', status: 'On Time', headway: 'Every 30 mins', mode: 'ferry' },
  { id: 'caltrain', name: 'CalTrain Peninsula Line', route: 'SF 4th & King ↔ San Jose Diridon', status: 'On Time', headway: 'Every 20 mins', mode: 'rail' },
] as const;

export const HEADLINES = [
  { category: 'Infrastructure', time: '18m ago', title: 'Water Main Maintenance on Geary Blvd', desc: 'Crews completing scheduled valve upgrades between 4th & 6th Ave.', org: 'Inner Richmond • Geary Corridor', status: 'Active Crew' },
  { category: 'Sustainability', time: '1h ago', title: 'C-Scheme Community Solar Battery Online', desc: 'New 4.2 MWh municipal energy storage unit energized today, powering 1,200 homes.', org: 'C-Scheme District Microgrid', status: '+4.2 MWh Clean' },
  { category: 'Transit', time: '2h ago', title: 'Jaipur Metro Weekend Express Schedule Active', desc: 'Extra train frequency on Yellow and Blue lines for Waterfront Arts Festival.', org: 'Jaipur Region Rapid Transit', status: '10-Min Headways' },
] as const;

export const DISPATCH_ITEMS = [
  { org: 'Dept of Transportation', orgIcon: 'directions_car', verified: true, time: '5m ago', title: 'Minor traffic collision cleared at 19th Ave & Lincoln Way', desc: 'All lanes reopened, residual slow traffic easing.', likes: 14, comments: 3, verifiedBy: 'Officer #412' },
  { org: 'Resident Report', orgIcon: 'construction', verified: false, time: '24m ago', ticket: '#311-8942', title: 'Pothole reported on 24th St near Castro', desc: 'Department of Public Works dispatched maintenance crew.', likes: 8, comments: 1, status: 'DPW Unit 14 En Route' },
  { org: 'SF Rec & Parks', orgIcon: 'park', verified: true, time: '1h ago', title: 'Fallen eucalyptus branch safely removed from Golden Gate Park', desc: 'Trail fully cleared and open for runners.', likes: 32, comments: 0 },
  { org: 'Public Utilities Commission', orgIcon: 'lightbulb', verified: true, time: '2h ago', title: 'Routine streetlamp LED upgrade on Valencia St completed', desc: 'Lighting lux levels increased by 18% with reduced draw.', likes: 19, comments: 0 },
] as const;

export const NEIGHBORHOOD_METRICS = [
  { id: 'marina', name: 'Marina & C-Scheme', temp: 64, aqi: 18, aqiLabel: 'Pristine', uv: 4, wind: '12 mph W', hum: '68%', tip: 'Bring light layers for coastal breezes.' },
  { id: 'mission', name: 'Mission & Noe Valley', temp: 73, aqi: 28, aqiLabel: 'Good', uv: 6, wind: '4 mph SW', hum: '48%', tip: 'Perfect for patio dining & parks.' },
  { id: 'financial', name: 'Financial & Embarcadero', temp: 67, aqi: 32, aqiLabel: 'Good', uv: 5, wind: '7 mph ENE', hum: '58%', tip: 'Pleasant bay breeze throughout mid-day.' },
  { id: 'sunset', name: 'Sunset & Richmond', temp: 61, aqi: 14, aqiLabel: 'Pristine', uv: 3, wind: '15 mph W', hum: '76%', tip: 'Mild fog crest; windbreaker recommended.' },
] as const;

export const FORECAST = [
  { day: 'Today', date: 'Jun 14', icon: 'wb_sunny', high: 71, low: 54, precip: '0%', condition: 'Clear & Sun' },
  { day: 'Sat', date: 'Jun 15', icon: 'partly_cloudy_day', high: 68, low: 53, precip: '5%', condition: 'Partly cloudy' },
  { day: 'Sun', date: 'Jun 16', icon: 'cloud', high: 65, low: 52, precip: '10%', condition: 'Morning fog' },
  { day: 'Mon', date: 'Jun 17', icon: 'sunny', high: 67, low: 55, precip: '0%', condition: 'Clear skies' },
  { day: 'Tue', date: 'Jun 18', icon: 'wb_sunny', high: 72, low: 56, precip: '0%', condition: 'Warm breeze' },
  { day: 'Wed', date: 'Jun 19', icon: 'filter_drama', high: 70, low: 54, precip: '0%', condition: 'Cirrus clouds' },
  { day: 'Thu', date: 'Jun 20', icon: 'grain', high: 66, low: 53, precip: '15%', condition: 'Mild coastal mist' },
] as const;

export const COMPLAINT_CATEGORIES = [
  { id: 'pothole', name: 'Pothole & Hazard', dept: 'Public Works (DPW)', icon: 'handyman' },
  { id: 'lighting', name: 'Streetlight & Grid', dept: 'JAIUC Power Systems', icon: 'lightbulb' },
  { id: 'dumping', name: 'Sanitation & Waste', dept: 'Recology Fleet Clean', icon: 'delete_sweep' },
  { id: 'transit', name: 'Transit & Shelter', dept: 'SFMTA JCTSLcipal Rail', icon: 'directions_bus' },
  { id: 'parks', name: 'Tree & Park Hazard', dept: 'SF Rec & Parks Dept', icon: 'park' },
  { id: 'code', name: 'Acoustic & Code', dept: 'Civic Neighborhoods', icon: 'volume_up' },
] as const;

export const TICKETS = [
  { id: '#SF-311-89421', time: '45m ago', title: 'Dangerous deep pothole on 24th & Valencia', status: 'Crew En Route (ETA 22m)', statusColor: 'secondary', desc: 'Northbound asphalt depression impacting municipal JCTSL 48 trolley coach line.', confirmed: 14, district: 'Supervisor District 9' },
  { id: '#SF-311-89390', time: '3h ago', title: 'Flickering high-output streetlight at Duboce Park', status: 'Scheduled (Tomorrow 08:30 AM)', statusColor: 'surface', desc: 'Ballast malfunction causing stroboscopic flicker on south dog run pathway.', confirmed: 0, district: 'JAIUC Line Unit #04' },
  { id: '#SF-311-89215', time: '2h ago', title: 'Overflowing recycling bin on Geary & 8th', status: 'Resolved & Cleared', statusColor: 'on-tertiary-container', desc: 'Inspection passed by Recology District Lead.', confirmed: 0, district: '' },
  { id: '#SF-311-89104', time: '5h ago', title: 'Broken M-Ocean View transit shelter glass', status: 'Safety Cordoned', statusColor: 'surface', desc: 'Tempered safety glass shattered.', confirmed: 0, district: '' },
] as const;
