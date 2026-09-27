'''
Aqui va la peticion y recibir datos a partir de una fuenta externa
ya sea base de datos, json...
'''
from fastapi import HTTPException
import httpx #<- para consumir json o datos externos
from app.models.earthquake_spain import EarthquakeSpain
import json

IGN_URL = "https://www.ign.es/web/resources/sismologia/tproximos/terremotos.js"
async def obtenerTerremotosEspaña(min_magnitud: float = 0, limit: int = 100) -> list[EarthquakeSpain]: #Es un parametro de query opcional, que busca por magnitud minima y por numero de terremotos de esa query
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
        return earthquakeSpain[:limit]