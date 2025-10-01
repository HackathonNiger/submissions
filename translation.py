import yaml
from transformers import MarianMTModel, MarianTokenizer, pipeline

# ---------------- Load config ----------------
CONFIG_FILE = "config.yaml"

def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

CONFIG = load_config()

# ---------------- Marian models ----------------
MARIAN_MODELS = {
    "yoruba": {
        "to_en": "Helsinki-NLP/opus-mt-yo-en",
        "to_lang": "Helsinki-NLP/opus-mt-en-yo"
    },
    "hausa": {
        "to_en": "Helsinki-NLP/opus-mt-ha-en",
        "to_lang": "Helsinki-NLP/opus-mt-en-ha"
    },
    "igbo": {
        "to_en": "Helsinki-NLP/opus-mt-ig-en",
        "to_lang": "Helsinki-NLP/opus-mt-en-ig"
    },
    "pidgin": {
        "to_en": "Helsinki-NLP/opus-mt-pcm-en",
        "to_lang": "Helsinki-NLP/opus-mt-en-pcm"
    },
}

# ---------------- Fallback dictionary ----------------
CUSTOM_DICT = {
    "esan": {"Koyo": "Greetings", "Wa gié": "Come here"},
    "tiv": {"M sugh u": "Good morning", "M gbee": "I am fine"},
    "calabar": {"Nsidibe": "Welcome", "Abadie": "How are you?"},
    "benin": {"Oba gha to kpere": "Long live the king", "Koyo": "Greetings"},
    "pidgin": {
        "How far": "How are you?",
        "Wetin dey happen": "What’s going on?",
        "Omo": "Kid / person (informal)",
    },
}


class Translator:
    def __init__(self, n2n_enabled=False):
        self.n2n_enabled = n2n_enabled

    def translate_with_marian(self, model_name, text):
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        inputs = tokenizer(text, return_tensors="pt")
        translated = model.generate(**inputs)
        return tokenizer.decode(translated[0], skip_special_tokens=True)

    def translate(self, text, input_lang, output_lang):
        if not text.strip():
            return ""

        # ---- Marian supported ----
        if input_lang in MARIAN_MODELS:
            if output_lang == "english":
                return self.translate_with_marian(MARIAN_MODELS[input_lang]["to_en"], text)
            elif output_lang == input_lang:
                return text
            elif output_lang in MARIAN_MODELS:
                if self.n2n_enabled:
                    en_text = self.translate_with_marian(MARIAN_MODELS[input_lang]["to_en"], text)
                    return self.translate_with_marian(MARIAN_MODELS[output_lang]["to_lang"], en_text)
                else:
                    return f"(🚧 Nigerian↔Nigerian to {output_lang} not enabled)"
        # ---- Dictionary fallback ----
        else:
            if output_lang == "english":
                return CUSTOM_DICT.get(input_lang, {}).get(text, text)
            elif output_lang == input_lang:
                return text
            else:
                return f"(⚠️ Dictionary doesn't support {input_lang}→{output_lang})"



class CustomTranslator:
    def __init__(self, model_dir="./training/outputs/model"):
        self.tokenizer = MarianTokenizer.from_pretrained(model_dir)
        self.model = MarianMTModel.from_pretrained(model_dir)
        self.pipeline = pipeline("translation", model=self.model, tokenizer=self.tokenizer)

    def translate(self, text):
        return self.pipeline(text)[0]["translation_text"]
