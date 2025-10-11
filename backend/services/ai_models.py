import os
import logging
from typing import Dict, Tuple, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ML libs (import when available)
try:
    import openai_whisper as whisper
except ImportError:
    whisper = None

try:
    from transformers import MarianMTModel, MarianTokenizer
except Exception:
    MarianMTModel = None
    MarianTokenizer = None

class AIModelHandler:
    """
    A class to handle loading and caching of AI models in an OOP style.
    Supports multiple Nigerian languages: Hausa, Yoruba, Igbo, Edo.
    """
    def __init__(self, whisper_model_name: str):
        self.whisper_model_name = whisper_model_name
        self._whisper_model = None
        self._translation_cache = {}  # key: "en-ha" -> (tokenizer, model)
        
        # Language mapping for Nigerian languages
        self.language_models = {
            "ha": "Helsinki-NLP/opus-mt-en-ha",  # Hausa
            "yo": "Helsinki-NLP/opus-mt-en-yo",  # Yoruba  
            "ig": "Helsinki-NLP/opus-mt-en-ig",  # Igbo
            "bin": "Helsinki-NLP/opus-mt-en-bin", # Edo/Bini
            "mul": "Helsinki-NLP/opus-mt-en-mul"  # Multi-language fallback
        }
        
        # Language codes mapping
        self.lang_codes = {
            "hausa": "ha",
            "yoruba": "yo", 
            "igbo": "ig",
            "edo": "bin",
            "bini": "bin",
            "en": "en"
        }

    def get_whisper_model(self):
        if self._whisper_model is None:
            if whisper is None:
                raise RuntimeError("whisper package not installed")
            logger.info(f"Loading Whisper model '{self.whisper_model_name}' (this may take a while)...")
            self._whisper_model = whisper.load_model(self.whisper_model_name)
        return self._whisper_model

    def get_translation_model(self, src: str, tgt: str):
        # Normalize language codes
        src_code = self.lang_codes.get(src.lower(), src)
        tgt_code = self.lang_codes.get(tgt.lower(), tgt)
        
        key = f"{src_code}-{tgt_code}"
        if key in self._translation_cache:
            return self._translation_cache[key]

        if MarianTokenizer is None or MarianMTModel is None:
            raise RuntimeError("transformers Marian models not available")

        # Try specific model first, fallback to multi-language
        model_name = self.language_models.get(tgt_code, self.language_models["mul"])
        
        try:
            logger.info(f"Loading translation model: {model_name}")
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            self._translation_cache[key] = (tokenizer, model)
            logger.info(f"Successfully loaded model: {model_name}")
            return tokenizer, model
        except Exception as e:
            logger.warning(f"Failed to load {model_name}, using fallback: {e}")
            # Fallback to multi-language model
            fallback_model = self.language_models["mul"]
            tokenizer = MarianTokenizer.from_pretrained(fallback_model)
            model = MarianMTModel.from_pretrained(fallback_model)
            self._translation_cache[key] = (tokenizer, model)
            return tokenizer, model
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Return supported languages and their codes"""
        return {
            "English": "en",
            "Hausa": "ha", 
            "Yoruba": "yo",
            "Igbo": "ig",
            "Edo/Bini": "bin"
        }
    
    def detect_language(self, text: str) -> str:
        """Simple language detection for Nigerian languages"""
        # This is a basic implementation - you might want to use a proper language detection library
        hausa_keywords = ["da", "shi", "ita", "mu", "ku", "su", "wani", "wata", "kana", "kina"]
        yoruba_keywords = ["o", "a", "e", "ki", "ti", "ni", "si", "fun", "pẹlu", "ninu"]
        igbo_keywords = ["na", "ka", "ga", "na-", "ka-", "ga-", "nke", "n'ime", "n'elu", "n'okpuru"]
        
        text_lower = text.lower()
        
        if any(keyword in text_lower for keyword in hausa_keywords):
            return "ha"
        elif any(keyword in text_lower for keyword in yoruba_keywords):
            return "yo"
        elif any(keyword in text_lower for keyword in igbo_keywords):
            return "ig"
        else:
            return "en"  # Default to English