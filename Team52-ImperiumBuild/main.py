from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.concurrency import run_in_threadpool
import ee, requests
from gee_tools import (
    get_satellite_image_url,
    get_climatology_data,
    get_soil_data,
    get_ndvi_mean
)

from auth import initialize_ee
from ai_model.ai_model import chat_with_bot
import pickle
import joblib
from datetime import datetime
import numpy as np

# --- Schemas ---
class PolygonRequest(BaseModel):
    polygon: list[list[float]] = Field(..., description="List of [lat, lon] polygon vertices.")

class MessageInput(BaseModel):
    message: str
    info: dict

class ModelFeatures(BaseModel):
    state: str
    rainfall_total_mm: float
    avg_temp_c: float
    ndvi_mean: float
    soil_ph: float
    soil_org_carbon_pct: float
    fertilizer_rate_kg_per_ha: float
    pesticide_rate_l_per_ha: float
    farm_size_ha: float
    irrigated_area_ha: float

app = FastAPI(title="Agri-Geospatial Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    initialize_ee()
    print("🌍 Google Earth Engine initialized successfully.")
except Exception as e:
    print(f"EE Initialization failed: {e}")

def get_state_from_coords(lat, lon):
    """Reverse-geocode coordinates to get the state name."""
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=5&addressdetails=1"
        r = requests.get(url, timeout=10).json()
        address = r.get("address", {})
        state = address.get("state") or address.get("region") or "Unknown"
        return state
    except Exception as e:
        print(f"Reverse geocoding failed: {e}")
        return "Unknown"
    
# --- Fallback APIs ---
def fetch_backup_weather_data(lat, lon):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_mean,precipitation_sum&timezone=Africa%2FLagos"
        r = requests.get(url, timeout=10).json()
        return {
            "avg_temp_c": r["daily"]["temperature_2m_mean"][0],
            "rainfall_total_mm": r["daily"]["precipitation_sum"][0]
        }
    except:
        return {"avg_temp_c": 27.0, "rainfall_total_mm": 100.0}

def fetch_backup_soil_data(lat, lon):
    try:
        url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}&property=phh2o&depth=15-30cm"
        r = requests.get(url, timeout=10).json()
        ph = r["properties"]["layers"][0]["depths"][0]["values"]["mean"]
        return {"soil_pH": ph}
    except:
        return {"soil_pH": 6.5}

# Simple NDVI fallback
def fetch_backup_ndvi(lat, lon):
    return {"ndvi_mean": 0.45}  # typical vegetative NDVI for fallback

# Simple soil carbon fallback
def fetch_backup_soil_carbon(lat, lon):
    return {"soil_org_carbon_pct": 1.2}  # default avg SOC


# --- Main Endpoint ---
@app.post("/calculate")
async def calculate_geospatial_data(request: PolygonRequest):
    polygon_coords = request.polygon
    if len(polygon_coords) < 3:
        raise HTTPException(status_code=400, detail="Polygon must have at least 3 coordinates.")

    ee_polygon = ee.Geometry.Polygon([[lon, lat] for lat, lon in polygon_coords])
    lat, lon = polygon_coords[0]

    try:
        # Run GEE operations in thread
        data = await run_in_threadpool(lambda: process_geospatial_data(ee_polygon, polygon_coords, lat, lon))

        area_sq_m = ee_polygon.area().getInfo()

        return {
            "status": "success",
            "area_sq_m": area_sq_m,
            "polygon_bounds": polygon_coords,
            **data  
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Geospatial processing failed: {e}")


# --- Core GEE Processing Logic ---
def process_geospatial_data(ee_polygon, polygon_coords, lat, lon):
    """Fetch all GEE data + guaranteed fallbacks."""
    try:
        # GEE data
        image_url = get_satellite_image_url(polygon_coords)
        climatology = get_climatology_data(polygon_coords, lat, lon)
        soil_data = get_soil_data(polygon_coords, lat, lon)
        ndvi = get_ndvi_mean(polygon_coords)

        # DEBUG: Print the raw GEE data to see what was actually returned
        print(f"DEBUG: Climatology: {climatology}")
        print(f"DEBUG: Soil Data: {soil_data}")
        print(f"DEBUG: NDVI: {ndvi}")
        

        # Extract values
        soil_pH = soil_data.get("soil_pH", None)
        soil_carbon = soil_data.get("soil_org_carbon_pct", None)
        avg_temp = climatology.get("avg_temp_c", None)
        rainfall = climatology.get("rainfall_total_mm", None)

        # Fallback handling for missing/NA values
        if not climatology or avg_temp is None or rainfall is None:
            climatology = fetch_backup_weather_data(lat, lon)
            avg_temp = climatology["avg_temp_c"]
            rainfall = climatology["rainfall_total_mm"]

        if soil_pH is None or soil_carbon is None:
            soil_backup = fetch_backup_soil_data(lat, lon)
            soil_pH = soil_backup.get("soil_pH", 6.5)
            soil_carbon = soil_backup.get("soil_org_carbon_pct", 1.2)

        if not ndvi or ndvi == "NA":
            ndvi = fetch_backup_ndvi(lat, lon)["ndvi_mean"]

        if not image_url or "Error" in image_url:
            image_url = "https://via.placeholder.com/400x300.png?text=No+Satellite+Image"

        return {
            "image_tile_url": image_url,
            "rainfall_total_mm": rainfall,
            "avg_temp_c": avg_temp,
            "soil_pH": soil_pH,
            "ndvi_mean": ndvi,
            "soil_org_carbon_pct": soil_carbon,
    
        }

    except Exception as e:
        raise Exception(f"GEE processing failed internally: {e}")



# --- Chatbot Endpoint ---
@app.post("/chat")
async def chatting_with_bot(payload: MessageInput):
    return chat_with_bot(payload)

with open("model/north_crop_yield_model.pkl", 'rb') as f:
    model = pickle.load(f)
@app.post("/predict")
async def predict_optimal_crop(payload: ModelFeatures):
    encoders = joblib.load("model/encoders.pkl")

    # Example usage
    encoded_state = encoders['state'].transform([payload.state])
    encoded_state_scalar = encoded_state[0]
    try:
        features = [[
            encoded_state_scalar,
            datetime.now().year,
            payload.rainfall_total_mm,
            payload.avg_temp_c,
            payload.ndvi_mean,
            payload.soil_ph,
            payload.soil_org_carbon_pct,
            payload.fertilizer_rate_kg_per_ha,
            payload.pesticide_rate_l_per_ha,
            payload.farm_size_ha,
            payload.irrigated_area_ha
        ]]

        prediction = model.predict(features)[0]
        print(prediction)
        label_map = {
            'Cassava': np.int64(0),
            'Cotton': np.int64(1),
            'Guna melon': np.int64(2),
            'Maize': np.int64(3),
            'Okra': np.int64(4),
            'Rice': np.int64(5),
            'Soybeans': np.int64(6),
            'Sweet potato': np.int64(7),
            'Wheat': np.int64(8),
            'Yam': np.int64(9)
        }
        reverse_map = {v: k for k, v in label_map.items()}
        crop_name = reverse_map[prediction]


        return {"status": "success", "predicted_crop": str(crop_name)}

    except Exception as e:
        import traceback
        traceback.print_exc()  # print the full stack trace
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

