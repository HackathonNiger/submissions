import os
import tempfile
import logging
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class TTSService:
    """Advanced TTS service supporting multiple engines."""
    
    def __init__(self):
        self.gtts_available = False
        self.coqui_available = False
        self.coqui_model = None
        
        # Initialize available TTS engines
        self._initialize_gtts()
        self._initialize_coqui()
    
    def _initialize_gtts(self):
        """Initialize Google TTS."""
        try:
            from gtts import gTTS
            self.gtts_available = True
            logger.info("Google TTS initialized successfully")
        except ImportError:
            logger.warning("Google TTS not available")
    
    def _initialize_coqui(self):
        """Initialize Coqui TTS."""
        try:
            from TTS.api import TTS
            self.coqui_available = True
            
            # Load a multilingual model that supports multiple languages
            try:
                self.coqui_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
                logger.info("Coqui TTS multilingual model loaded successfully")
            except Exception as e:
                logger.warning(f"Could not load Coqui multilingual model: {e}")
                # Fallback to English model
                try:
                    self.coqui_model = TTS("tts_models/en/ljspeech/tacotron2-DDC")
                    logger.info("Coqui TTS English model loaded successfully")
                except Exception as e2:
                    logger.warning(f"Could not load Coqui English model: {e2}")
                    self.coqui_available = False
                    
        except ImportError:
            logger.warning("Coqui TTS not available")
    
    def get_supported_languages(self) -> Dict[str, Any]:
        """Get supported languages for each TTS engine."""
        languages = {
            "gtts": {
                "available": self.gtts_available,
                "languages": ["en", "ha", "yo", "ig"] if self.gtts_available else []
            },
            "coqui": {
                "available": self.coqui_available,
                "languages": ["en", "es", "fr", "de", "it", "pt", "pl", "tr", "ru", "nl", "cs", "ar", "zh", "ja", "hu", "ko"] if self.coqui_available else []
            }
        }
        return languages
    
    def synthesize_speech(self, text: str, language: str = "en", engine: str = "auto", voice: Optional[str] = None) -> str:
        """
        Synthesize speech from text.
        
        Args:
            text: Text to synthesize
            language: Language code (en, ha, yo, ig, etc.)
            engine: TTS engine to use (gtts, coqui, auto)
            voice: Voice to use (for Coqui TTS)
        
        Returns:
            Path to generated audio file
        """
        if engine == "auto":
            # Choose best available engine for the language
            if language in ["ha", "yo", "ig"] and self.gtts_available:
                engine = "gtts"
            elif self.coqui_available:
                engine = "coqui"
            elif self.gtts_available:
                engine = "gtts"
            else:
                raise RuntimeError("No TTS engine available")
        
        if engine == "gtts":
            return self._synthesize_gtts(text, language)
        elif engine == "coqui":
            return self._synthesize_coqui(text, language, voice)
        else:
            raise ValueError(f"Unknown TTS engine: {engine}")
    
    def _synthesize_gtts(self, text: str, language: str) -> str:
        """Synthesize speech using Google TTS."""
        if not self.gtts_available:
            raise RuntimeError("Google TTS not available")
        
        try:
            from gtts import gTTS
            
            # Create temporary file
            tmp_fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
            os.close(tmp_fd)
            
            # Generate speech
            tts = gTTS(text=text, lang=language, slow=False)
            tts.save(tmp_path)
            
            logger.info(f"Generated speech using Google TTS: {tmp_path}")
            return tmp_path
            
        except Exception as e:
            logger.error(f"Error generating speech with Google TTS: {e}")
            raise
    
    def _synthesize_coqui(self, text: str, language: str, voice: Optional[str] = None) -> str:
        """Synthesize speech using Coqui TTS."""
        if not self.coqui_available or self.coqui_model is None:
            raise RuntimeError("Coqui TTS not available")
        
        try:
            # Create temporary file
            tmp_fd, tmp_path = tempfile.mkstemp(suffix=".wav")
            os.close(tmp_fd)
            
            # Generate speech
            if hasattr(self.coqui_model, 'tts_to_file'):
                # For XTTS models
                self.coqui_model.tts_to_file(
                    text=text,
                    file_path=tmp_path,
                    language=language,
                    speaker_wav=voice  # Optional voice file
                )
            else:
                # For other models
                wav = self.coqui_model.tts(text)
                import numpy as np
                import soundfile as sf
                sf.write(tmp_path, wav, 22050)
            
            logger.info(f"Generated speech using Coqui TTS: {tmp_path}")
            return tmp_path
            
        except Exception as e:
            logger.error(f"Error generating speech with Coqui TTS: {e}")
            raise
    
    def get_available_voices(self) -> Dict[str, Any]:
        """Get available voices for each TTS engine."""
        voices = {
            "gtts": {
                "available": self.gtts_available,
                "voices": ["default"] if self.gtts_available else []
            },
            "coqui": {
                "available": self.coqui_available,
                "voices": ["default", "female", "male"] if self.coqui_available else []
            }
        }
        return voices
    
    def is_available(self) -> bool:
        """Check if any TTS engine is available."""
        return self.gtts_available or self.coqui_available
