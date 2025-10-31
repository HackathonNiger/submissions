import os
import shutil
import tempfile
import pandas as pd
import cv2
from pathlib import Path
from fastapi import UploadFile, HTTPException
from typing import List, Dict, Any, Optional
import logging

# audio helper
from pydub import AudioSegment

logger = logging.getLogger(__name__)

def save_upload_to_tmp(upload: UploadFile) -> str:
    """Saves an uploaded file to a temporary path and returns the path."""
    suffix = Path(upload.filename or "default").suffix or ".bin"
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(tmp_fd, "wb") as f:
        shutil.copyfileobj(upload.file, f)
    return tmp_path

def convert_to_wav(src_path: str) -> str:
    """Converts an audio file to WAV format and returns the new path."""
    try:
        audio = AudioSegment.from_file(src_path)
        wav_path = src_path.rsplit('.', 1)[0] + '.wav'
        audio.export(wav_path, format="wav")
        return wav_path
    except Exception as e:
        logger.error(f"Error converting audio to WAV: {e}")
        raise HTTPException(400, f"Could not convert audio file: {e}")

def extract_audio_from_video(video_path: str) -> str:
    """Extract audio from video file and return audio path."""
    try:
        audio = AudioSegment.from_file(video_path)
        audio_path = video_path.rsplit('.', 1)[0] + '_audio.wav'
        audio.export(audio_path, format="wav")
        logger.info(f"Extracted audio from video: {audio_path}")
        return audio_path
    except Exception as e:
        logger.error(f"Error extracting audio from video: {e}")
        raise HTTPException(400, f"Could not extract audio from video: {e}")

def process_csv_file(file_path: str) -> List[Dict[str, Any]]:
    """Process CSV file and extract translation pairs."""
    try:
        df = pd.read_csv(file_path)
        
        # Look for common column patterns
        possible_source_cols = ['english', 'en', 'source', 'text', 'input']
        possible_target_cols = ['hausa', 'ha', 'yoruba', 'yo', 'igbo', 'ig', 'edo', 'bin', 'target', 'translation', 'output']
        
        source_col = None
        target_col = None
        
        # Find source column
        for col in df.columns:
            if any(pattern in col.lower() for pattern in possible_source_cols):
                source_col = col
                break
        
        # Find target column
        for col in df.columns:
            if any(pattern in col.lower() for pattern in possible_target_cols):
                target_col = col
                break
        
        if not source_col or not target_col:
            raise ValueError("Could not identify source and target columns")
        
        # Extract translation pairs
        translation_pairs = []
        for _, row in df.iterrows():
            if pd.notna(row[source_col]) and pd.notna(row[target_col]):
                translation_pairs.append({
                    'source_text': str(row[source_col]).strip(),
                    'target_text': str(row[target_col]).strip(),
                    'row_number': _ + 1
                })
        
        logger.info(f"Processed {len(translation_pairs)} translation pairs from CSV")
        return translation_pairs
        
    except Exception as e:
        logger.error(f"Error processing CSV file: {e}")
        raise HTTPException(400, f"Could not process CSV file: {e}")

def process_excel_file(file_path: str) -> List[Dict[str, Any]]:
    """Process Excel file and extract translation pairs."""
    try:
        # Read all sheets
        excel_file = pd.ExcelFile(file_path)
        all_pairs = []
        
        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            # Look for common column patterns
            possible_source_cols = ['english', 'en', 'source', 'text', 'input']
            possible_target_cols = ['hausa', 'ha', 'yoruba', 'yo', 'igbo', 'ig', 'edo', 'bin', 'target', 'translation', 'output']
            
            source_col = None
            target_col = None
            
            # Find source column
            for col in df.columns:
                if any(pattern in col.lower() for pattern in possible_source_cols):
                    source_col = col
                    break
            
            # Find target column
            for col in df.columns:
                if any(pattern in col.lower() for pattern in possible_target_cols):
                    target_col = col
                    break
            
            if source_col and target_col:
                # Extract translation pairs
                for _, row in df.iterrows():
                    if pd.notna(row[source_col]) and pd.notna(row[target_col]):
                        all_pairs.append({
                            'source_text': str(row[source_col]).strip(),
                            'target_text': str(row[target_col]).strip(),
                            'sheet_name': sheet_name,
                            'row_number': _ + 1
                        })
        
        logger.info(f"Processed {len(all_pairs)} translation pairs from Excel file")
        return all_pairs
        
    except Exception as e:
        logger.error(f"Error processing Excel file: {e}")
        raise HTTPException(400, f"Could not process Excel file: {e}")

def get_file_type(file_path: str) -> str:
    """Determine file type based on extension."""
    ext = Path(file_path).suffix.lower()
    
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
    audio_extensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    document_extensions = ['.pdf', '.doc', '.docx', '.txt']
    spreadsheet_extensions = ['.csv', '.xlsx', '.xls']
    
    if ext in video_extensions:
        return 'video'
    elif ext in audio_extensions:
        return 'audio'
    elif ext in image_extensions:
        return 'image'
    elif ext in document_extensions:
        return 'document'
    elif ext in spreadsheet_extensions:
        return 'spreadsheet'
    else:
        return 'unknown'

def process_multimedia_file(file_path: str) -> Dict[str, Any]:
    """Process multimedia files and extract relevant data."""
    file_type = get_file_type(file_path)
    result = {
        'file_type': file_type,
        'file_path': file_path,
        'extracted_data': []
    }
    
    try:
        if file_type == 'video':
            # Extract audio from video
            audio_path = extract_audio_from_video(file_path)
            result['extracted_data'].append({
                'type': 'audio',
                'path': audio_path,
                'description': 'Audio extracted from video'
            })
            
        elif file_type == 'audio':
            # Convert to WAV for processing
            wav_path = convert_to_wav(file_path)
            result['extracted_data'].append({
                'type': 'audio',
                'path': wav_path,
                'description': 'Audio converted to WAV format'
            })
            
        elif file_type == 'spreadsheet':
            if file_path.endswith('.csv'):
                pairs = process_csv_file(file_path)
            else:
                pairs = process_excel_file(file_path)
            
            result['extracted_data'].append({
                'type': 'translation_pairs',
                'data': pairs,
                'description': f'Extracted {len(pairs)} translation pairs'
            })
            
        elif file_type == 'document':
            # For text documents, we could extract text for translation
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            result['extracted_data'].append({
                'type': 'text',
                'content': content,
                'description': 'Text content extracted from document'
            })
            
    except Exception as e:
        logger.error(f"Error processing multimedia file: {e}")
        result['error'] = str(e)
    
    return result