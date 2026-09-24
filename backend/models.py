from datetime import datetime
from typing import Optional, Dict, Any, List

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text

from database import Base


# ---------- WebSocket wire model (pydantic) ----------

class CivicEvent(BaseModel):
    id: str
    timestamp: str
    lat: float
    lng: float
    category: str  # "transit", "emergency", "weather", "power", "traffic"
    severity: str  # "INFO", "WARNING", "CRITICAL"
    description: str
    city: str = "jaipur"
    waypoints: Optional[List[List[float]]] = None  # lat/lng pairs (traffic corridors)
    metadata: Dict[str, Any] = {}


# ---------- SQL tables (SQLAlchemy) ----------

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, index=True, nullable=False)
    state = Column(String(80), default="")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class EventRecord(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(40), index=True)
    timestamp = Column(DateTime, index=True, nullable=False)
    city = Column(String(80), index=True, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    category = Column(String(24), index=True)
    severity = Column(String(12))
    description = Column(Text)
    waypoints = Column(Text, nullable=True)       # JSON-encoded lat/lng pairs
    meta_json = Column(Text, nullable=True)       # JSON-encoded metadata


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(40), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserSession(Base):
    __tablename__ = "sessions"

    token = Column(String(64), primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    username = Column(String(40), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    ticket = Column(String(24), unique=True, index=True)
    username = Column(String(40), default="anonymous")
    city = Column(String(80), index=True, nullable=False)
    category = Column(String(40))
    description = Column(Text)
    location = Column(String(160))
    status = Column(String(20), default="SUBMITTED")
    severity = Column(String(12), default="WARNING")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
