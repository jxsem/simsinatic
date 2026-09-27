'''
Aqui va la peticion y recibir datos a partir de una fuenta externa
ya sea base de datos, json...
'''
from fastapi import HTTPException
import httpx
from datetime import datetime, timezone
from app.models.earthquake_usgs import Earthquake

USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

async def obtenerTerremotos(min_magnitude: float = 0, limit: int = 100) -> list[Earthquake]:
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            response = await client.get(USGS_URL)
            response.raise_for_status()
        except httpx.HTTPError:
            raise HTTPException(status_code=502, detail="sobrecarga del servidor")
        data = await response.json()

        earthquakes = []
        for event in data["features"]:
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
            except (KeyError, TypeError, ValueError):
                continue

        earthquakes.sort(key=lambda eq: eq.magnitude, reverse=True)
        return earthquakes[:limit]