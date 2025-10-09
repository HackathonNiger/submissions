import os
import shutil
import tempfile
from pathlib import Path
from fastapi import UploadFile

# audio helper
from pydub import AudioSegment

def save_upload_to_tmp(upload: UploadFile) -> str:
    """Saves an uploaded file to a temporary path and returns the path."""
    suffix = Path(upload.filename or "default").suffix or ".bin"
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(tmp_fd, "wb") as f:
        shutil.copyfileobj(upload.file, f)
    return tmp_path

def convert_to_wav(src_path: str) -> str:
    """Converts an audio file to WAV format and returns the new path."""
    # pydub requires ffmpeg installed on the system
    dst_fd, dst_path = tempfile.mkstemp(suffix=".wav")
    os.close(dst_fd)
    audio = AudioSegment.from_file(src_path)
    audio.export(dst_path, format="wav")
    return dst_path