import os
import shutil
import tempfile
from pathlib import Path
from pydub import AudioSegment

def save_upload_to_tmp(upload_file) -> str:
    """Save uploaded file to temp path and return path"""
    suffix = Path(upload_file.filename).suffix or ".bin"
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(tmp_fd, "wb") as f:
        shutil.copyfileobj(upload_file.file, f)
    return tmp_path

def convert_to_wav(src_path: str) -> str:
    """Convert any audio to wav using ffmpeg (pydub)."""
    dst_fd, dst_path = tempfile.mkstemp(suffix=".wav")
    os.close(dst_fd)
    audio = AudioSegment.from_file(src_path)
    audio.export(dst_path, format="wav")
    return dst_path
