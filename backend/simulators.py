import asyncio
import random
import uuid
import httpx
import json
from datetime import datetime, timezone, timedelta

from models import CivicEvent

# ---------- City seed data (India first) ----------

CITIES_SEED = [
    {"name": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873, "is_default": True},
    {"name": "Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090, "is_default": False},
    {"name": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "is_default": False},
    {"name": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "is_default": False},
    {"name": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867, "is_default": False},
    {"name": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714, "is_default": False},
    {"name": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707, "is_default": False},
    {"name": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "is_default": False},
    {"name": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "is_default": False},
    {"name": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462, "is_default": False},
]

# ---------- Real traffic corridors (approximate street geometry) ----------

TRAFFIC_CORRIDORS = {
    "jaipur": [
        {"id": "jln-marg", "name": "JLN Marg", "waypoints": [[26.8985, 75.8085], [26.8935, 75.8135], [26.8885, 75.8200]]},
        {"id": "tonk-road", "name": "Tonk Road", "waypoints": [[26.8955, 75.8055], [26.8830, 75.8060], [26.8690, 75.8065], [26.8560, 75.8075]]},
        {"id": "mi-road", "name": "MI Road", "waypoints": [[26.9180, 75.8090], [26.9125, 75.8105], [26.9080, 75.8120]]},
        {"id": "sikar-road", "name": "Sikar Road", "waypoints": [[26.9300, 75.8040], [26.9220, 75.8020], [26.9155, 75.7995]]},
        {"id": "ajmer-road", "name": "Ajmer Road", "waypoints": [[26.9100, 75.7620], [26.9050, 75.7720], [26.9010, 75.7820]]},
        {"id": "vaishali-marg", "name": "Vaishali Nagar Marg", "waypoints": [[26.9150, 75.7380], [26.9100, 75.7450], [26.9055, 75.7520]]},
    ],
    "delhi": [
        {"id": "ring-road", "name": "Ring Road", "waypoints": [[28.5680, 77.2300], [28.5750, 77.2500], [28.5820, 77.2700]]},
        {"id": "nh48-gurgaon", "name": "NH-48 Corridor", "waypoints": [[28.4600, 77.0300], [28.4700, 77.0600], [28.4800, 77.0900]]},
        {"id": "vikas-marg", "name": "Vikas Marg", "waypoints": [[28.6300, 77.2800], [28.6350, 77.2950], [28.6400, 77.3100]]},
    ],
    "mumbai": [
        {"id": "weh", "name": "Western Express Highway", "waypoints": [[19.0800, 72.8500], [19.1000, 72.8550], [19.1200, 72.8600]]},
        {"id": "marine-drive", "name": "Marine Drive", "waypoints": [[18.9300, 72.8200], [18.9400, 72.8220], [18.9500, 72.8240]]},
        {"id": "sv-road", "name": "SV Road", "waypoints": [[19.0500, 72.8400], [19.0700, 72.8420], [19.0900, 72.8440]]},
    ],
    "bengaluru": [
        {"id": "orr", "name": "Outer Ring Road", "waypoints": [[12.9300, 77.6200], [12.9500, 77.6600], [12.9700, 77.7000]]},
        {"id": "mg-road", "name": "MG Road", "waypoints": [[12.9750, 77.6000], [12.9760, 77.6060], [12.9770, 77.6120]]},
        {"id": "hosur-road", "name": "Hosur Road", "waypoints": [[12.9000, 77.6100], [12.8800, 77.6200], [12.8600, 77.6300]]},
    ],
    "hyderabad": [
        {"id": "pvnr", "name": "PVNR Elevated Road", "waypoints": [[17.3600, 78.4500], [17.3800, 78.4600], [17.4000, 78.4700]]},
        {"id": "necklace-rd", "name": "Necklace Road", "waypoints": [[17.4100, 78.4600], [17.4200, 78.4700], [17.4300, 78.4800]]},
        {"id": "hitec-city", "name": "HITEC City Main Rd", "waypoints": [[17.4400, 78.3800], [17.4500, 78.3900], [17.4600, 78.4000]]},
    ],
    "ahmedabad": [
        {"id": "sg-highway", "name": "SG Highway", "waypoints": [[23.0100, 72.5100], [23.0300, 72.5300], [23.0500, 72.5500]]},
        {"id": "ashram-rd", "name": "Ashram Road", "waypoints": [[23.0100, 72.5600], [23.0150, 72.5700], [23.0200, 72.5800]]},
    ],
    "chennai": [
        {"id": "omr", "name": "OMR IT Corridor", "waypoints": [[12.9400, 80.2300], [12.9200, 80.2400], [12.9000, 80.2500]]},
        {"id": "anna-salai", "name": "Anna Salai", "waypoints": [[13.0500, 80.2500], [13.0400, 80.2550], [13.0300, 80.2600]]},
    ],
    "kolkata": [
        {"id": "em-bypass", "name": "EM Bypass", "waypoints": [[22.5200, 88.4000], [22.5400, 88.4100], [22.5600, 88.4200]]},
        {"id": "park-st", "name": "Park Street", "waypoints": [[22.5500, 88.3500], [22.5520, 88.3550], [22.5540, 88.3600]]},
    ],
    "pune": [
        {"id": "katraj-bypass", "name": "Katraj-Dehu Bypass", "waypoints": [[18.4800, 73.8300], [18.5000, 73.8400], [18.5200, 73.8500]]},
        {"id": "fc-road", "name": "FC Road", "waypoints": [[18.5200, 73.8400], [18.5250, 73.8450], [18.5300, 73.8500]]},
    ],
    "lucknow": [
        {"id": "hazratganj", "name": "Hazratganj", "waypoints": [[26.8467, 80.9400], [26.8480, 80.9450], [26.8500, 80.9500]]},
        {"id": "gomti-nagar", "name": "Gomti Nagar Extension", "waypoints": [[26.8500, 80.9800], [26.8600, 80.9900], [26.8700, 81.0000]]},
    ],
}

# ---------- Transit lines per city ----------

TRANSIT_LINES = {
    "jaipur": {
        "name": "Jaipur Metro Pink Line",
        "waypoints": [[26.8530, 75.7760], [26.8610, 75.7820], [26.8700, 75.7880], [26.8800, 75.7960], [26.8920, 75.8030], [26.9060, 75.8090], [26.9216, 75.8130]],
        "alternates": ["Metro Orange Line", "JCTSL AC1", "JCTSL Route 9", "JCTSL Route 7"],
    },
    "delhi": {"name": "Delhi Metro Yellow Line", "alternates": ["Delhi Metro Blue Line", "DTC Route 543", "Delhi Metro Airport Express"]},
    "mumbai": {"name": "Mumbai Local Western Line", "alternates": ["Mumbai Harbour Line", "BEST Route A-75", "Mumbai Local Central Line"]},
    "bengaluru": {"name": "Namma Metro Purple Line", "alternates": ["Namma Metro Green Line", "BMTC Route 500D", "BMTC Vayu Vajra"]},
    "hyderabad": {"name": "Hyderabad Metro Red Line", "alternates": ["Hyderabad Metro Blue Line", "TSRTC Route 10K", "TSRTC Route 216"]},
    "ahmedabad": {"name": "Ahmedabad Metro Blue Line", "alternates": ["AMC BRTS Route 1", "AMC BRTS Route 2", "Ahmedabad Metro Red Line"]},
    "chennai": {"name": "Chennai Metro Blue Line", "alternates": ["Chennai Metro Green Line", "MTC Route 21G", "Chennai Suburban Line"]},
    "kolkata": {"name": "Kolkata Metro Blue Line", "alternates": ["Kolkata Metro Green Line", "Route S-12", "Kolkata East-West Metro"]},
    "pune": {"name": "Pune Metro Aqua Line", "alternates": ["Pune Metro Purple Line", "PMPML Route 4", "PMPML Route 14"]},
    "lucknow": {"name": "Lucknow Metro Red Line", "alternates": ["Lucknow Metro Blue Line", "LMTS Route 5", "LMTS Route 11"]},
}

# ---------- Localities per city (for power grid / dispatch events) ----------

LOCALITIES = {
    "jaipur": ["Malviya Nagar", "Mansarovar", "C-Scheme", "Vaishali Nagar", "Sitapura Industrial Area", "Bapu Nagar", "Jagatpura"],
    "delhi": ["Dwarka", "Rohini", "Saket", "Karol Bagh", "Lajpat Nagar", "Connaught Place"],
    "mumbai": ["Andheri", "Bandra", "Dadar", "Colaba", "Powai", "Borivali"],
    "bengaluru": ["Koramangala", "Whitefield", "Indiranagar", "Jayanagar", "HSR Layout", "Electronic City"],
    "hyderabad": ["Gachibowli", "Banjara Hills", "Kukatpally", "Madhapur", "Begumpet", "Secunderabad"],
    "ahmedabad": ["Satellite", "Bopal", "Maninagar", "Prahlad Nagar", "Navrangpura"],
    "chennai": ["T. Nagar", "Adyar", "Velachery", "Anna Nagar", "Mylapore"],
    "kolkata": ["Salt Lake", "Howrah", "Behala", "Dumdum", "Alipore"],
    "pune": ["Kothrud", "Hadapsar", "Baner", "Viman Nagar", "Kharadi"],
    "lucknow": ["Gomti Nagar", "Aliganj", "Hazratganj", "Indira Nagar", "Chinhat"],
}

WMO_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
    80: "Light showers", 81: "Showers", 82: "Violent showers", 95: "Thunderstorm",
    96: "Thunderstorm w/ hail", 99: "Severe thunderstorm",
}

def wmo_text(code):
    return WMO_CODES.get(code, "Unknown")


async def _resolve(cities_source):
    """Accepts a static city list OR an async callable that returns one (dynamic)."""
    if callable(cities_source):
        try:
            return await cities_source()
        except Exception as e:
            print(f"City reload failed: {e}")
            return []
    return cities_source


TRANSIT_NETWORKS = {
    "jaipur": [
        {"name": "Jaipur Metro Pink Line", "mode": "metro", "operator": "JMRC",
         "route": "Mansarovar \u2194 Chandpole", "stations": 9, "first": "06:15", "last": "21:30", "headway": 10},
        {"name": "Jaipur Metro Orange Line", "mode": "metro", "operator": "JMRC",
         "route": "Sitapura Industrial Area \u2194 Ambabari", "stations": 8, "first": "06:30", "last": "21:00", "headway": 12},
        {"name": "JCTSL AC-1 Volvo", "mode": "bus", "operator": "JCTSL",
         "route": "Sanganeri Gate \u2194 Vaishali Nagar", "stations": 22, "first": "06:00", "last": "22:00", "headway": 15},
        {"name": "JCTSL Route 9", "mode": "bus", "operator": "JCTSL",
         "route": "Sindhi Camp \u2194 Jagatpura", "stations": 18, "first": "05:45", "last": "22:15", "headway": 8},
        {"name": "JCTSL Route 7", "mode": "bus", "operator": "JCTSL",
         "route": "Amer Fort \u2194 Tonk Phatak", "stations": 16, "first": "06:00", "last": "21:45", "headway": 10},
    ],
    "delhi": [
        {"name": "Yellow Line", "mode": "metro", "operator": "DMRC",
         "route": "Samaypur Badli \u2194 HUDA City Centre", "stations": 37, "first": "05:30", "last": "23:30", "headway": 5},
        {"name": "Blue Line", "mode": "metro", "operator": "DMRC",
         "route": "Dwarka Sec-21 \u2194 Noida/Vaishali", "stations": 50, "first": "05:30", "last": "23:30", "headway": 6},
        {"name": "Red Line", "mode": "metro", "operator": "DMRC",
         "route": "Rithala \u2194 Shaheed Sthal", "stations": 29, "first": "05:30", "last": "23:15", "headway": 7},
        {"name": "Airport Express", "mode": "metro", "operator": "DMRC",
         "route": "New Delhi \u2194 Dwarka Sec-21", "stations": 6, "first": "04:45", "last": "23:30", "headway": 15},
        {"name": "DTC Route 543", "mode": "bus", "operator": "DTC",
         "route": "Anand Vihar \u2194 Safdarjung", "stations": 24, "first": "05:30", "last": "22:30", "headway": 12},
    ],
    "mumbai": [
        {"name": "Western Line (Slow)", "mode": "rail", "operator": "WR",
         "route": "Churchgate \u2194 Virar", "stations": 28, "first": "04:15", "last": "01:00", "headway": 4},
        {"name": "Central Line (Slow)", "mode": "rail", "operator": "CR",
         "route": "CSMT \u2194 Kalyan", "stations": 24, "first": "04:22", "last": "01:15", "headway": 5},
        {"name": "Harbour Line", "mode": "rail", "operator": "CR",
         "route": "CSMT \u2194 Panvel", "stations": 22, "first": "04:52", "last": "00:48", "headway": 8},
        {"name": "Metro Line 1", "mode": "metro", "operator": "MMRDA",
         "route": "Versova \u2194 Ghatkopar", "stations": 12, "first": "05:30", "last": "23:30", "headway": 4},
        {"name": "BEST A-75 Express", "mode": "bus", "operator": "BEST",
         "route": "Colaba \u2194 Borivali", "stations": 20, "first": "06:00", "last": "22:00", "headway": 15},
    ],
    "bengaluru": [
        {"name": "Namma Metro Purple Line", "mode": "metro", "operator": "BMRCL",
         "route": "Whitefield (Kadugodi) \u2194 Challaghatta", "stations": 37, "first": "05:00", "last": "23:00", "headway": 6},
        {"name": "Namma Metro Green Line", "mode": "metro", "operator": "BMRCL",
         "route": "Silk Institute \u2194 Nagasandra", "stations": 30, "first": "05:00", "last": "23:00", "headway": 7},
        {"name": "Namma Metro Yellow Line", "mode": "metro", "operator": "BMRCL",
         "route": "R V Road \u2194 Bommasandra", "stations": 16, "first": "06:00", "last": "22:30", "headway": 10},
        {"name": "BMTC 500D Express", "mode": "bus", "operator": "BMTC",
         "route": "Hebbal \u2194 Silk Board", "stations": 19, "first": "05:45", "last": "22:45", "headway": 12},
    ],
    "hyderabad": [
        {"name": "Red Line", "mode": "metro", "operator": "L&T MRHL",
         "route": "LB Nagar \u2194 Miyapur", "stations": 27, "first": "06:00", "last": "22:30", "headway": 6},
        {"name": "Blue Line", "mode": "metro", "operator": "L&T MRHL",
         "route": "Nagole \u2194 Raidurg", "stations": 23, "first": "06:00", "last": "22:30", "headway": 7},
        {"name": "TSRTC 10K", "mode": "bus", "operator": "TSRTC",
         "route": "Secunderabad \u2194 Mehdipatnam", "stations": 21, "first": "05:30", "last": "22:30", "headway": 10},
    ],
    "ahmedabad": [
        {"name": "Blue Line", "mode": "metro", "operator": "GMRC",
         "route": "Thaltej Gam \u2194 Vastral Gam", "stations": 19, "first": "06:00", "last": "22:00", "headway": 8},
        {"name": "Red Line", "mode": "metro", "operator": "GMRC",
         "route": "Motera Stadium \u2194 Gyaspur", "stations": 7, "first": "06:15", "last": "22:00", "headway": 12},
        {"name": "BRTS Janmarg Route 1", "mode": "bus", "operator": "AMC",
         "route": "Maninagar \u2194 RTO Circle", "stations": 14, "first": "06:00", "last": "22:00", "headway": 10},
    ],
    "chennai": [
        {"name": "Blue Line", "mode": "metro", "operator": "CMRL",
         "route": "Wimco Nagar \u2194 Airport", "stations": 21, "first": "05:00", "last": "22:30", "headway": 8},
        {"name": "Green Line", "mode": "metro", "operator": "CMRL",
         "route": "Central \u2194 St Thomas Mount", "stations": 18, "first": "05:00", "last": "22:30", "headway": 9},
        {"name": "Beach \u2014 Chengalpattu", "mode": "rail", "operator": "SR",
         "route": "Chennai Beach \u2194 Chengalpattu", "stations": 26, "first": "04:40", "last": "23:00", "headway": 15},
        {"name": "MTC 21G", "mode": "bus", "operator": "MTC",
         "route": "Broadway \u2194 Guindy", "stations": 23, "first": "05:15", "last": "22:15", "headway": 10},
    ],
    "kolkata": [
        {"name": "Blue Line (N-S)", "mode": "metro", "operator": "KMRC/Metro Railway",
         "route": "Dakshineswar \u2194 Kavi Subhash", "stations": 26, "first": "06:50", "last": "21:45", "headway": 7},
        {"name": "Green Line (E-W)", "mode": "metro", "operator": "KMRC",
         "route": "Howrah Maidan \u2194 Salt Lake Sector V", "stations": 12, "first": "07:00", "last": "21:30", "headway": 10},
        {"name": "Purple Line", "mode": "metro", "operator": "Metro Railway",
         "route": "Joka \u2194 Maidan", "stations": 6, "first": "08:00", "last": "20:30", "headway": 20},
        {"name": "Route S-12", "mode": "bus", "operator": "SBSTC/CTC",
         "route": "Howrah \u2194 Esplanade", "stations": 15, "first": "05:45", "last": "22:00", "headway": 12},
    ],
    "pune": [
        {"name": "Aqua Line", "mode": "metro", "operator": "MahaMetro",
         "route": "Vanaz \u2194 Ramwadi", "stations": 16, "first": "06:00", "last": "22:00", "headway": 10},
        {"name": "Purple Line", "mode": "metro", "operator": "MahaMetro",
         "route": "PCMC Bhavan \u2194 Swargate", "stations": 17, "first": "06:00", "last": "22:00", "headway": 10},
        {"name": "PMPML Route 4", "mode": "bus", "operator": "PMPML",
         "route": "Katraj \u2194 Pune Station", "stations": 20, "first": "05:30", "last": "22:30", "headway": 9},
    ],
    "lucknow": [
        {"name": "Red Line", "mode": "metro", "operator": "LMRC",
         "route": "CCS Airport \u2194 Munshipulia", "stations": 21, "first": "06:00", "last": "22:00", "headway": 8},
        {"name": "LCTSL Route 5", "mode": "bus", "operator": "LCTSL",
         "route": "Gomti Nagar \u2194 Charbagh", "stations": 17, "first": "05:45", "last": "22:15", "headway": 11},
    ],
}


CONGESTION_LEVELS = ["FREE_FLOW", "MODERATE", "HEAVY"]
TRAFFIC_INCIDENTS = [
    "waterlogging near culvert",
    "stray cattle on carriageway",
    "signal outage at junction",
    "minor accident cleared, slow traffic",
    "VIP movement, temporary hold",
    "metro construction diversion",
    "heavy rain reducing visibility",
]

SPEED_BY_LEVEL = {"FREE_FLOW": (35, 55), "MODERATE": (15, 30), "HEAVY": (4, 12)}
SEVERITY_BY_LEVEL = {"FREE_FLOW": "INFO", "MODERATE": "WARNING", "HEAVY": "CRITICAL"}


# Shared live state: real weather + active traffic congestion (drives vehicle delays)
latest_weather: dict = {}   # city -> {"temp": f, "condition": str}
latest_traffic: dict = {}   # city -> [{"corridor": str, "waypoints": [[lat,lng],...]}]


def get_now():
    return datetime.now(timezone.utc).isoformat()


def pick_city(cities):
    """Weighted pick: the default city (Jaipur) receives ~50% of all events."""
    defaults = [c for c in cities if c.get("is_default")]
    if defaults and random.random() < 0.5:
        return random.choice(defaults)
    return random.choice(cities)


def _jitter(cities, spread=0.03):
    """Pick a weighted city and a jittered point near its center."""
    city = pick_city(cities)
    return city, city["lat"] + random.uniform(-spread, spread), city["lng"] + random.uniform(-spread, spread)


async def fetch_real_weather(queue: asyncio.Queue, cities_source):
    """Fetches real-time weather and AQI for all active cities via OpenMeteo (no API key).
    Reloads the city list each cycle so newly searched cities start streaming immediately."""
    async with httpx.AsyncClient() as client:
        while True:
            cities = await _resolve(cities_source)
            for city in cities:
                lat, lng = city["lat"], city["lng"]
                cname = city["name"].lower()
                weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day"
                aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lng}&current=us_aqi,pm10,pm2_5"
                try:
                    w_resp = await client.get(weather_url)
                    if w_resp.status_code == 200:
                        w_data = w_resp.json().get("current", {})
                        temp = w_data.get("temperature_2m")
                        humidity = w_data.get("relative_humidity_2m")
                        cond = wmo_text(w_data.get("weather_code"))
                        latest_weather[cname] = {"temp": temp, "condition": cond}
                        await queue.put(CivicEvent(
                            id=f"WX-{uuid.uuid4().hex[:6]}",
                            timestamp=get_now(),
                            lat=lat, lng=lng,
                            category="weather", severity="INFO",
                            description=f"{city['name']}: {temp}°C, {cond}, humidity {humidity}%",
                            city=cname,
                            metadata={"source": "OpenMeteo", "temp": temp, "humidity": humidity, "condition": cond},
                        ))

                    a_resp = await client.get(aqi_url)
                    if a_resp.status_code == 200:
                        a_data = a_resp.json().get("current", {})
                        aqi = a_data.get("us_aqi")
                        pm25 = a_data.get("pm2_5")
                        severity = "INFO"
                        if aqi and aqi > 100: severity = "WARNING"
                        if aqi and aqi > 150: severity = "CRITICAL"
                        await queue.put(CivicEvent(
                            id=f"AQI-{uuid.uuid4().hex[:6]}",
                            timestamp=get_now(),
                            lat=lat, lng=lng,
                            category="weather", severity=severity,
                            description=f"{city['name']} AQI is {aqi} (PM2.5: {pm25}µg/m³)",
                            city=cname,
                            metadata={"source": "OpenMeteo_AQI", "aqi": aqi, "pm25": pm25},
                        ))
                except Exception as e:
                    print(f"Error fetching weather for {city['name']}: {e}")
                # Stagger requests between cities to stay well under rate limits
                await asyncio.sleep(7)
            # Full refresh cycle per city ~90-100s
            await asyncio.sleep(35)





async def simulate_traffic(queue: asyncio.Queue, cities_source):
    """Emits real-corridor congestion telemetry with waypoints for map overlays."""
    while True:
        await asyncio.sleep(random.uniform(8, 16))
        city = pick_city(await _resolve(cities_source))
        cname = city["name"].lower()
        corridors = TRAFFIC_CORRIDORS.get(cname)
        if not corridors:
            # Fallback: synthetic corridor around city center
            corridors = [{"id": f"central-{cname}", "name": f"{city['name']} Central Corridor",
                          "waypoints": [[city["lat"], city["lng"]],
                                        [city["lat"] + 0.02, city["lng"] + 0.01],
                                        [city["lat"] + 0.04, city["lng"] + 0.02]]}]
        corridor = random.choice(corridors)
        level = random.choice(CONGESTION_LEVELS)
        lo, hi = SPEED_BY_LEVEL[level]
        speed = random.randint(lo, hi)
        desc = f"{corridor['name']}: {level.replace('_', ' ').title()} traffic, avg speed {speed} km/h"
        if level != "FREE_FLOW" and random.random() < 0.4:
            desc += f" — {random.choice(TRAFFIC_INCIDENTS)}"
        if level != "FREE_FLOW":
            latest_traffic.setdefault(cname, [])
            lanes = latest_traffic[cname]
            entry = {"corridor": corridor["name"], "waypoints": corridor["waypoints"]}
            if entry not in lanes:
                lanes.append(entry)
                if len(lanes) > 8:
                    lanes.pop(0)
        await queue.put(CivicEvent(
            id=f"TRF-{uuid.uuid4().hex[:6]}",
            timestamp=get_now(),
            lat=corridor["waypoints"][0][0],
            lng=corridor["waypoints"][0][1],
            category="traffic",
            severity=SEVERITY_BY_LEVEL[level],
            description=desc,
            city=cname,
            waypoints=corridor["waypoints"],
            metadata={"source": "Traffic_Sim", "corridor": corridor["name"], "speed_kmh": speed, "congestion": level},
        ))


# ---------- Grounded transit vehicle simulation ----------
# Vehicles move along routes built from REAL locality coordinates.
# Delays are CAUSAL: live corridor congestion (from the traffic simulator)
# and the city's real weather (from OpenMeteo) slow vehicles down.

import hashlib as _hashlib


def _route_for(city_name: str, line_name: str, city: dict, hoods: list) -> list:
    """Deterministic route through real localities for a given line."""
    seed = int(_hashlib.md5(f"{city_name}:{line_name}".encode()).hexdigest()[:8], 16)
    picks = [hoods[(seed + i * 3) % len(hoods)] for i in range(4)]
    route = [[p[1], p[2]] for p in picks]
    # start/end anchored to city center transit hub
    return [[city["lat"], city["lng"]]] + route + [[city["lat"], city["lng"]]]


NEIGHBORHOOD_SOURCES = {
    "jaipur": [("Malviya Nagar", 26.8560, 75.8160), ("Mansarovar", 26.8530, 75.7710), ("C-Scheme", 26.9060, 75.8020), ("Vaishali Nagar", 26.9120, 75.7400), ("Bapu Nagar", 26.8950, 75.8060), ("Jagatpura", 26.8200, 75.8250), ("Sindhi Camp", 26.9187, 75.8060), ("Chandpole", 26.9216, 75.8130)],
    "delhi": [("Dwarka", 28.5920, 77.0460), ("Rohini", 28.7300, 77.1100), ("Saket", 28.5240, 77.2070), ("Karol Bagh", 28.6510, 77.1900), ("Lajpat Nagar", 28.5670, 77.2430), ("Connaught Place", 28.6310, 77.2190)],
    "mumbai": [("Andheri", 19.1190, 72.8460), ("Bandra", 19.0760, 72.8330), ("Dadar", 19.0180, 72.8430), ("Colaba", 18.9100, 72.8150), ("Powai", 19.1180, 72.9060), ("Borivali", 19.2300, 72.8560)],
    "bengaluru": [("Koramangala", 12.9350, 77.6240), ("Whitefield", 12.9700, 77.7370), ("Indiranagar", 12.9780, 77.6410), ("Jayanagar", 12.9250, 77.5940), ("HSR Layout", 12.9120, 77.6430), ("Electronic City", 12.8450, 77.6600)],
    "hyderabad": [("Gachibowli", 17.4400, 78.3270), ("Banjara Hills", 17.4120, 78.4360), ("Kukatpally", 17.4850, 78.4140), ("Madhapur", 17.4480, 78.3920), ("Begumpet", 17.4440, 78.4660), ("Secunderabad", 17.4390, 78.4980)],
    "ahmedabad": [("Satellite", 23.0280, 72.5100), ("Bopal", 23.0300, 72.4700), ("Maninagar", 22.9940, 72.6010), ("Prahlad Nagar", 23.0280, 72.5400), ("Navrangpura", 23.0350, 72.5620)],
    "chennai": [("T. Nagar", 13.0420, 80.2340), ("Adyar", 13.0010, 80.2570), ("Velachery", 12.9790, 80.2210), ("Anna Nagar", 13.0850, 80.2110), ("Mylapore", 13.0330, 80.2690)],
    "kolkata": [("Salt Lake", 22.5800, 88.4100), ("Howrah", 22.5900, 88.3100), ("Behala", 22.4990, 88.3120), ("Dumdum", 22.6420, 88.4220), ("Alipore", 22.5300, 88.3320)],
    "pune": [("Kothrud", 18.5070, 73.8080), ("Hadapsar", 18.5000, 73.9260), ("Baner", 18.5590, 73.7870), ("Viman Nagar", 18.5670, 73.9140), ("Kharadi", 18.5510, 73.9420)],
    "lucknow": [("Gomti Nagar", 26.8500, 81.0000), ("Aliganj", 26.8850, 80.9450), ("Hazratganj", 26.8500, 80.9400), ("Indira Nagar", 26.8800, 80.9800), ("Chinhat", 26.8900, 81.0300)],
}


def _bus_delay(cname: str, lat: float, lng: float):
    """Compute delay + cause from live traffic proximity and real weather."""
    delay = 0.0
    cause = "On schedule"

    # Causal factor 1: heavy congestion on a nearby corridor
    for lane in latest_traffic.get(cname, []):
        for wlat, wlng in lane["waypoints"]:
            if abs(lat - wlat) <= 0.025 and abs(lng - wlng) <= 0.025:
                delay += random.uniform(3, 7)
                cause = f"Heavy traffic near {lane['corridor']}"
                break
        if delay:
            break

    # Causal factor 2: real weather conditions
    wx = latest_weather.get(cname)
    if wx:
        cond = (wx.get("condition") or "").lower()
        if any(k in cond for k in ("thunderstorm", "rain", "drizzle", "showers")):
            delay += random.uniform(2, 6)
            cause = f"Weather: {wx['condition']}" + (f" + traffic" if "traffic" in cause.lower() else "")
        elif "fog" in cond:
            delay += random.uniform(1, 3)
            cause = f"Weather: low visibility (fog)"

    # Light background variance
    delay = max(0.0, delay + random.uniform(-0.5, 1.5))
    return round(delay, 1), cause


async def simulate_vehicles(queue: asyncio.Queue, cities_source):
    """Simulates buses & metro trains following real routes with causal delays."""
    vehicles: dict = {}  # key -> {city, line, mode, operator, route, t, dirn}

    async with httpx.AsyncClient() as client:
        while True:
            cities = await _resolve(cities_source)
            for city in cities:
                cname = city["name"].lower()
                lines = TRANSIT_NETWORKS.get(cname, [])
                if not lines:
                    continue
                # Up to 2 running vehicles per city on the primary lines
                for mode in lines[:2]:
                    key = f"{cname}:{mode['name']}"
                    if key not in vehicles:
                        hoods = [
                            (n[0], n[1], n[2])
                            for n in NEIGHBORHOOD_SOURCES.get(cname, [(city["name"], city["lat"], city["lng"])])
                        ]
                        vehicles[key] = {
                            "city": city, "line": mode, "route": _route_for(cname, mode["name"], city, hoods),
                            "t": random.random(), "dirn": 1,
                        }
                    v = vehicles[key]

                # Advance along the route
                seg_len = 1.0 / (len(v["route"]) - 1)
                v["t"] += seg_len * random.uniform(0.25, 0.6) * v["dirn"] * (0.55 if v["line"]["mode"] == "metro" else 0.75)
                if v["t"] >= 1:
                    v["t"] = 1
                    v["dirn"] = -1
                elif v["t"] <= 0:
                    v["t"] = 0
                    v["dirn"] = 1

                # Interpolate position on the polyline
                pos_f = v["t"] * (len(v["route"]) - 1)
                idx = min(int(pos_f), len(v["route"]) - 2)
                frac = pos_f - idx
                lat = v["route"][idx][0] + (v["route"][idx + 1][0] - v["route"][idx][0]) * frac
                lng = v["route"][idx][1] + (v["route"][idx + 1][1] - v["route"][idx][1]) * frac

                delay, cause = _bus_delay(cname, lat, lng)
                severity = "WARNING" if delay >= 4 else "INFO"

                await queue.put(CivicEvent(
                    id=f"VEH-{uuid.uuid4().hex[:6]}",
                    timestamp=get_now(),
                    lat=lat, lng=lng,
                    category="transit",
                    severity=severity,
                    description=f"{v['line']['name']} — {cause if delay < 1 else f'+{delay}m delay: {cause}'}",
                    city=cname,
                    waypoints=[[lat, lng]],
                    metadata={
                        "source": "Transit_Sim",
                        "vehicle": True,
                        "line": v["line"]["name"],
                        "operator": v["line"]["operator"],
                        "mode": v["line"]["mode"],
                        "delay_minutes": delay,
                        "cause": cause,
                        "progress": round(v["t"] * 100),
                        "route_path": v["route"],
                    },
                ))
                await asyncio.sleep(random.uniform(2, 4))
            await asyncio.sleep(6)


# ---------- 24h synthetic history backfill (hackathon demo depth) ----------

BASE_TEMPS = {"jaipur": 27, "delhi": 28, "mumbai": 29, "bengaluru": 24, "hyderabad": 27,
              "ahmedabad": 28, "chennai": 30, "kolkata": 29, "pune": 25, "lucknow": 27}
BASE_AQI = {"jaipur": 85, "delhi": 150, "mumbai": 90, "bengaluru": 70, "hyderabad": 80,
            "ahmedabad": 95, "chennai": 75, "kolkata": 105, "pune": 78, "lucknow": 100}

import math as _math


def _rush_weight(hour: int) -> float:
    """Diurnal congestion multiplier: morning + evening peaks, calm nights."""
    return 1.0 + 2.2 * _math.exp(-((hour - 9) ** 2) / 5.0) + 2.8 * _math.exp(-((hour - 19) ** 2) / 5.0)


def _level_for(w: float) -> str:
    if w >= 3.2: return "HEAVY"
    if w >= 1.8: return "MODERATE"
    return "FREE_FLOW"


async def backfill_history(cities):
    """Seeds ~24h of plausible per-city events directly into the SQL DB so
    heatmaps, hourly buckets, correlations and forecasts have depth."""
    from database import SessionLocal
    from models import EventRecord
    from sqlalchemy import select as _sel, func as _fn

    async with SessionLocal() as session:
        existing = (
            await session.execute(_sel(EventRecord.event_id).where(EventRecord.event_id.like("WBX-%")).limit(1))
        ).scalar()
        if existing:
            print("[Backfill] historical markers exist — skipping")
            return
        now = datetime.now(timezone.utc)
        inserted = 0
        for city in cities:
            cname = city["name"].lower()
            corridors = TRAFFIC_CORRIDORS.get(cname) or [
                {"name": f"{city['name']} Central Corridor",
                 "waypoints": [[city["lat"], city["lng"]], [city["lat"] + 0.02, city["lng"] + 0.01]]}
            ]
            base_t = BASE_TEMPS.get(cname, 27)
            base_a = BASE_AQI.get(cname, 85)
            for h in range(24):
                ts = now - timedelta(hours=(24 - h))
                ts = ts.replace(minute=0, second=0, microsecond=0)
                hour_local = (ts.hour + 5) % 24  # IST-ish local hour

                # Weather every 3h with diurnal curve + commute AQI bumps
                if h % 3 == 0:
                    temp = round(base_t + 5 * _math.sin((hour_local - 14) / 24 * 2 * _math.pi), 1)
                    aqi = int(base_a + 22 * (_rush_weight(hour_local) - 1) + random.uniform(-8, 8))
                    aqi = max(28, min(220, aqi))
                    sev = "INFO" if aqi <= 100 else "WARNING" if aqi <= 150 else "CRITICAL"
                    session.add(EventRecord(
                        event_id=f"WBX-{cname}-{h}", timestamp=ts, city=cname,
                        lat=city["lat"], lng=city["lng"], category="weather", severity=sev,
                        description=f"{city['name']}: {temp}°C baseline, AQI {aqi}",
                        meta_json=json.dumps({"source": "OpenMeteo", "temp": temp, "aqi": aqi, "condition": "Backfill"}),
                    ))
                    inserted += 1

                # Traffic: 2 corridors/hour, congestion follows rush curve
                for corridor in corridors[:2]:
                    w = _rush_weight(hour_local) * random.uniform(0.75, 1.25)
                    level = _level_for(w)
                    speed = {"FREE_FLOW": (38, 55), "MODERATE": (16, 32), "HEAVY": (5, 14)}[level]
                    sp = random.randint(*speed)
                    sev = {"FREE_FLOW": "INFO", "MODERATE": "WARNING", "HEAVY": "CRITICAL"}[level]
                    wps = corridor["waypoints"]
                    session.add(EventRecord(
                        event_id=f"WTR-{cname}-{h}-{corridor['name'][:4]}", timestamp=ts + timedelta(minutes=7), city=cname,
                        lat=wps[0][0], lng=wps[0][1], category="traffic", severity=sev,
                        description=f"{corridor['name']}: {level.replace('_', ' ').title()} traffic, avg speed {sp} km/h",
                        waypoints=json.dumps(wps),
                        meta_json=json.dumps({"source": "Traffic_Sim", "corridor": corridor["name"], "congestion": level, "speed_kmh": sp}),
                    ))
                    inserted += 1

                # Transit delay hourly (worse in rush hours)
                delay = round(max(0, (w - 1) * 6 + random.uniform(-1, 4)), 1)
                session.add(EventRecord(
                    event_id=f"WGT-{cname}-{h}", timestamp=ts + timedelta(minutes=13), city=cname,
                    lat=city["lat"], lng=city["lng"], category="transit",
                    severity="WARNING" if delay >= 6 else "INFO",
                    description=f"Primary line running with {delay} min delay",
                    meta_json=json.dumps({"source": "Transit_Sim", "delay_minutes": delay}),
                ))
                inserted += 1

                # Grid load hourly (evening peak strongest)
                load = min(97, int(58 + (_rush_weight(hour_local) - 1) * 16 + random.uniform(-3, 3)))
                session.add(EventRecord(
                    event_id=f"WGR-{cname}-{h}", timestamp=ts + timedelta(minutes=21), city=cname,
                    lat=city["lat"], lng=city["lng"], category="power",
                    severity="WARNING" if load >= 88 else "INFO",
                    description=f"Discom feeder load {load}% of installed capacity",
                    meta_json=json.dumps({"source": "Grid_Sim", "load_percent": load}),
                ))
                inserted += 1

        await session.commit()
        print(f"[Backfill] Inserted {inserted} historical events across {len(cities)} cities")


# ---------- Synthetic grid state (diurnal, city-scaled) ----------

GRID_PROFILES = {
    "jaipur": {"installed_mw": 4200, "discom": "JVVNL / RVPN"},
    "delhi": {"installed_mw": 12500, "discom": "BRPL / BYPL / NDPL"},
    "mumbai": {"installed_mw": 9800, "discom": "Adani Electricity / BEST"},
    "bengaluru": {"installed_mw": 6200, "discom": "BESCOM"},
    "hyderabad": {"installed_mw": 5800, "discom": "TSSPDCL"},
    "ahmedabad": {"installed_mw": 4300, "discom": "Torrent / MGVCL"},
    "chennai": {"installed_mw": 5400, "discom": "TANGEDCO"},
    "kolkata": {"installed_mw": 4900, "discom": "CESC / WBSETCL"},
    "pune": {"installed_mw": 3800, "discom": "MSEDCL"},
    "lucknow": {"installed_mw": 3100, "discom": "UPPCL / NESCL"},
}


def grid_state(city_name: str, lat: float) -> dict:
    """Deterministic-ish synthetic grid telemetry with realistic diurnal shape."""
    import time as _time

    cname = city_name.lower()
    prof = GRID_PROFILES.get(cname, {"installed_mw": 3500, "discom": "State Discom"})
    now_local = (_time.time() / 3600 + 5.5) % 24  # IST-ish fractional hour
    curve = []
    for h in range(24):
        w = _rush_weight(h)
        curve.append(int(min(97, 56 + (w - 1) * 15)))
    cur = curve[int(now_local) % 24]
    demand_mw = int(prof["installed_mw"] * cur / 100)
    # Solar peaks midday; wind steadier; hydro base; thermal rest
    solar = max(0, int(46 * _math.exp(-((now_local - 13) ** 2) / 8)))
    wind = int(8 + 6 * _math.sin(now_local / 3.8))
    hydro = 14
    thermal = max(0, 100 - solar - wind - hydro)
    return {
        "discom": prof["discom"],
        "installed_mw": prof["installed_mw"],
        "load_percent": cur,
        "demand_mw": demand_mw,
        "frequency_hz": round(49.92 + 0.06 * _math.sin(now_local * 1.3), 2),
        "mix": {"solar": solar, "wind": wind, "hydro": hydro, "thermal": thermal},
        "load_curve": curve,
        "peak_hour": curve.index(max(curve)),
        "base_load": 100 - max(curve),
    }
