import asyncio
import random
import uuid
import httpx
from datetime import datetime, timezone
from models import CivicEvent

# Bounding box for Jaipur, Rajasthan
LAT_MIN, LAT_MAX = 26.80, 26.95
LNG_MIN, LNG_MAX = 75.70, 75.85

def get_now():
    return datetime.now(timezone.utc).isoformat()

async def fetch_real_weather(queue: asyncio.Queue):
    """Fetches real-time weather and AQI for Jaipur using OpenMeteo (No API Key Required)"""
    # Jaipur coordinates
    lat, lng = 26.9124, 75.7873
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
    aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lng}&current=us_aqi,pm10,pm2_5"
    
    async with httpx.AsyncClient() as client:
        while True:
            try:
                # Fetch Weather
                w_resp = await client.get(weather_url)
                if w_resp.status_code == 200:
                    w_data = w_resp.json().get("current", {})
                    temp = w_data.get("temperature_2m")
                    humidity = w_data.get("relative_humidity_2m")
                    
                    event = CivicEvent(
                        id=f"WX-{uuid.uuid4().hex[:6]}",
                        timestamp=get_now(),
                        lat=lat + random.uniform(-0.02, 0.02),
                        lng=lng + random.uniform(-0.02, 0.02),
                        category="weather",
                        severity="INFO",
                        description=f"Current Temp: {temp}°C, Humidity: {humidity}%",
                        metadata={"source": "OpenMeteo", "temp": temp, "humidity": humidity}
                    )
                    await queue.put(event)
                
                # Fetch AQI
                a_resp = await client.get(aqi_url)
                if a_resp.status_code == 200:
                    a_data = a_resp.json().get("current", {})
                    aqi = a_data.get("us_aqi")
                    pm25 = a_data.get("pm2_5")
                    
                    severity = "INFO"
                    if aqi and aqi > 100: severity = "WARNING"
                    if aqi and aqi > 150: severity = "CRITICAL"

                    event = CivicEvent(
                        id=f"AQI-{uuid.uuid4().hex[:6]}",
                        timestamp=get_now(),
                        lat=lat + random.uniform(-0.02, 0.02),
                        lng=lng + random.uniform(-0.02, 0.02),
                        category="weather",
                        severity=severity,
                        description=f"Jaipur AQI is {aqi} (PM2.5: {pm25}µg/m³)",
                        metadata={"source": "OpenMeteo_AQI", "aqi": aqi, "pm25": pm25}
                    )
                    await queue.put(event)

            except Exception as e:
                print(f"Error fetching weather: {e}")
            
            # Update every 60 seconds
            await asyncio.sleep(60)

async def simulate_cad_dispatch(queue: asyncio.Queue):
    """Simulates 911 Emergency / 181 Nagar Nigam Dispatch"""
    events = ["Water logging at intersection", "Stray animal disruption", "Traffic accident on JLN Marg", "Public Disturbance", "Illegal dumping reported"]
    while True:
        await asyncio.sleep(random.uniform(5, 12)) 
        event = CivicEvent(
            id=f"CAD-{uuid.uuid4().hex[:6]}",
            timestamp=get_now(),
            lat=random.uniform(LAT_MIN, LAT_MAX),
            lng=random.uniform(LNG_MIN, LNG_MAX),
            category="emergency",
            severity=random.choice(["WARNING", "CRITICAL", "WARNING"]),
            description=random.choice(events),
            metadata={"source": "Jaipur_181_Sim", "units_dispatched": random.randint(1, 3)}
        )
        await queue.put(event)

async def simulate_power_grid(queue: asyncio.Queue):
    """Simulates power grid load anomalies for JVVNL"""
    locations = ["Malviya Nagar", "Mansarovar", "C-Scheme", "Vaishali Nagar", "Sitapura Industrial Area"]
    while True:
        await asyncio.sleep(random.uniform(10, 20))
        event = CivicEvent(
            id=f"GRID-{uuid.uuid4().hex[:6]}",
            timestamp=get_now(),
            lat=random.uniform(LAT_MIN, LAT_MAX),
            lng=random.uniform(LNG_MIN, LNG_MAX),
            category="power",
            severity=random.choice(["INFO", "WARNING"]),
            description=f"JVVNL Transformer load exceeding 85% in {random.choice(locations)}",
            metadata={"source": "JVVNL_Sim", "load_percent": random.randint(85, 99)}
        )
        await queue.put(event)

async def simulate_gtfs_transit(queue: asyncio.Queue):
    """Simulates transit delays (Jaipur Metro / JCTSL)"""
    lines = ["Metro Pink Line", "Metro Orange Line", "JCTSL AC1", "JCTSL Route 9", "JCTSL Route 7"]
    while True:
        await asyncio.sleep(random.uniform(8, 15))
        event = CivicEvent(
            id=f"GTFS-{uuid.uuid4().hex[:6]}",
            timestamp=get_now(),
            lat=random.uniform(LAT_MIN, LAT_MAX),
            lng=random.uniform(LNG_MIN, LNG_MAX),
            category="transit",
            severity=random.choice(["WARNING", "CRITICAL"]),
            description=f"{random.choice(lines)} experiencing delays",
            metadata={"source": "JCTSL_Sim", "delay_minutes": random.randint(5, 45)}
        )
        await queue.put(event)
