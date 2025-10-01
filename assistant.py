import yaml
from translation import Translator
from tts_engine import TTSManager
from speech_input import SpeechInput

class VoiceTranslatorAssistant:
    def __init__(self, config_file="config.yaml"):
        with open(config_file, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)

        self.lang_a = config.get("default_language", "yoruba").lower()
        self.lang_b = config.get("output_language", "english").lower()
        self.n2n_enabled = config.get("features", {}).get("nigerian_to_nigerian_enabled", False)

        self.translator = Translator(n2n_enabled=self.n2n_enabled)
        self.tts = TTSManager(engine=config["speech"]["engine"], rate=config["speech"]["rate"], volume=config["speech"]["volume"])
        self.speech = SpeechInput()

    def run(self):
        print(f"🌍 Two-Way Translator: {self.lang_a.upper()} ↔ {self.lang_b.upper()}")
        while True:
            # Speaker A
            text_a = self.speech.listen(f"{self.lang_a.upper()} (Speaker A)")
            if not text_a or text_a.lower() in ["quit", "exit", "stop"]:
                break
            trans_a = self.translator.translate(text_a, self.lang_a, self.lang_b)
            print(f"👤 A said: {text_a}\n➡️ {trans_a}")
            self.tts.speak(trans_a, lang=self.lang_b, speaker="B")

            # Speaker B
            text_b = self.speech.listen(f"{self.lang_b.upper()} (Speaker B)")
            if not text_b or text_b.lower() in ["quit", "exit", "stop"]:
                break
            trans_b = self.translator.translate(text_b, self.lang_b, self.lang_a)
            print(f"👤 B said: {text_b}\n➡️ {trans_b}")
            self.tts.speak(trans_b, lang=self.lang_a, speaker="A")

        print("👋 Session ended.")
