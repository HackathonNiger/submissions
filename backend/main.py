import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import translate

load_dotenv()

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "small")

# Default origins for development. For production, you should set this environment variable.
default_origins = [
    "http://localhost:5173",  # Default Vite dev server
    "http://127.0.0.1:5173",
]
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", ",".join(default_origins)).split(",")

app = FastAPI(title="UweTalk AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API endpoints from the router
app.include_router(translate.router)

@app.get("/")
def health():
    """Health check endpoint."""
    return {"status": "running", "whisper_model": WHISPER_MODEL_NAME}