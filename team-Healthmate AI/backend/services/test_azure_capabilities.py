import os
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

# Load environment variables
load_dotenv()

def test_azure_capabilities():
    # Get credentials from environment
    endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT")
    key = os.getenv("AZURE_LANGUAGE_KEY")
    
    print(f"Testing with endpoint: {endpoint}")
    print(f"API Key: {key[:5]}...{key[-5:] if key else None}")
    
    # Initialize the client
    try:
        client = TextAnalyticsClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(key)
        )
        
        print("\n===== TESTING SENTIMENT ANALYSIS =====")
        documents = ["I had a wonderful experience with the doctor. They were very helpful."]
        response = client.analyze_sentiment(documents)
        
        for result in response:
            print(f"Document Sentiment: {result.sentiment}")
            print(f"Positive score: {result.confidence_scores.positive:.2f}")
            print(f"Neutral score: {result.confidence_scores.neutral:.2f}")
            print(f"Negative score: {result.confidence_scores.negative:.2f}")
        
        print("\n===== TESTING LANGUAGE DETECTION =====")
        documents = ["I have a headache and fever for two days", 
                    "Ina ciwo a kai tsawon kwana biyu"]  # English and Hausa
        response = client.detect_language(documents)
        for idx, result in enumerate(response):
            print(f"Document #{idx+1} language: {result.primary_language.name} ({result.primary_language.iso6391_name})")
        
        print("\n===== TESTING KEY PHRASE EXTRACTION =====")
        health_documents = [
            "I have been experiencing a severe headache and fever for the past two days.",
            "My stomach has been hurting and I've been feeling nauseous since yesterday."
        ]
        response = client.extract_key_phrases(health_documents)
        for idx, doc in enumerate(response):
            if not doc.is_error:
                print(f"Key phrases in document #{idx+1}: {', '.join(doc.key_phrases)}")
        
        print("\n===== TESTING ENTITY RECOGNITION =====")
        try:
            response = client.recognize_entities(health_documents)
            for idx, doc in enumerate(response):
                if not doc.is_error:
                    print(f"Entities in document #{idx+1}:")
                    for entity in doc.entities:
                        print(f"  {entity.text} (Category: {entity.category}, Confidence: {entity.confidence_score:.2f})")
            print("Entity recognition successful!")
        except Exception as e:
            print(f"Error in entity recognition: {e}")
        
        print("\n===== ATTEMPTING HEALTHCARE ENTITY RECOGNITION =====")
        try:
            # Try to access healthcare entity recognition if available
            response = client.recognize_healthcare_entities(health_documents)
            for idx, doc in enumerate(response):
                if not doc.is_error:
                    print(f"Healthcare entities in document #{idx+1}:")
                    for entity in doc.entities:
                        print(f"  {entity.text} (Category: {entity.category}, Confidence: {entity.confidence_score:.2f})")
            print("Healthcare entity recognition successful!")
        except Exception as e:
            print(f"Error in healthcare entity recognition: {e}")
            print("This indicates that the Healthcare feature is either not available or not enabled in your service.")
            print("Consider using standard entity recognition or the OpenAI-only approach instead.")
        
        return True
        
    except Exception as e:
        print(f"Error testing Azure capabilities: {e}")
        return False

if __name__ == "__main__":
    test_azure_capabilities()