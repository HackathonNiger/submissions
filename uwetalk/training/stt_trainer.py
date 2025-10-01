# training/stt_trainer.py
import argparse
from datasets import load_from_disk
from transformers import (
    WhisperProcessor,
    WhisperForConditionalGeneration,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
    DataCollatorForSeq2Seq,
)
import evaluate
import torch


def train_whisper(dataset_path, model_id="openai/whisper-small", output_dir="./stt_model", epochs=3):
    dataset = load_from_disk(dataset_path)

    processor = WhisperProcessor.from_pretrained(model_id)
    model = WhisperForConditionalGeneration.from_pretrained(model_id)

    def preprocess(batch):
        # extract log-mel features
        inputs = processor.feature_extractor(
            batch["audio"]["array"], sampling_rate=batch["audio"]["sampling_rate"]
        )
        # tokenize target text
        labels = processor.tokenizer(batch["sentence"], return_tensors="pt", padding="longest").input_ids
        batch["input_features"] = inputs["input_features"][0]
        batch["labels"] = labels[0]
        return batch

    dataset = dataset.map(preprocess, remove_columns=dataset["train"].column_names)

    wer_metric = evaluate.load("wer")

    def compute_metrics(pred):
        pred_ids = pred.predictions
        label_ids = pred.label_ids
        pred_str = processor.tokenizer.batch_decode(pred_ids, skip_special_tokens=True)
        label_str = processor.tokenizer.batch_decode(label_ids, skip_special_tokens=True)
        wer = wer_metric.compute(predictions=pred_str, references=label_str)
        return {"wer": wer}

    data_collator = DataCollatorForSeq2Seq(processor.tokenizer, model=model)

    training_args = Seq2SeqTrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="epoch",
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
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
        tokenizer=processor.tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )

    trainer.train()
    model.save_pretrained(output_dir)
    processor.save_pretrained(output_dir)
    print(f"✅ Whisper model fine-tuned and saved to {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset_path", type=str, required=True)
    parser.add_argument("--model_id", type=str, default="openai/whisper-small")
    parser.add_argument("--output_dir", type=str, required=True)
    parser.add_argument("--epochs", type=int, default=3)
    args = parser.parse_args()

    train_whisper(args.dataset_path, args.model_id, args.output_dir, args.epochs)
