import os
from TTS.api import TTS

LANG_MAP = {
    "english": "en",
    "yoruba": "en",
    "hausa": "en",
    "igbo": "en",
    "pidgin": "en",
    "esan": "en",
    "tiv": "en",
    "calabar": "en",
    "benin": "en",
    "french": "fr-fr",
    "portuguese": "pt-br"
}

class TTSEngine:
    def __init__(self, use_coqui=False):
        self.use_coqui = use_coqui
        self.tts = None

        if self.use_coqui:
            self.tts = TTS(
                "tts_models/multilingual/multi-dataset/your_tts",
                progress_bar=False,
                gpu=False
            )

    def speak(self, text, lang="english", voice_clone=False):
        if not text:
            return None

        out_file = "output.wav"

        if self.use_coqui:
            lang_code = LANG_MAP.get(lang.lower(), "en")

            if voice_clone and os.path.exists("my_voice.wav"):
                # clone your own voice
                self.tts.tts_to_file(
                    text=text,
                    file_path=out_file,
                    speaker_wav="my_voice.wav",
                    language=lang_code
                )
            else:
                # fallback to a neutral synthetic voice
                self.tts.tts_to_file(
                    text=text,
                    file_path=out_file,
                    speaker_wav=None,   # Let model pick default embedding
                    language=lang_code
                )
        else:
            import pyttsx3
            engine = pyttsx3.init()
            engine.save_to_file(text, out_file)
            engine.runAndWait()

        return out_file
