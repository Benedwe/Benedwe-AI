from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.core import firebase

app = FastAPI(title="Benedwe AI Backend")

# Allow CORS from clients you control; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:19006", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    firebase.initialize()

app.include_router(routes.router, prefix="/api")
