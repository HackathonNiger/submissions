import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_API_URL = "https://api-inference.huggingface.co/models"

HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

# Default models
STT_MODEL = "openai/whisper-small"
TRANSLATION_MODEL = "Helsinki-NLP/opus-mt-mul-en"
TTS_MODEL = "espnet/kan-bayashi_ljspeech_vits"

CONFIG = {
    "stt": {
        "default_model": "openai/whisper-small",
        "yoruba": "ipTec/whisper-yo-stt",
        "hausa": "ipTec/whisper-ha-stt"
    },
    "translation": {
        "default_model": "Helsinki-NLP/opus-mt-mul-en",
        "yoruba": "ipTec/yo-en-translator"
    },
    "tts": {
        "default_model": "espnet/kan-bayashi_ljspeech_vits",
        "yoruba": "ipTec/vits-yo-tts"
    }
}