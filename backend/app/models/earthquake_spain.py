from pydantic import BaseModel

class EarthquakeSpain(BaseModel):
    id: str
    fecha: str
    magnitud: float
    latitud: float
    longitud: float
    profundidad: float
    localidad: str
