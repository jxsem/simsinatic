from fastapi import APIRouter, Query
from typing import Annotated
from app.models.earthquake_spain import EarthquakeSpain #<- SE IMPORTA EL MODELO (LOS DATOS)
from app.services.earthquake_spain_service import obtenerTerremotosEspaña #<- SE IMPORTA EL SERVICIO (PETICION DE DATOS)

router = APIRouter()

#EN LUGAR DE APP.GET, SERIA ROUTER@GET
@router.get("/earthquakes/spain", response_model=list[EarthquakeSpain])
async def get_earthquakespain(
    min_magnitud: Annotated[float, Query(ge=0, le=10)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100
):
    return await obtenerTerremotosEspaña(min_magnitud, limit)