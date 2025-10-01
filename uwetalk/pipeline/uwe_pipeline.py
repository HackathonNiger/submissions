# uwetalk/pipeline/uwe_pipeline.py
from uwetalk.stt.stt_engine import SpeechToText
from uwetalk.translation.translator import Translator
from uwetalk.tts.tts_engine import TextToSpeech


class UwePipeline:
    def __init__(self):
        self.stt = SpeechToText()
        self.translator = Translator()
        self.tts = TextToSpeech()

    def run(self, audio_path: str, target_lang: str) -> dict:
        """
        Run the full pipeline:
        1. Speech -> Text
        2. Translate Text
        3. Text -> Speech
        Returns a structured dict.
        """
        # Step 1: Speech-to-text
        recognized_text = self.stt.transcribe(audio_path)

        # Step 2: Translation
        translated_text = self.translator.translate(
            recognized_text, target_lang)

        # Step 3: Text-to-speech
        audio_file = self.tts.synthesize(
            translated_text, output_path="translated_output.wav")

        return {
            "recognized_text": recognized_text,
            "translated_text": translated_text,
            "audio_file": audio_file
        }
