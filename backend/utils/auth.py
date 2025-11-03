import os
from typing import Optional
from fastapi import HTTPException

SECRET_API_KEY = os.getenv("SECRET_API_KEY")

def require_key(key: Optional[str]):
    """Raises HTTPException if the provided API key is invalid."""
    if SECRET_API_KEY and key != SECRET_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")