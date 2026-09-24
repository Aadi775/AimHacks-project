import asyncio
import random
import uuid
from datetime import datetime, timezone
from models import CivicEvent

# Bounding box for a hypothetical city area (e.g., NYC)
LAT_MIN, LAT_MAX = 40.70, 40.80
LNG_MIN, LNG_MAX = -74.05, -73.90

def get_now():
    return datetime.now(timezone.utc).isoformat()

async def simulate_cad_dispatch(queue: asyncio.Queue):
    """Simulates 911 Emergency Computer Aided Dispatch"""
    events = ["Vehicle Collision", "Structure Fire", "Medical Emergency", "Public Disturbance", "Flooded Intersection"]
    while True:
        await asyncio.sleep(random.uniform(5, 12)) 
        event = CivicEvent(
            id=f"CAD-{uuid.uuid4().hex[:6]}",
            timestamp=get_now(),
            lat=random.uniform(LAT_MIN, LAT_MAX),
            lng=random.uniform(LNG_MIN, LNG_MAX),
            category="emergency",
            severity=random.choice(["WARNING", "CRITICAL", "CRITICAL"]),
            description=random.choice(events),
            metadata={"source": "CAD_Sim", "units_dispatched": random.randint(1, 4)}
        )
        await queue.put(event)

async def simulate_power_grid(queue: asyncio.Queue):
    """Simulates power grid load anomalies"""
    while True:
        await asyncio.sleep(random.uniform(10, 20))
        event = CivicEvent(
            id=f"GRID-{uuid.uuid4().hex[:6]}",
            timestamp=get_now(),
            lat=random.uniform(LAT_MIN, LAT_MAX),
            lng=random.uniform(LNG_MIN, LNG_MAX),
            category="power",
            severity=random.choice(["INFO", "WARNING"]),
            description="Transformer load exceeding 85% capacity",
            metadata={"source": "Substation_Sim", "load_percent": random.randint(85, 99)}
        )
        await queue.put(event)

async def simulate_gtfs_transit(queue: asyncio.Queue):
    """Simulates transit delays (train/bus)"""
    lines = ["Red Line", "Blue Line", "Green Line", "Bus Route 44"]
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
            metadata={"source": "GTFS_Sim", "delay_minutes": random.randint(5, 45)}
        )
        await queue.put(event)
