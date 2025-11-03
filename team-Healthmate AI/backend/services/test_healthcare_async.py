import os
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

# Load environment variables
load_dotenv()

def test_healthcare_async():
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
        
        print("\n===== TESTING HEALTHCARE ENTITY RECOGNITION (ASYNC) =====")
        
        health_documents = [
            "I have been experiencing a severe headache and fever for the past two days.",
            "My stomach has been hurting and I've been feeling nauseous since yesterday.",
            "Patient needs to take 50 mg of ibuprofen."
        ]
        
        try:
            # Use the async method for healthcare analysis
            poller = client.begin_analyze_healthcare_entities(health_documents)
            result = poller.result()
            
            docs = [doc for doc in result if not doc.is_error]
            
            for idx, doc in enumerate(docs):
                print(f"\nDocument #{idx+1} entities:")
                
                for entity in doc.entities:
                    print(f"  Entity: {entity.text}")
                    print(f"    Normalized Text: {entity.normalized_text}")
                    print(f"    Category: {entity.category}")
                    print(f"    Subcategory: {entity.subcategory}")
                    print(f"    Confidence score: {entity.confidence_score:.2f}")
                
                print("\n  Relations:")
                for relation in doc.entity_relations:
                    print(f"    Relation type: {relation.relation_type}")
                    for role in relation.roles:
                        print(f"      Role '{role.name}' with entity '{role.entity.text}'")
                
                print("------------------------------------------")
            
            print("\nHealthcare entity recognition successful!")
            return True
            
        except Exception as e:
            print(f"Error in healthcare entity recognition: {e}")
            print("This indicates that the Healthcare feature is either not available or not enabled in your service.")
            return False
        
    except Exception as e:
        print(f"Error initializing Azure client: {e}")
        return False

if __name__ == "__main__":
    test_healthcare_async()