from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from pydantic import BaseModel
import httpx
from datetime import datetime, timezone
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#SACADOS DE https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
class Earthquake(BaseModel):
    id: str
    place: str | None = None
    magnitude: float | None = None
    depth_km: float
    latitude: float
    longitude: float
    tsunami: int
    time: datetime #Del import time, se usa el tipo de dato tiempo

#SACADOS DE https://www.ign.es/web/resources/sismologia/tproximos/terremotos.js
class EarthquakeSpain(BaseModel):
    id: str
    fecha: str
    magnitud: float
    latitud: float
    longitud: float
    profundidad: float
    localidad: str


@app.get("/")
def status():
    return {
        "status": "ok"
    }

'''
httpx -> consumir apis en python
'''
USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
@app.get("/earthquakes", response_model=list[Earthquake]) #Significa que la respuesta que devuelve ese endpoint debe tener una estructura correspondiente a una lista de objetos, response_model es un parámetro que acepta el decorador app.get() de FastAPI que utiliza response_model para saber qué estructura debe tener la respuesta de tu endpoint, en base al modelo que se ha creado
async def obtenerTerremotos(min_magnitude: Annotated[float, Query(ge=0, le=10)] = 0, limit: Annotated[int, Query(ge=1, le=500)] = 100): #PARAMETROS DE QUERY
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
            #Sacar propiedades y coordenadas fuera para reconstruir, ya que esta el diccionario dentro de otro
            try:
                event_id = event["id"]
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
                earthquakes.append(Earthquake(id=event_id, place=place, magnitude=mag, depth_km=depth_km, latitude=latitude, longitude=longitude, tsunami=tsunami, time=time))
                #se añaden a la lista con las propiedades de la clase Earthquake
            except(KeyError, TypeError, ValueError):
                continue     
                #se ordena la lista de terremotos por magnitud
        earthquakes.sort(key=lambda eq: eq.magnitude, reverse=True) #lambda eq: significa: "Para cada elemento de la lista, llámalo temporalmente earthquake."
        return earthquakes[:limit]

#IMPORTANTE: ESTA API NO ES UN JSON
IGN_URL = "https://www.ign.es/web/resources/sismologia/tproximos/terremotos.js"
@app.get("/earthquakes/spain", response_model=list[EarthquakeSpain])
async def obtenerTerremotosEspaña(min_magnitud: Annotated[float, Query(ge=0, le=9.9)] = 0, limit: Annotated[int, Query(ge=1, le=999)] = 999): #Es un parametro de query opcional, que busca por magnitud minima y por numero de terremotos de esa query
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            response = await client.get(IGN_URL)
            response.raise_for_status()
        except httpx.HTTPError:
            raise HTTPException(status_code=502, detail="sobrecarga servidor")

        text = response.text

        inicio = text.find("{")

        if inicio == -1:
            raise HTTPException(
                status_code=502,
                detail="No se encontró el objeto de datos del IGN"
            )

        try:
            decoder = json.JSONDecoder()
            data, _ = decoder.raw_decode(text[inicio:])

        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=502,
                detail=f"Error interpretando JSON del IGN: {e}"
            )
        #Los terremotos que se procesen de ese json, se guardaran en una lista
        earthquakeSpain = []

        #RECORRER EL ARRAY Y SACAR PROPIEDADES
        for evento in data.get("features", []):
            
            try:
                props = evento["properties"]
                coordinates = evento["geometry"]["coordinates"]

                event_id = props["evid"]
                
                magnitud = float(props["mag"])
                if magnitud < min_magnitud:
                    continue
                profundidad = float(props["depth"])

                fecha = props["fecha"]

                localidad = props["loc"].strip()

                longitud = float(coordinates[0])
                latitud = float(coordinates[1])

                #dentro del for, por cada propiedad que encuentre en el json, se agrega al objeto earthquaque spain
                earthquakeSpain.append(EarthquakeSpain(id=event_id, magnitud=magnitud, profundidad=profundidad, fecha=fecha, localidad=localidad, longitud=longitud, latitud=latitud))
            except(KeyError, ValueError, TypeError):
                continue
        #creamos una lamda y que ordene esta lista por FECHA
        earthquakeSpain.sort(key=lambda eqSpain: eqSpain.fecha, reverse=True)
        return earthquakeSpain[:limit] #limite de terremotos con esa query
                  
            
            
            

