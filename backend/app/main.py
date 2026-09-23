from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from pydantic import BaseModel
import httpx
from datetime import datetime, timezone

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #ENLACE PARA COMUNICAR CON REACT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Earthquake(BaseModel):
    id: str
    place: str | None = None
    magnitude: float | None = None
    depth_km: float
    latitude: float
    longitude: float
    tsunami: int
    time: datetime #Del import time, se usa el tipo de dato tiempo

@app.get("/")
def status():
    return {
        "status": "ok"
    }

'''
httpx -> consumir apis en python
'''
USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
@app.get("/earthquakes", response_model=list[Earthquake]) #Significa que la respuesta que devuelve ese endpoint debe tener una estructura correspondiente a una lista de objetos, response_model es un parámetro que acepta el decorador app.get() de FastAPI que utiliza response_model para saber qué estructura debe tener la respuesta de tu endpoint, en base al modelo que se ha creado
async def obtenerTerremotos(min_magnitude: Annotated[float, Query(ge=0, le=10)] = 0, limit: Annotated[int, Query(ge=1, le=500)] = 100):
    async with httpx.AsyncClient(timeout=10) as client:
        #Intento de conexión con la api
        try:
            response = await client.get(USGS_URL)
            response.raise_for_status()
        except httpx.HTTPError:
            raise HTTPException(status_code=502, detail="sobrecarga servidor")
        data = response.json()

        #preparas la lista vacia para devolverla mas adelante con el modelo creado
        earthquakes = []
        for event in data["features"]: #data es todo el json, y features es una lista que esta fuera de las demas listas, no es como por ejemplo properties
            event_id = event["id"]
            #Sacar propiedades y coordenadas fuera para reconstruir, ya que esta el diccionario dentro de otro
            props = event["properties"]
            coords = event["geometry"]["coordinates"]
            mag = props["mag"]
            if mag is None or mag < min_magnitude:
                continue
            time_ms = props["time"]
            time = datetime.fromtimestamp(time_ms / 1000, tz=timezone.utc)
            depth_km = coords[2]
            latitude = coords[1]
            longitude = coords[0]
            tsunami = props["tsunami"]
            place = props["place"]
            #se añaden a la lista con las propiedades de la clase Earthquake
            earthquakes.append(Earthquake(id=event_id, place=place, magnitude=mag, depth_km=depth_km, latitude=latitude, longitude=longitude, tsunami=tsunami, time=time))
            #se ordena la lista de terremotos por magnitud
        earthquakes.sort(key=lambda eq: eq.magnitude, reverse=True) #lambda eq: significa: "Para cada elemento de la lista, llámalo temporalmente earthquake."
        return earthquakes[:limit]


            
            

