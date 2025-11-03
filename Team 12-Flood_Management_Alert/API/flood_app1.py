from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
import firebase_admin
from firebase_admin import credentials, db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Flood Prediction API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("flood_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("label_encoder.pkl", "rb") as encoder_file:
    label_encoder = pickle.load(encoder_file)


firebase_key = os.getenv("FIREBASE_KEY")

if firebase_key:
    cred = credentials.Certificate(json.loads(firebase_key))
    firebase_admin.initialize_app(cred)
else:
    raise ValueError("FIREBASE_KEY environment variable not found.")


class FloodData(BaseModel):
    water_level: float
    humidity: float
    temperature: float


@app.get("/")
def home():
    return {"message": "Flood Prediction API is live and connected to Firebase!"}



@app.get("/RealTime_FloodPrediction")
def fetch_and_predict():
    """
    Fetch the most recent data entry from Firebase and predict flood status.
    """
    try:
        # Get all data from the Firebase root
        ref = db.reference("/")
        all_data = ref.get()

        if not all_data:
            return {"error": "No data found in Firebase."}

        # Sort by timestamp-like key and get the most recent entry
        last_key = sorted(all_data.keys())[-1]
        latest_data = all_data[last_key]

        # Extract fields
        water_level = float(latest_data.get("water_level", 0))
        humidity = float(latest_data.get("humidity", 0))
        temperature = float(latest_data.get("temperature", 0))

        # Prepare features for model prediction
        features = pd.DataFrame([{
            "water_level": water_level,
            "humidity": humidity
        }])

        features["water_level"] = 4.5 - features["water_level"]/100

        # Predict flood status
        prediction = model.predict(features)
        status = label_encoder.inverse_transform(prediction)[0]

        return status
    

    except Exception as e:
        return {"error": str(e)}
