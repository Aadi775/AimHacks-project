from pydantic import BaseModel
from typing import Optional, Dict, Any

class CivicEvent(BaseModel):
    id: str
    timestamp: str
    lat: float
    lng: float
    category: str # "transit", "emergency", "weather", "power"
    severity: str # "INFO", "WARNING", "CRITICAL"
    description: str
    metadata: Dict[str, Any] = {}
