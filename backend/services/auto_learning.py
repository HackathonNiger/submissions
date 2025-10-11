import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path
import pandas as pd

logger = logging.getLogger(__name__)

class AutoLearningService:
    """Service for automatic model improvement from user feedback."""
    
    def __init__(self, feedback_dir: str = "./feedback_data"):
        self.feedback_dir = Path(feedback_dir)
        self.feedback_dir.mkdir(exist_ok=True)
        
        # Feedback storage files
        self.translation_feedback_file = self.feedback_dir / "translation_feedback.json"
        self.tts_feedback_file = self.feedback_dir / "tts_feedback.json"
        self.user_corrections_file = self.feedback_dir / "user_corrections.json"
        
        # Initialize feedback storage
        self._initialize_feedback_storage()
    
    def _initialize_feedback_storage(self):
        """Initialize feedback storage files if they don't exist."""
        for file_path in [self.translation_feedback_file, self.tts_feedback_file, self.user_corrections_file]:
            if not file_path.exists():
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump([], f)
    
    def record_translation_feedback(self, 
                                  input_text: str, 
                                  translated_text: str, 
                                  source_lang: str, 
                                  target_lang: str,
                                  user_rating: Optional[int] = None,
                                  user_correction: Optional[str] = None,
                                  user_id: Optional[str] = None) -> Dict[str, Any]:
        """Record user feedback on translation quality."""
        
        feedback_entry = {
            "timestamp": datetime.now().isoformat(),
            "input_text": input_text,
            "translated_text": translated_text,
            "source_lang": source_lang,
            "target_lang": target_lang,
            "user_rating": user_rating,
            "user_correction": user_correction,
            "user_id": user_id,
            "feedback_type": "translation"
        }
        
        # Load existing feedback
        with open(self.translation_feedback_file, 'r', encoding='utf-8') as f:
            feedback_data = json.load(f)
        
        # Add new feedback
        feedback_data.append(feedback_entry)
        
        # Save updated feedback
        with open(self.translation_feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedback_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Recorded translation feedback: {user_rating} stars")
        return {"status": "success", "message": "Feedback recorded"}
    
    def record_tts_feedback(self,
                           text: str,
                           audio_path: str,
                           language: str,
                           engine: str,
                           user_rating: Optional[int] = None,
                           user_comments: Optional[str] = None,
                           user_id: Optional[str] = None) -> Dict[str, Any]:
        """Record user feedback on TTS quality."""
        
        feedback_entry = {
            "timestamp": datetime.now().isoformat(),
            "text": text,
            "audio_path": audio_path,
            "language": language,
            "engine": engine,
            "user_rating": user_rating,
            "user_comments": user_comments,
            "user_id": user_id,
            "feedback_type": "tts"
        }
        
        # Load existing feedback
        with open(self.tts_feedback_file, 'r', encoding='utf-8') as f:
            feedback_data = json.load(f)
        
        # Add new feedback
        feedback_data.append(feedback_entry)
        
        # Save updated feedback
        with open(self.tts_feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedback_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Recorded TTS feedback: {user_rating} stars")
        return {"status": "success", "message": "TTS feedback recorded"}
    
    def record_user_correction(self,
                              original_text: str,
                              corrected_text: str,
                              source_lang: str,
                              target_lang: str,
                              correction_type: str = "translation",
                              user_id: Optional[str] = None) -> Dict[str, Any]:
        """Record user corrections for model improvement."""
        
        correction_entry = {
            "timestamp": datetime.now().isoformat(),
            "original_text": original_text,
            "corrected_text": corrected_text,
            "source_lang": source_lang,
            "target_lang": target_lang,
            "correction_type": correction_type,
            "user_id": user_id
        }
        
        # Load existing corrections
        with open(self.user_corrections_file, 'r', encoding='utf-8') as f:
            corrections_data = json.load(f)
        
        # Add new correction
        corrections_data.append(correction_entry)
        
        # Save updated corrections
        with open(self.user_corrections_file, 'w', encoding='utf-8') as f:
            json.dump(corrections_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Recorded user correction: {correction_type}")
        return {"status": "success", "message": "Correction recorded"}
    
    def get_feedback_summary(self) -> Dict[str, Any]:
        """Get summary of all feedback data."""
        summary = {
            "translation_feedback": self._get_feedback_summary(self.translation_feedback_file),
            "tts_feedback": self._get_feedback_summary(self.tts_feedback_file),
            "user_corrections": self._get_corrections_summary()
        }
        return summary
    
    def _get_feedback_summary(self, file_path: Path) -> Dict[str, Any]:
        """Get summary of feedback from a specific file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                feedback_data = json.load(f)
            
            if not feedback_data:
                return {"count": 0, "average_rating": 0, "recent_feedback": []}
            
            # Calculate average rating
            ratings = [entry.get("user_rating") for entry in feedback_data if entry.get("user_rating")]
            average_rating = sum(ratings) / len(ratings) if ratings else 0
            
            # Get recent feedback
            recent_feedback = sorted(feedback_data, key=lambda x: x["timestamp"], reverse=True)[:5]
            
            return {
                "count": len(feedback_data),
                "average_rating": round(average_rating, 2),
                "recent_feedback": recent_feedback
            }
        except Exception as e:
            logger.error(f"Error reading feedback summary: {e}")
            return {"count": 0, "average_rating": 0, "recent_feedback": []}
    
    def _get_corrections_summary(self) -> Dict[str, Any]:
        """Get summary of user corrections."""
        try:
            with open(self.user_corrections_file, 'r', encoding='utf-8') as f:
                corrections_data = json.load(f)
            
            if not corrections_data:
                return {"count": 0, "recent_corrections": []}
            
            # Get recent corrections
            recent_corrections = sorted(corrections_data, key=lambda x: x["timestamp"], reverse=True)[:5]
            
            return {
                "count": len(corrections_data),
                "recent_corrections": recent_corrections
            }
        except Exception as e:
            logger.error(f"Error reading corrections summary: {e}")
            return {"count": 0, "recent_corrections": []}
    
    def generate_training_data_from_feedback(self) -> List[Dict[str, Any]]:
        """Generate training data from user feedback and corrections."""
        training_data = []
        
        try:
            # Load corrections
            with open(self.user_corrections_file, 'r', encoding='utf-8') as f:
                corrections_data = json.load(f)
            
            # Convert corrections to training data
            for correction in corrections_data:
                training_data.append({
                    "source_text": correction["original_text"],
                    "target_text": correction["corrected_text"],
                    "source_lang": correction["source_lang"],
                    "target_lang": correction["target_lang"],
                    "data_type": "user_correction",
                    "timestamp": correction["timestamp"]
                })
            
            # Load low-rated translations for improvement
            with open(self.translation_feedback_file, 'r', encoding='utf-8') as f:
                feedback_data = json.load(f)
            
            # Find low-rated translations (rating <= 2)
            low_rated = [entry for entry in feedback_data if entry.get("user_rating", 5) <= 2]
            
            for entry in low_rated:
                if entry.get("user_correction"):
                    training_data.append({
                        "source_text": entry["input_text"],
                        "target_text": entry["user_correction"],
                        "source_lang": entry["source_lang"],
                        "target_lang": entry["target_lang"],
                        "data_type": "feedback_correction",
                        "timestamp": entry["timestamp"]
                    })
            
            logger.info(f"Generated {len(training_data)} training examples from feedback")
            return training_data
            
        except Exception as e:
            logger.error(f"Error generating training data from feedback: {e}")
            return []
    
    def export_training_data(self, output_file: str) -> Dict[str, Any]:
        """Export training data generated from feedback to a file."""
        training_data = self.generate_training_data_from_feedback()
        
        if not training_data:
            return {"status": "no_data", "message": "No training data available"}
        
        # Export to JSON
        output_path = Path(output_file)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(training_data, f, ensure_ascii=False, indent=2)
        
        # Also export to CSV for easy processing
        csv_path = output_path.with_suffix('.csv')
        df = pd.DataFrame(training_data)
        df.to_csv(csv_path, index=False, encoding='utf-8')
        
        logger.info(f"Exported {len(training_data)} training examples to {output_path}")
        return {
            "status": "success",
            "message": f"Exported {len(training_data)} training examples",
            "json_file": str(output_path),
            "csv_file": str(csv_path)
        }
    
    def should_retrain_model(self, threshold: int = 100) -> bool:
        """Determine if model should be retrained based on feedback volume."""
        corrections_count = self._get_corrections_summary()["count"]
        return corrections_count >= threshold
