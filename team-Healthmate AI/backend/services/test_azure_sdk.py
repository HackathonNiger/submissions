import os
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

# Load environment variables
load_dotenv()

def test_azure_sdk():
    # Get credentials from environment
    endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT")
    key = os.getenv("AZURE_LANGUAGE_KEY")
    
    print(f"Testing with endpoint: {endpoint}")
    print(f"API Key: {key[:5]}...{key[-5:]}")
    
    # Initialize the client
    try:
        client = TextAnalyticsClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(key)
        )
        
        # Test with a simple sentiment analysis (available in all Text Analytics services)
        documents = ["I had a wonderful trip to Seattle last week."]
        response = client.analyze_sentiment(documents)
        
        for result in response:
            print(f"Document Sentiment: {result.sentiment}")
            print(f"Positive score: {result.confidence_scores.positive:.2f}")
            print(f"Neutral score: {result.confidence_scores.neutral:.2f}")
            print(f"Negative score: {result.confidence_scores.negative:.2f}")
            
        print("\nTrying to detect languages...")
        response = client.detect_language(documents)
        for result in response:
            print(f"Detected language: {result.primary_language.name} ({result.primary_language.iso6391_name})")
            
        print("\nSDK is working correctly!")
        return True
        
    except Exception as e:
        print(f"Error testing Azure SDK: {e}")
        return False

if __name__ == "__main__":
    test_azure_sdk()