import torch
from transformers import pipeline

class STTEngine:
    def __init__(self, model_name="openai/whisper-small"):
        # Load Whisper pipeline for automatic speech recognition
        device = 0 if torch.cuda.is_available() else -1
        self.asr = pipeline(
            "automatic-speech-recognition",
            model=model_name,
            device=device
        )

    def transcribe(self, audio_path, language="en"):
        """
        Transcribe audio file to text using Whisper.
        Args:
            audio_path (str): path to .wav file
            language (str): ISO code ('en', 'ha', 'yo', 'ig')
        """
        if audio_path is None:
            return ""

        # Map Nigerian language names to Whisper codes
        lang_map = {
            "english": "en",
            "hausa": "ha",
            "yoruba": "yo",
            "igbo": "ig",
            "pidgin": "pcm",
        }
        whisper_lang = lang_map.get(language.lower(), "en")

        result = self.asr(audio_path, generate_kwargs={"language": whisper_lang})
        return result["text"].strip()
