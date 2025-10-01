import requests
from uwetalk import config

class Translator:
    def __init__(self, model_id: str = config.TRANSLATION_MODEL):
        self.model_id = model_id
        self.headers = config.HEADERS

    def translate(self, text: str, target_lang: str = "en") -> str:
        payload = {"inputs": text}
        response = requests.post(
            f"{config.HF_API_URL}/{self.model_id}",
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()[0]["translation_text"]
