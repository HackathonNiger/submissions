import ee
from dotenv import load_dotenv
import os

def initialize_ee():
    load_dotenv()

    KEY_FILE = os.getenv('EE_SERVICE_ACCOUNT_KEY_FILE')
    PROJECT_ID = os.getenv('EE_PROJECT_ID')


    if not KEY_FILE or not PROJECT_ID:
        raise ValueError("Missing EE_SERVICE_ACCOUNT_KEY_FILE or EE_PROJECT_ID in .env file.")

    # 2. Create credentials object
    try:
        # ServiceAccountCredentials takes the path to the JSON key file
        credentials = ee.ServiceAccountCredentials(
            os.path.basename(KEY_FILE), 
            KEY_FILE
        )
    except Exception as e:
        print(f"Error creating ServiceAccountCredentials: {e}")
        # Handle error or exit

    # 3. Initialize the Earth Engine API
    try:
        ee.Initialize(
            credentials=credentials,
            project=PROJECT_ID
        )
        print("Google Earth Engine initialized successfully using Service Account.")
    except Exception as e:
        print(f"Error initializing Earth Engine: {e}")
        # Handle error or exit


    # Example API call to confirm initialization
    try:
        image = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_044034_20180914')
        print(f"Example Image ID: {image.id().getInfo()}")
    except Exception as e:
        print(f"Error during test API call: {e}")
