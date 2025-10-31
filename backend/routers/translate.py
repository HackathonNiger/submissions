import os
import time
import tempfile
from typing import Optional
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel

from services.ai_models import AIModelHandler
from services.tts_service import TTSService
from services.auto_learning import AutoLearningService
from utils.file_helpers import save_upload_to_tmp, convert_to_wav, process_multimedia_file, get_file_type
from utils.auth import require_key

try:
    from gtts import gTTS
except Exception:
    gTTS = None

WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "small")

router = APIRouter()
model_handler = AIModelHandler(whisper_model_name=WHISPER_MODEL_NAME)
tts_service = TTSService()
auto_learning = AutoLearningService()

# --- Pydantic Models for Requests ---

class TranslateRequest(BaseModel):
    api_key: Optional[str] = None
    text: str
    source_lang: str = "en"
    target_lang: str = "ha"  # Default to Hausa, but now supports yo, ig, bin

class TTSRequest(BaseModel):
    api_key: Optional[str] = None
    text: str
    lang: str = os.getenv("DEFAULT_TTS_LANG", "en")
    engine: str = "auto"  # gtts, coqui, auto
    voice: Optional[str] = None

class FeedbackRequest(BaseModel):
    api_key: Optional[str] = None
    input_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    user_rating: Optional[int] = None  # 1-5 stars
    user_correction: Optional[str] = None
    user_id: Optional[str] = None

class TTSFeedbackRequest(BaseModel):
    api_key: Optional[str] = None
    text: str
    audio_path: str
    language: str
    engine: str
    user_rating: Optional[int] = None  # 1-5 stars
    user_comments: Optional[str] = None
    user_id: Optional[str] = None

class CorrectionRequest(BaseModel):
    api_key: Optional[str] = None
    original_text: str
    corrected_text: str
    source_lang: str
    target_lang: str
    correction_type: str = "translation"
    user_id: Optional[str] = None

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
    """Generate speech from text using advanced TTS engines."""
    require_key(req.api_key)
    
    try:
        # Use the new TTS service
        audio_path = tts_service.synthesize_speech(
            text=req.text,
            language=req.lang,
            engine=req.engine,
            voice=req.voice
        )
        
        return FileResponse(audio_path, media_type="audio/wav", filename="tts.wav")
        
    except Exception as e:
        raise HTTPException(500, f"TTS generation failed: {str(e)}")

@router.get("/tts/engines/")
def get_tts_engines():
    """Get available TTS engines and their capabilities."""
    return {
        "engines": tts_service.get_supported_languages(),
        "voices": tts_service.get_available_voices(),
        "default_engine": "auto"
    }

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

@router.get("/languages/")
def get_supported_languages():
    """Get list of supported languages"""
    return {
        "supported_languages": model_handler.get_supported_languages(),
        "default_source": "en",
        "default_target": "ha"
    }

@router.post("/detect-language/")
def detect_language(req: TranslateRequest):
    """Detect the language of input text"""
    require_key(req.api_key)
    detected_lang = model_handler.detect_language(req.text)
    return {
        "text": req.text,
        "detected_language": detected_lang,
        "confidence": "medium"  # Placeholder - could implement actual confidence scoring
    }

@router.post("/process-multimedia/")
async def process_multimedia_endpoint(
    background_tasks: BackgroundTasks,
    api_key: Optional[str] = Form(None),
    file: UploadFile = File(...),
    extract_audio: Optional[bool] = Form(False),
    extract_text: Optional[bool] = Form(False)
):
    """Process multimedia files (video, audio, documents, spreadsheets) for training data extraction."""
    require_key(api_key)
    
    try:
        # Save uploaded file temporarily
        tmp_path = save_upload_to_tmp(file)
        
        # Process the multimedia file
        result = process_multimedia_file(tmp_path)
        
        # Add file metadata
        result['original_filename'] = file.filename
        result['file_size'] = file.size
        result['content_type'] = file.content_type
        
        # Clean up temporary file
        background_tasks.add_task(os.remove, tmp_path)
        
        return {
            "status": "success",
            "processing_result": result,
            "message": f"Successfully processed {file.filename}"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error processing file: {str(e)}"
        }

@router.post("/feedback/translation/")
def submit_translation_feedback(req: FeedbackRequest):
    """Submit feedback on translation quality."""
    require_key(req.api_key)
    
    result = auto_learning.record_translation_feedback(
        input_text=req.input_text,
        translated_text=req.translated_text,
        source_lang=req.source_lang,
        target_lang=req.target_lang,
        user_rating=req.user_rating,
        user_correction=req.user_correction,
        user_id=req.user_id
    )
    
    return result

@router.post("/feedback/tts/")
def submit_tts_feedback(req: TTSFeedbackRequest):
    """Submit feedback on TTS quality."""
    require_key(req.api_key)
    
    result = auto_learning.record_tts_feedback(
        text=req.text,
        audio_path=req.audio_path,
        language=req.language,
        engine=req.engine,
        user_rating=req.user_rating,
        user_comments=req.user_comments,
        user_id=req.user_id
    )
    
    return result

@router.post("/feedback/correction/")
def submit_correction(req: CorrectionRequest):
    """Submit user corrections for model improvement."""
    require_key(req.api_key)
    
    result = auto_learning.record_user_correction(
        original_text=req.original_text,
        corrected_text=req.corrected_text,
        source_lang=req.source_lang,
        target_lang=req.target_lang,
        correction_type=req.correction_type,
        user_id=req.user_id
    )
    
    return result

@router.get("/feedback/summary/")
def get_feedback_summary():
    """Get summary of all user feedback."""
    return auto_learning.get_feedback_summary()

@router.post("/feedback/export-training-data/")
def export_training_data_from_feedback(background_tasks: BackgroundTasks, api_key: Optional[str] = Form(None)):
    """Export training data generated from user feedback."""
    require_key(api_key)
    
    output_file = f"./feedback_data/training_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    result = auto_learning.export_training_data(output_file)
    
    return result

@router.get("/feedback/should-retrain/")
def check_if_should_retrain(threshold: int = 100):
    """Check if model should be retrained based on feedback volume."""
    should_retrain = auto_learning.should_retrain_model(threshold)
    return {
        "should_retrain": should_retrain,
        "threshold": threshold,
        "message": "Model should be retrained" if should_retrain else "Not enough feedback for retraining"
    }

@router.post("/train/")
async def train_endpoint(background_tasks: BackgroundTasks, api_key: Optional[str] = Form(None), training_file: UploadFile = File(...)):
    require_key(api_key)
    tmp = save_upload_to_tmp(training_file)
    # This is a placeholder. You would replace this with your actual training script.
    cmd = ["python", "train/train_whisper.py", "--dataset", tmp, "--model", WHISPER_MODEL_NAME]
    background_tasks.add_task(_run_subprocess, cmd, tmp)
    return {"status": "training_started", "note": "Training runs in the background on the server."}