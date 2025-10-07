from fastapi import Request
from pydantic import BaseModel
import sys
import os
from google import genai
from google.genai import types
from google.genai.types import Part
from dotenv import load_dotenv

# --- FIX: Setting up Project Root for Module Resolution ---
# When running from main.py, modules in sibling directories (like 'prompts') 
# of ai_model/ are not automatically found. This block adds the parent directory 
# (Agro-Karfi) to the Python path.
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.append(project_root)
    

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = current_dir  # this points to ai_model/

if project_root not in sys.path:
    sys.path.insert(0, project_root)

print("\n=== DEBUG PATH INFO ===")
print(f"Current working directory: {os.getcwd()}")
print(f"Project root added to sys.path: {project_root}")
print("Files in project root:", os.listdir(project_root))
print("Sys.path entries:")
for p in sys.path:
    print("   ", p)
print("========================\n")

try:
    from .prompts.prompts import instruction_str
except ModuleNotFoundError as e:
    raise ImportError(
        f"\n❌ Could not import 'instruction_str' from prompts.prompts.\n"
        f"Current working directory: {os.getcwd()}\n"
        f"Project root added to sys.path: {project_root}\n"
        f"Files in project root: {os.listdir(project_root)}\n"
        f"Details: {e}"
    )
    



# Load API key and environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Init Google GenAI client
# NOTE: Ensure GOOGLE_API_KEY is set in your .env file
if not api_key:
    # A cleaner error check than the one in main.py, specific to this module
    print("WARNING: GOOGLE_API_KEY environment variable not set. AI functions will fail.")
    # Initialize client even if key is missing to avoid crashing imports
    client = None
else:
    client = genai.Client(api_key=api_key)


# Load PDF files only once at startup
def load_pdf_parts():
    pdf_parts = []
    # NOTE: Paths must be absolute or relative to the script execution directory (Agro-Karfi/)
    pdf_files = [
        "data/CLIMATE_SMART_AGRICULTURE.pdf",
        "data/EFFECTS OF GLOBAL CLIMATE CHANGE ON NIGERIAN AGRICULTURE.pdf",
        "data/Guide-to-Maize-Production-in-Northern-Nigeria.pdf",
        "data/Guide-to-Rice-Production-in-Northern-Nigeria.pdf",
        "data/Instability of National Agricultural Research Systems in Sub-Saharan Africa Lessons from Nigeria.pdf",
        "data/Terdoo_and_Adekola2014a.pdf",
        "data/the-effects-of-fertilizer-residues-in-soils-and-crop-performance-in-northern-nigeria-a-review.pdf"
    ]
    
    # Use the project_root defined above for reliable path resolution
    for file_name in pdf_files:
        file_path = os.path.join(project_root, file_name)
        try:
            with open(file_path, "rb") as f:
                data = f.read()
                part = Part.from_bytes(data=data, mime_type="application/pdf")
                pdf_parts.append(part)
        except FileNotFoundError as e:
            print(f"ERROR: Could not find PDF file: {file_path}. Skipping.")
        except Exception as e:
            print(f"ERROR: Failed to load {file_name}: {e}")
            
    return pdf_parts

pdf_parts = load_pdf_parts()

# Generation Config with System Instruction
config = types.GenerateContentConfig(system_instruction=instruction_str)

# Initialize chat session
if client:
    # Using 'gemini-2.0-flash' as specified previously
    chat = client.chats.create(model="gemini-2.0-flash", config=config)
else:
    chat = None
    print("Chat client not initialized due to missing API key.")

# Request model (imported from main, kept here for dependency clarity)
class MessageInput(BaseModel):
    message: str
    info: dict


def chat_with_bot(payload: MessageInput):
    """Handles sending the user message and farm data to the Gemini model."""
    if not chat:
        return {"response": "AI Advisor is offline. Please check API key configuration."}

    user_input = payload.message
    user_profile = payload.info

    if user_input.lower() in ["exit", "quit"]:
        return {"response": "Exiting chat..."}

    # Convert profile dict to readable text for the model
    profile_text = f"User Field Data:\n{user_profile}"
    combined_input = f"{user_input}\n\n{profile_text}"

    # Send message to Gemini with PDFs + profile + message
    try:
        # Note: We use run_in_threadpool in main.py to handle this blocking call
        response = chat.send_message([*pdf_parts, combined_input])
        return {"response": response.text}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"response": "Sorry, I ran into a network or API error while processing your request."}
