import tempfile
from fastapi import FastAPI, UploadFile, Form, WebSocket
from fastapi.responses import FileResponse, JSONResponse
from uwetalk.pipeline.uwe_pipeline import UwePipeline
from uwetalk.pipeline.stream_manager import StreamManager

pipeline = UwePipeline()
stream_manager = StreamManager(pipeline=pipeline)

app = FastAPI(title="UweTalk API")

@app.post("/api/translate")
async def api_translate(audio: UploadFile, target_lang: str = Form("en")):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name

        text, audio_out = pipeline.run(tmp_path, target_lang)
        return JSONResponse({
            "recognized_text": text,
            "audio_file": "/api/audio"
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/api/audio")
def get_audio():
    return FileResponse("output.wav", media_type="audio/wav")

@app.websocket("/ws/stream")
async def websocket_stream(ws: WebSocket):
    await stream_manager.handle_connection(ws)
