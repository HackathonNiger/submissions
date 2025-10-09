import os

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
    """
    def __init__(self, whisper_model_name: str):
        self.whisper_model_name = whisper_model_name
        self._whisper_model = None
        self._translation_cache = {}  # key: "en-ha" -> (tokenizer, model)

    def get_whisper_model(self):
        if self._whisper_model is None:
            if whisper is None:
                raise RuntimeError("whisper package not installed")
            print(f"Loading Whisper model '{self.whisper_model_name}' (this may take a while)...")
            self._whisper_model = whisper.load_model(self.whisper_model_name)
        return self._whisper_model

    def get_translation_model(self, src: str, tgt: str):
        key = f"{src}-{tgt}"
        if key in self._translation_cache:
            return self._translation_cache[key]

        if MarianTokenizer is None or MarianMTModel is None:
            raise RuntimeError("transformers Marian models not available")

        model_name = f"Helsinki-NLP/opus-mt-{src}-{tgt}"
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        self._translation_cache[key] = (tokenizer, model)
        return tokenizer, model