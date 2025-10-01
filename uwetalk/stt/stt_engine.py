import requests
from uwetalk import config

class SpeechToText:
    def __init__(self, model_id: str = config.STT_MODEL):
        self.model_id = model_id
        self.headers = config.HEADERS

    def transcribe(self, audio_file: str) -> str:
        with open(audio_file, "rb") as f:
            data = f.read()
        response = requests.post(
            f"{config.HF_API_URL}/{self.model_id}",
            headers=self.headers,
            data=data
        )
        response.raise_for_status()
        return response.json().get("text", "")
