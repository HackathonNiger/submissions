# uwetalk/training/tts_trainer.py
import os
import json
import argparse
import subprocess
from pathlib import Path

DEFAULT_TTS_CONFIG = {
    # Minimal training config. For production, tune these
    "audio": {
        "sample_rate": 22050,
        "format": "wav"
    },
    "model": {
        "model_type": "vits",          # VITS is a modern TTS model
        "num_chars": 256
    },
    "training": {
        "batch_size": 32,
        "num_loader_workers": 2,
        "epochs": 100,
        "learning_rate": 1e-4,
        "optim": "adam"
    },
    "dataset": {
        # Coqui TTS reads metadata.csv and wavs folder by default
        "path": "",
        "meta_file_train": "metadata.csv"
    },
    "output_path": ""
}

def write_config(config_path: str, dataset_path: str, output_path: str, sample_rate: int = 22050, epochs: int = 100):
    cfg = DEFAULT_TTS_CONFIG.copy()
    cfg["audio"]["sample_rate"] = sample_rate
    cfg["training"]["epochs"] = epochs
    cfg["dataset"]["path"] = dataset_path
    cfg["output_path"] = output_path

    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    print(f"Wrote training config to {config_path}")

def run_coqui_training(config_path: str):
    """
    Try to run Coqui TTS training via CLI.
    Requires `TTS` installed in the active environment.
    Command (Coqui TTS CLI):
      python -m TTS.bin.train --continue_path <output_dir> --config_path <config_path>
    """
    # read output path from config
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    output_path = cfg.get("output_path", "./tts_output")

    # CLI command (matches Coqui TTS training entry point)
    cmd = [
        "python", "-m", "TTS.bin.train",
        "--continue_path", output_path,
        "--config_path", config_path
    ]
    print("🔧 Running Coqui TTS training CLI:")
    print(" ".join(cmd))

    try:
        subprocess.check_call(cmd)
    except FileNotFoundError:
        print("Coqui TTS not installed in this environment.")
        print("Install with: pip install TTS")
        print("Or run this command on a GPU machine / Colab:")
        print(" ".join(cmd))
    except subprocess.CalledProcessError as e:
        print("Training process failed with return code:", e.returncode)
        raise

def prepare_and_train(dataset_prepared_dir: str, output_dir: str, config_out_path: str, sample_rate: int = 22050, epochs: int = 100):
    dataset_prepared_dir = str(Path(dataset_prepared_dir).resolve())
    output_dir = str(Path(output_dir).resolve())
    os.makedirs(output_dir, exist_ok=True)
    write_config(config_out_path, dataset_prepared_dir, output_dir, sample_rate=sample_rate, epochs=epochs)
    run_coqui_training(config_out_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset_path", required=True, help="Prepared dataset folder (wavs/ + metadata.csv)")
    parser.add_argument("--output_dir", required=True, help="Where to save model checkpoints")
    parser.add_argument("--config_path", required=False, default="tts_config.json", help="Where to write the config file")
    parser.add_argument("--sample_rate", type=int, default=22050)
    parser.add_argument("--epochs", type=int, default=50)
    args = parser.parse_args()

    prepare_and_train(args.dataset_path, args.output_dir, args.config_path, sample_rate=args.sample_rate, epochs=args.epochs)
    print(f"✅ TTS model training initiated. Checkpoints will be saved to {args.output_dir}")