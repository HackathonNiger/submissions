import tempfile
from fastapi import WebSocket
from uwetalk.pipeline.uwe_pipeline import UwePipeline

class StreamManager:
    """
    Manages WebSocket streaming for real-time STT → Translation → TTS.
    """

    def __init__(self, pipeline: UwePipeline = None, target_lang: str = "en"):
        self.pipeline = pipeline or UwePipeline()
        self.target_lang = target_lang

    async def handle_connection(self, ws: WebSocket):
        await ws.accept()
        try:
            while True:
                # Receive audio chunk from browser
                data = await ws.receive_bytes()

                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                    tmp.write(data)
                    tmp_path = tmp.name

                # Run through pipeline
                recognized, translated_audio = self.pipeline.run(
                    tmp_path, self.target_lang
                )

                # Send results back as JSON
                await ws.send_json({
                    "recognized_text": recognized,
                    "translated_text": recognized.split("Translated: ")[-1],
                    "audio_file": "/api/audio"  # optional: TTS stream
                })

        except Exception as e:
            await ws.send_json({"error": str(e)})
        finally:
            await ws.close()
