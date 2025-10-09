import argparse
import time

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", required=True, help="Path to dataset file (e.g., csv/json)")
    parser.add_argument("--model", default="small", help="Whisper model size")
    args = parser.parse_args()

    print(f"[TRAIN] Starting training with model={args.model}, dataset={args.dataset}")
    # simulate training
    for epoch in range(1, 4):
        print(f"[TRAIN] Epoch {epoch}/3 ...")
        time.sleep(2)  # simulate time
    print("[TRAIN] Training complete. Model saved to ./models_cache/custom_model")

if __name__ == "__main__":
    main()
