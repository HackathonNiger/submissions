import os
import requests
import uuid
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get Azure Translator credentials from environment variables
AZURE_TRANSLATOR_KEY = os.getenv("AZURE_TRANSLATOR_KEY")
AZURE_TRANSLATOR_ENDPOINT = os.getenv("AZURE_TRANSLATOR_ENDPOINT", "https://api.cognitive.microsofttranslator.com")
AZURE_TRANSLATOR_REGION = os.getenv("AZURE_TRANSLATOR_REGION", "eastus")

if not AZURE_TRANSLATOR_KEY:
    raise ValueError("Azure Translator API key is not set in the .env file.")

# Function to detect language
def detect_language(text):
    url = f"{AZURE_TRANSLATOR_ENDPOINT}/detect"
    
    # Set up the parameters and headers
    params = {
        'api-version': '3.0'
    }
    
    headers = {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }
    
    # Prepare the body
    body = [{
        'text': text
    }]
    
    # Make the request
    try:
        response = requests.post(url, params=params, headers=headers, json=body)
        response.raise_for_status()
        detected_language = response.json()[0]["language"]
        return detected_language
    except Exception as e:
        print(f"Error detecting language: {e}")
        print(f"Response content: {response.content if 'response' in locals() else 'No response'}")
        return "en"  # Default to English if detection fails

# Function to translate to English
def translate_to_english(text, source_language):
    url = f"{AZURE_TRANSLATOR_ENDPOINT}/translate"
    
    # Set up the parameters and headers
    params = {
        'api-version': '3.0',
        'from': source_language,
        'to': ['en']
    }
    
    headers = {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }
    
    # Prepare the body
    body = [{
        'text': text
    }]
    
    # Make the request
    try:
        response = requests.post(url, params=params, headers=headers, json=body)
        response.raise_for_status()
        translated_text = response.json()[0]["translations"][0]["text"]
        return translated_text
    except Exception as e:
        print(f"Error translating text: {e}")
        print(f"Response content: {response.content if 'response' in locals() else 'No response'}")
        return text  # Return original text if translation fails

# Function to translate back to original language
def translate_to_language(text, target_language):
    if target_language == "en":
        return text
        
    url = f"{AZURE_TRANSLATOR_ENDPOINT}/translate"
    
    # Set up the parameters and headers
    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': [target_language]
    }
    
    headers = {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }
    
    # Prepare the body
    body = [{
        'text': text
    }]
    
    # Make the request
    try:
        response = requests.post(url, params=params, headers=headers, json=body)
        response.raise_for_status()
        translated_text = response.json()[0]["translations"][0]["text"]
        return translated_text
    except Exception as e:
        print(f"Error translating back to {target_language}: {e}")
        print(f"Response content: {response.content if 'response' in locals() else 'No response'}")
        return text  # Return English text if translation fails

# Example usage
if __name__ == "__main__":
    # Test with Igbo (from the sample text you provided)
    user_input = "某物在我的胃里有点痛，已经持续了两天。"
    
    print(f"Original text: {user_input}")
    
    # Detect language
    detected_language = detect_language(user_input)
    print(f"Detected language: {detected_language}")
    
    # Translate to English if necessary
    if detected_language != "en":
        translated_text = translate_to_english(user_input, detected_language)
        print(f"Translated to English: {translated_text}")
    else:
        print("Text is already in English.")