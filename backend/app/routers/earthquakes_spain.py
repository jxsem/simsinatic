from fastapi import APIRouter, Query
from typing import Annotated
from app.models.earthquake_usgs import Earthquake
from app.services.earthquake_usgs_service import obtenerTerremotos

router = APIRouter()

@router.get("/earthquakes", response_model=list[Earthquake])
async def get_earthquakes(
    min_magnitude: Annotated[float, Query(ge=0, le=10)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100
):
    return await obtenerTerremotos(min_magnitude, limit)