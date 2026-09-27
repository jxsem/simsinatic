from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import earthquakes, earthquakes_spain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def status():
    return {"status": "ok"}

app.include_router(earthquakes.router)
app.include_router(earthquakes_spain.router)
                  
            
            
            

