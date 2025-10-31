import requests
import json

BASE_URL = "http://localhost:5000"

def test_languages_endpoint():
    """Test the languages endpoint"""
    response = requests.get(f"{BASE_URL}/api/health/languages")
    print(f"Languages Endpoint Status: {response.status_code}")
    if response.ok:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("-" * 50)

def test_health_analysis(message):
    """Test the health analysis endpoint with a message"""
    data = {"message": message}
    response = requests.post(
        f"{BASE_URL}/api/health/analyze", 
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Health Analysis Endpoint Status: {response.status_code}")
    if response.ok:
        result = response.json()
        print(f"Detected Language: {result.get('detected_language')}")
        print(f"Symptoms: {result.get('health_analysis', {}).get('symptoms', [])}")
        print(f"Response: {result.get('response')[:100]}...")
    else:
        print(f"Error: {response.text}")
    print("-" * 50)

if __name__ == "__main__":
    print("Testing HealthMate AI API...")
    test_languages_endpoint()
    
    test_messages = [
        "I have a headache and fever for two days",
        "Mo ni irora ori fun ọjọ meji"  # Yoruba
    ]
    
    for message in test_messages:
        test_health_analysis(message)