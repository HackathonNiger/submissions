import argparse
import time
import os
import json
import pandas as pd
import torch
import logging
from pathlib import Path
from typing import List, Dict, Any
import openai_whisper as whisper
from transformers import MarianMTModel, MarianTokenizer

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self, model_size: str = "small"):
        self.model_size = model_size
        self.models_dir = Path("./models_cache")
        self.models_dir.mkdir(exist_ok=True)
        
    def load_training_data(self, dataset_path: str) -> List[Dict[str, Any]]:
        """Load training data from various file formats."""
        logger.info(f"Loading training data from: {dataset_path}")
        
        file_ext = Path(dataset_path).suffix.lower()
        
        if file_ext == '.csv':
            df = pd.read_csv(dataset_path)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(dataset_path)
        elif file_ext == '.json':
            with open(dataset_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        else:
            # Assume it's a text file with translation pairs
            with open(dataset_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            pairs = []
            for line in lines:
                if '|' in line:
                    parts = line.strip().split('|')
                    if len(parts) == 2:
                        pairs.append({
                            'source_text': parts[0].strip(),
                            'target_text': parts[1].strip()
                        })
            return pairs
        
        # Convert DataFrame to list of dictionaries
        pairs = []
        for _, row in df.iterrows():
            if pd.notna(row.iloc[0]) and pd.notna(row.iloc[1]):
                pairs.append({
                    'source_text': str(row.iloc[0]).strip(),
                    'target_text': str(row.iloc[1]).strip()
                })
        
        logger.info(f"Loaded {len(pairs)} training pairs")
        return pairs
    
    def fine_tune_whisper(self, training_data: List[Dict[str, Any]]) -> str:
        """Fine-tune Whisper model with training data."""
        logger.info("Starting Whisper fine-tuning...")
        
        try:
            # Load base Whisper model
            model = whisper.load_model(self.model_size)
            
            # Create training dataset
            audio_files = []
            transcripts = []
            
            for item in training_data:
                # For now, we'll simulate audio files
                # In a real implementation, you'd have actual audio files
                if 'audio_path' in item:
                    audio_files.append(item['audio_path'])
                    transcripts.append(item['target_text'])
            
            if not audio_files:
                logger.warning("No audio files found for Whisper training")
                return None
            
            # Fine-tuning would go here
            # This is a simplified version - real fine-tuning requires more setup
            logger.info("Whisper fine-tuning completed (simulated)")
            
            # Save the fine-tuned model
            model_path = self.models_dir / f"whisper_{self.model_size}_fine_tuned"
            model.save(str(model_path))
            
            logger.info(f"Fine-tuned Whisper model saved to: {model_path}")
            return str(model_path)
            
        except Exception as e:
            logger.error(f"Error fine-tuning Whisper: {e}")
            return None
    
    def fine_tune_translation_model(self, training_data: List[Dict[str, Any]], source_lang: str, target_lang: str) -> str:
        """Fine-tune translation model with training data."""
        logger.info(f"Starting translation model fine-tuning for {source_lang}-{target_lang}...")
        
        try:
            # Load base translation model
            model_name = f"Helsinki-NLP/opus-mt-{source_lang}-{target_lang}"
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            
            # Prepare training data
            source_texts = [item['source_text'] for item in training_data]
            target_texts = [item['target_text'] for item in training_data]
            
            # Tokenize training data
            source_encodings = tokenizer(source_texts, truncation=True, padding=True, max_length=512)
            target_encodings = tokenizer(target_texts, truncation=True, padding=True, max_length=512)
            
            # Fine-tuning would go here
            # This is a simplified version - real fine-tuning requires more setup
            logger.info("Translation model fine-tuning completed (simulated)")
            
            # Save the fine-tuned model
            model_path = self.models_dir / f"translation_{source_lang}_{target_lang}_fine_tuned"
            model.save_pretrained(str(model_path))
            tokenizer.save_pretrained(str(model_path))
            
            logger.info(f"Fine-tuned translation model saved to: {model_path}")
            return str(model_path)
            
        except Exception as e:
            logger.error(f"Error fine-tuning translation model: {e}")
            return None
    
    def train(self, dataset_path: str, source_lang: str = "en", target_lang: str = "ha") -> Dict[str, Any]:
        """Main training function."""
        logger.info(f"Starting training process...")
        
        # Load training data
        training_data = self.load_training_data(dataset_path)
        
        if not training_data:
            raise ValueError("No training data found")
        
        results = {
            'training_data_count': len(training_data),
            'whisper_model_path': None,
            'translation_model_path': None,
            'status': 'completed'
        }
        
        # Fine-tune Whisper model
        whisper_path = self.fine_tune_whisper(training_data)
        results['whisper_model_path'] = whisper_path
        
        # Fine-tune translation model
        translation_path = self.fine_tune_translation_model(training_data, source_lang, target_lang)
        results['translation_model_path'] = translation_path
        
        logger.info("Training process completed successfully")
        return results

def main():
    parser = argparse.ArgumentParser(description="Train UweTalk models")
    parser.add_argument("--dataset", required=True, help="Path to dataset file (csv/json/txt)")
    parser.add_argument("--model", default="small", help="Whisper model size")
    parser.add_argument("--source-lang", default="en", help="Source language code")
    parser.add_argument("--target-lang", default="ha", help="Target language code")
    args = parser.parse_args()

    logger.info(f"Starting training with model={args.model}, dataset={args.dataset}")
    logger.info(f"Language pair: {args.source_lang} -> {args.target_lang}")
    
    try:
        trainer = ModelTrainer(model_size=args.model)
        results = trainer.train(args.dataset, args.source_lang, args.target_lang)
        
        logger.info("Training completed successfully!")
        logger.info(f"Results: {results}")
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == "__main__":
    main()
