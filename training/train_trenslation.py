# voice_translator/training/train_translation.py

import os
from datasets import load_dataset, Dataset
from transformers import (
    MarianTokenizer,
    MarianMTModel,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
    DataCollatorForSeq2Seq,
)

MODEL_NAME = "Helsinki-NLP/opus-mt-mul-en"
OUTPUT_DIR = "./training/outputs/model"

def train_from_jsonl(file_path):
    # Load dataset
    dataset = load_dataset("json", data_files=file_path, split="train")

    tokenizer = MarianTokenizer.from_pretrained(MODEL_NAME)
    model = MarianMTModel.from_pretrained(MODEL_NAME)

    def preprocess(batch):
        inputs = tokenizer(batch["src"], truncation=True, padding="max_length", max_length=128)
        targets = tokenizer(batch["tgt"], truncation=True, padding="max_length", max_length=128)
        inputs["labels"] = targets["input_ids"]
        return inputs

    tokenized = dataset.map(preprocess, batched=True)

    collator = DataCollatorForSeq2Seq(tokenizer, model=model)

    args = Seq2SeqTrainingArguments(
        output_dir=OUTPUT_DIR,
        evaluation_strategy="no",
        learning_rate=5e-5,
        per_device_train_batch_size=8,
        num_train_epochs=3,
        save_total_limit=1,
        predict_with_generate=True,
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=args,
        train_dataset=tokenized,
        tokenizer=tokenizer,
        data_collator=collator,
    )

    trainer.train()
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    return f"✅ Model trained and saved to {OUTPUT_DIR}"
