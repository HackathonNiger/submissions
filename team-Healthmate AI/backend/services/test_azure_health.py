import os
import requests
import json
from dotenv import load_dotenv

def test_azure_health():
    # Load environment variables
    load_dotenv()
    
    # Get Azure Health credentials
    AZURE_HEALTH_KEY = os.getenv("AZURE_HEALTH_KEY")
    AZURE_HEALTH_ENDPOINT = os.getenv("AZURE_HEALTH_ENDPOINT")
    
    # Remove trailing slash from endpoint if present
    if AZURE_HEALTH_ENDPOINT and AZURE_HEALTH_ENDPOINT.endswith('/'):
        AZURE_HEALTH_ENDPOINT = AZURE_HEALTH_ENDPOINT[:-1]
    
    print(f"Testing Azure Health Analytics")
    print(f"Endpoint: {AZURE_HEALTH_ENDPOINT}")
    print(f"API Key: {AZURE_HEALTH_KEY[:5]}...{AZURE_HEALTH_KEY[-5:] if AZURE_HEALTH_KEY else None}")
    
    # Test text
    test_text = "I have a headache and fever for two days, and my stomach hurts."
    
    # Try different API versions and endpoints
    api_versions = [
        {"version": "v3.1", "path": "/text/analytics/v3.1/entities/health"},
        {"version": "v3.2", "path": "/text/analytics/v3.2/entities/health"},
        {"version": "2023-04-01", "path": "/language/analyze-text/jobs"},
        {"version": "2022-05-01", "path": "/text/analytics/v3.1/entities/health"}
    ]
    
    for api_info in api_versions:
        version = api_info["version"]
        path = api_info["path"]
        
        print(f"\n\nTesting API version: {version}")
        print(f"Using path: {path}")
        
        # Construct URL
        url = f"{AZURE_HEALTH_ENDPOINT}{path}"
        
        # Create headers
        headers = {
            "Ocp-Apim-Subscription-Key": AZURE_HEALTH_KEY,
            "Content-Type": "application/json"
        }
        
        # Create request body based on API version
        if "jobs" in path:  # Newer API version uses async jobs
            body = {
                "displayName": "Health Entity Recognition",
                "analysisInput": {
                    "documents": [
                        {
                            "id": "1",
                            "language": "en",
                            "text": test_text
                        }
                    ]
                },
                "tasks": [
                    {
                        "kind": "HealthcareEntityRecognition",
                        "parameters": {
                            "modelVersion": "latest"
                        }
                    }
                ]
            }
        else:  # Older API version
            body = {
                "documents": [
                    {
                        "language": "en",
                        "id": "1",
                        "text": test_text
                    }
                ]
            }
        
        # Make the request
        try:
            print(f"Making request to: {url}")
            response = requests.post(url, headers=headers, json=body)
            
            # Print status code
            print(f"Status code: {response.status_code}")
            
            # Check if request was successful
            if response.status_code == 200 or response.status_code == 202:
                print("✅ SUCCESS!")
                print(f"Response: {json.dumps(response.json(), indent=2)}")
                print("\nThis API version and path work correctly. Update your code to use this configuration.")
                
                # Print specific instructions
                if "jobs" in path:
                    print("\nNOTE: This API uses an asynchronous job pattern. You'll need to:")
                    print("1. Submit the job (as done in this test)")
                    print("2. Poll the operation-location URL from the response headers to get results")
                    print("3. Update your health_analysis_service.py to use this pattern")
                else:
                    print("\nUpdate your analyze_with_azure_health function in health_analysis_service.py:")
                    print(f"url = f\"{{AZURE_HEALTH_ENDPOINT}}{path}\"")
                
                return
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
        
        except Exception as e:
            print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_azure_health()