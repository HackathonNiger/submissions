import os
import pandas as pd
import json

DATA_DIR = "./training/data"
os.makedirs(DATA_DIR, exist_ok=True)

def save_uploaded_file(file, filename):
    """Save uploaded file to data folder"""
    path = os.path.join(DATA_DIR, filename)
    with open(path, "wb") as f:
        f.write(file.read())
    return path

def convert_to_jsonl(file_path, src_col="src", tgt_col="tgt"):
    """Detect file type (csv, xlsx, tsv, jsonl) and normalize to JSONL"""
    ext = os.path.splitext(file_path)[-1].lower()
    data = None

    if ext == ".csv":
        data = pd.read_csv(file_path)
    elif ext == ".xlsx":
        data = pd.read_excel(file_path)
    elif ext == ".tsv":
        data = pd.read_csv(file_path, sep="\t")
    elif ext == ".jsonl":
        return file_path  # already JSONL
    else:
        raise ValueError("Unsupported file format")

    # Ensure we have two columns: src (Hausa) and tgt (English)
    if len(data.columns) < 2:
        raise ValueError("Dataset must have at least two columns")

    data = data.rename(columns={data.columns[0]: "src", data.columns[1]: "tgt"})
    jsonl_path = file_path.rsplit(".", 1)[0] + ".jsonl"

    with open(jsonl_path, "w", encoding="utf-8") as f:
        for _, row in data.iterrows():
            f.write(json.dumps({"src": str(row["src"]), "tgt": str(row["tgt"])}, ensure_ascii=False) + "\n")

    return jsonl_path
