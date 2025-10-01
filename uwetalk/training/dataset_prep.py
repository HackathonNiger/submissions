# uwetalk/training/dataset_prep.py
import os
import csv
import argparse
from pathlib import Path

from typing import Union

def prepare_tts_dataset(data_dir: Union[str, Path], output_dir: Union[str, Path]):
    """
    Prepares data for Coqui TTS.
    Expected input folder structure:
      data_dir/
        wavs/
          0001.wav
          0002.wav
          ...
        transcripts.txt   (optional)  OR metadata.csv (wav_filename|transcript)

    Output:
      output_dir/
        wavs/             (copied or symlinked)
        metadata.csv      (wav_filename|transcript)
    """

    data_dir = Path(data_dir)
    wavs_dir = Path(data_dir) / "wavs"
    if not wavs_dir.exists():
        raise ValueError(f"Expected folder: {wavs_dir} (contains wav files)")

    output_dir = Path(output_dir)
    out_wavs = Path(output_dir) / "wavs"
    out_wavs.mkdir(parents=True, exist_ok=True)

    # Detect transcripts source
    transcripts_txt = data_dir / "transcripts.txt"
    metadata_csv = data_dir / "metadata.csv"

    entries = []

    if transcripts_txt.exists():
        # transcripts.txt format: <wav_filename>|<transcript>  (or tab/space separated)
        with open(transcripts_txt, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                # Support pipe or tab or first space
                if "|" in line:
                    wav_name, transcript = line.split("|", 1)
                elif "\t" in line:
                    wav_name, transcript = line.split("\t", 1)
                else:
                    parts = line.split(" ", 1)
                    if len(parts) == 2:
                        wav_name, transcript = parts
                    else:
                        continue
                wav_name = wav_name.strip()
                transcript = transcript.strip()
                src_wav = wavs_dir / wav_name
                if not src_wav.exists():
                    print(f"[WARN] wav not found for {wav_name}, skipping")
                    continue
                # copy or symlink
                dest_wav = out_wavs / wav_name
                try:
                    os.symlink(src_wav.resolve(), dest_wav)
                except Exception:
                    # fallback copy
                    import shutil
                    shutil.copy(src_wav, dest_wav)
                entries.append((wav_name, transcript))

    elif metadata_csv.exists():
        # metadata.csv already present
        with open(metadata_csv, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) >= 2:
                    wav_name = row[0].strip()
                    transcript = row[1].strip()
                    src_wav = wavs_dir / wav_name
                    if not src_wav.exists():
                        print(f"[WARN] wav not found for {wav_name}, skipping")
                        continue
                    dest_wav = out_wavs / wav_name
                    try:
                        os.symlink(src_wav.resolve(), dest_wav)
                    except Exception:
                        import shutil
                        shutil.copy(src_wav, dest_wav)
                    entries.append((wav_name, transcript))
    else:
        # Try to auto-detect wav+txt pairs (0001.wav + 0001.txt)
        for file in wavs_dir.glob("*.wav"):
            base = file.stem
            txt_candidate = file.with_suffix(".txt")
            if txt_candidate.exists():
                with open(txt_candidate, "r", encoding="utf-8") as f:
                    transcript = f.read().strip()
                wav_name = file.name
                dest_wav = out_wavs / wav_name
                try:
                    os.symlink(file.resolve(), dest_wav)
                except Exception:
                    import shutil
                    shutil.copy(file, out_wavs / wav_name)
                entries.append((wav_name, transcript))
            else:
                print(f"[WARN] No transcript for {file.name}, skipping")

    if not entries:
        raise ValueError("No (wav, transcript) pairs found. Please check your dataset structure.")

    # Write metadata.csv (Coqui expects: wav_filename|transcript)
    metadata_out = output_dir / "metadata.csv"
    with open(metadata_out, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.writer(csvfile, delimiter="|")
        for wav_name, transcript in entries:
            writer.writerow([wav_name, transcript])

    print(f"Prepared TTS dataset at {output_dir} ({len(entries)} samples)")
    print(f" - wavs dir: {out_wavs}")
    print(f" - metadata: {metadata_out}")
    return output_dir

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", choices=["tts"], required=True)
    parser.add_argument("--data_dir", type=str, help="Path to raw tts dataset (contains wavs/ and transcripts)")
    parser.add_argument("--output_dir", type=str, required=True)
    args = parser.parse_args()

    if args.task == "tts":
        prepare_tts_dataset(args.data_dir, args.output_dir)
