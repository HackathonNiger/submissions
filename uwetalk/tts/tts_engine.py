import requests
import tempfile
from uwetalk import config


class TextToSpeech:
    def __init__(self, model_id: str = config.TTS_MODEL):
        self.model_id = model_id
        self.headers = config.HEADERS

    def synthesize(self, text: str) -> str:
        payload = {"inputs": text}
        response = requests.post(
            f"{config.HF_API_URL}/{self.model_id}",
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()

        # Create a unique temporary wav file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(response.content)
            return tmp.name
