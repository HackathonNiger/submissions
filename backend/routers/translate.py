import os
import time
import tempfile
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel

from services.ai_models import AIModelHandler
from utils.file_helpers import save_upload_to_tmp, convert_to_wav
from utils.auth import require_key

try:
    from gtts import gTTS
except Exception:
    gTTS = None

WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "small")

router = APIRouter()
model_handler = AIModelHandler(whisper_model_name=WHISPER_MODEL_NAME)

# --- Pydantic Models for Requests ---

class TranslateRequest(BaseModel):
    api_key: Optional[str] = None
    text: str
    source_lang: str = "en"
    target_lang: str = "ha"

class TTSRequest(BaseModel):
    api_key: Optional[str] = None
    text: str
    lang: str = os.getenv("DEFAULT_TTS_LANG", "en")

# --- API Endpoints ---

@router.post("/stt/")
async def stt_endpoint(api_key: Optional[str] = Form(None), file: UploadFile = File(...), language: Optional[str] = Form(None)):
    require_key(api_key)
    tmp = save_upload_to_tmp(file)
    try:
        wav = convert_to_wav(tmp)
        model = model_handler.get_whisper_model()
        result = model.transcribe(wav, language=language) if language else model.transcribe(wav)
        text = result.get("text") if isinstance(result, dict) else str(result)
        return {"recognized_text": text, "segments": result.get("segments", None)}
    finally:
        os.remove(tmp)
        if 'wav' in locals() and os.path.exists(wav):
            os.remove(wav)

@router.post("/translate/")
def translate(req: TranslateRequest):
    require_key(req.api_key)
    print(f"Translating from '{req.source_lang}' to '{req.target_lang}'")
    tokenizer, model = model_handler.get_translation_model(req.source_lang, req.target_lang)
    inputs = tokenizer(req.text, return_tensors="pt", truncation=True)
    outs = model.generate(**inputs)
    translated = tokenizer.decode(outs[0], skip_special_tokens=True)
    return {"translated_text": translated}

@router.post("/tts/")
def tts_endpoint(req: TTSRequest):
    require_key(req.api_key)
    if gTTS is None:
        raise HTTPException(500, "gTTS not installed")
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
    os.close(tmp_fd)
    tts = gTTS(text=req.text, lang=req.lang.split("-")[0])
    tts.save(tmp_path)
    return FileResponse(tmp_path, media_type="audio/mpeg", filename="tts.mp3")

@router.post("/pipeline/")
async def pipeline(
    background_tasks: BackgroundTasks,
    api_key: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    translate_to: Optional[str] = Form(None),
    tts: Optional[bool] = Form(False),
    src_lang: Optional[str] = Form(None),
):
    require_key(api_key)
    recognized = None
    translated = None

    if file:
        tmp = save_upload_to_tmp(file)
        wav = convert_to_wav(tmp)
        model = model_handler.get_whisper_model()
        result = model.transcribe(wav, language=src_lang) if src_lang else model.transcribe(wav)
        recognized = result.get("text")
        os.remove(tmp)
        os.remove(wav)
    elif text:
        recognized = text

    if translate_to and recognized:
        src = src_lang or "en"
        tgt = translate_to
        tokenizer, model = model_handler.get_translation_model(src, tgt)
        inputs = tokenizer(recognized, return_tensors="pt", truncation=True)
        outs = model.generate(**inputs)
        translated = tokenizer.decode(outs[0], skip_special_tokens=True)
    else:
        translated = recognized

    if tts and translated:
        if gTTS is None:
            raise HTTPException(500, "gTTS not installed")
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
        os.close(tmp_fd)
        tts_obj = gTTS(text=translated, lang=(translate_to or "en"))
        tts_obj.save(tmp_path)
        return FileResponse(tmp_path, media_type="audio/mpeg", filename="pipeline_tts.mp3")

    return {"recognized_text": recognized, "translated_text": translated}

def _run_subprocess(cmd, cleanup_path):
    import subprocess
    try:
        subprocess.run(cmd, check=False)
    finally:
        if os.path.exists(cleanup_path):
            time.sleep(1)  # ensure file is released
            os.remove(cleanup_path)

@router.post("/train/")
async def train_endpoint(background_tasks: BackgroundTasks, api_key: Optional[str] = Form(None), training_file: UploadFile = File(...)):
    require_key(api_key)
    tmp = save_upload_to_tmp(training_file)
    # This is a placeholder. You would replace this with your actual training script.
    cmd = ["python", "train/train_whisper.py", "--dataset", tmp, "--model", WHISPER_MODEL_NAME]
    background_tasks.add_task(_run_subprocess, cmd, tmp)
    return {"status": "training_started", "note": "Training runs in the background on the server."}