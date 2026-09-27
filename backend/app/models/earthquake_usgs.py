from pydantic import BaseModel
from datetime import datetime

class Earthquake(BaseModel):
    id: str
    place: str | None = None
    magnitude: float | None = None
    depth_km: float
    latitude: float
    longitude: float
    tsunami: int
    time: datetime