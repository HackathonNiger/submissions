# training/translation_trainer.py
import argparse
from datasets import load_from_disk
from transformers import (
    MarianTokenizer,
    MarianMTModel,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
    DataCollatorForSeq2Seq,
)
import torch


def train_translation(dataset_path, model_id="Helsinki-NLP/opus-mt-mul-en", output_dir="./translation_model", epochs=3):
    dataset = load_from_disk(dataset_path)

    tokenizer = MarianTokenizer.from_pretrained(model_id)
    model = MarianMTModel.from_pretrained(model_id)

    def preprocess(batch):
        inputs = tokenizer(batch["translation"]["src"], max_length=128, truncation=True, padding="max_length")
        with tokenizer.as_target_tokenizer():
            labels = tokenizer(batch["translation"]["tgt"], max_length=128, truncation=True, padding="max_length")
        batch["input_ids"] = inputs["input_ids"]
        batch["attention_mask"] = inputs["attention_mask"]
        batch["labels"] = labels["input_ids"]
        return batch

    dataset = dataset.map(preprocess, batched=True, remove_columns=dataset["train"].column_names)

    data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)

    training_args = Seq2SeqTrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="epoch",
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=epochs,
        save_steps=500,
        logging_steps=100,
        fp16=torch.cuda.is_available(),
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["test"],
        tokenizer=tokenizer,
        data_collator=data_collator,
    )

    trainer.train()
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print(f"✅ Translation model fine-tuned and saved to {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset_path", type=str, required=True)
    parser.add_argument("--model_id", type=str, default="Helsinki-NLP/opus-mt-mul-en")
    parser.add_argument("--output_dir", type=str, required=True)
    parser.add_argument("--epochs", type=int, default=3)
    args = parser.parse_args()

    train_translation(args.dataset_path, args.model_id, args.output_dir, args.epochs)
