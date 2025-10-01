---
title: UweTalk AI
emoji: 🦀
colorFrom: gray
colorTo: blue
sdk: gradio
sdk_version: 5.46.1
license: mit
thumbnail: >-
  https://cdn-uploads.huggingface.co/production/uploads/68d089f7721b3accf8e75494/7oCGf_HAEqG9CsBJwxguu.png
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

# UweTalk

**UweTalk** is a multilingual **real-time speech translator** for Nigerian languages (Hausa, Yoruba, Igbo, etc.).  
It converts **speech → text → translation → speech** so companies and individuals can communicate across languages seamlessly.

---

## Features

- **Speech-to-Text (STT)**: Converts Hausa/Yoruba/Igbo/English speech into text using Whisper.
- **Translation**: Translates between Nigerian languages and global languages (powered by Hugging Face models like NLLB-200).
- **Text-to-Speech (TTS)**: Replies back in the user’s selected language using gTTS or Coqui TTS.
- **Web Demo**: Simple Gradio interface for testing in browser.
- **API Endpoint**: REST API (via FastAPI) for integration into apps and businesses.

---

## Architecture (Simplified)

```bash
uwetalk/
│── README.md
│── requirements.txt
│── web.py        # Simple Gradio web demo
│── api.py        # Simple FastAPI demo
│── main.py            # Entrypoint (optional runner)
│
├── uwetalk/           # Core package
│   ├── __init__.py
│   ├── config.py      # Settings (model names, defaults)
│   │
│   ├── stt/           # Speech-to-Text (Whisper, etc.)
│   │   ├── __init__.py
│   │   └── stt_engine.py
│   │
│   ├── translation/   # Translation (Hugging Face, NLLB)
│   │   ├── __init__.py
│   │   └── translator.py
│   │
│   ├── tts/           # Text-to-Speech (gTTS, Coqui)
│   │   ├── __init__.py
│   │   └── tts_engine.py
│   │
│   ├── pipeline/      # Orchestrator
│   │   ├── __init__.py
│   │   ├── stream_manager.py
│   │   └── uwe_pipeline.py
│   │
│   ├── training/      # Training & fine-tuning
│   │   ├── __init__.py
│   │   ├── dataset_prep.py   # Prepare & clean text/audio datasets
│   │   ├── stt_trainer.py    # Train/fine-tune Whisper or other ASR
│   │   ├── translation_trainer.py # Train/fine-tune MT models
│   │   └── tts_trainer.py    # Train/fine-tune TTS models
│   │
│   └── utils/         # Helpers (audio, language codes, etc.)
│       ├── __init__.py
│       └── audio_utils.py
│
├── datasets/          # Raw & processed datasets
│   ├── stt/           # Speech-to-Text data (wav + transcripts)
│   │   ├── hausa/
│   │   │   ├── train/...
│   │   │   └── test/...
│   │   ├── yoruba/
│   │   │   ├── train/...
│   │   │   └── test/...
│   │   └── igbo/
│   │       ├── train/...
│   │       └── test/...
│   │
│   ├── translation/   # Parallel text corpora
│   │   ├── yo-en.jsonl
│   │   ├── ha-en.jsonl
│   │   └── ig-en.jsonl
│   │
│   └── tts/           # TTS voices
│       ├── hausa/
│       │   ├── wavs/
│       │   └── metadata.csv
│       │
│       ├── yoruba/
│       │   ├── wavs/
│       │   └── metadata.csv
│       └── igbo/
│           ├── wavs/
│           │
│           └── metadata.csv
│
└── tests/             # Unit tests
    ├── test_stt.py
    ├── test_translation.py
    ├── test_tts.py
    └── test_pipeline.py
```

---

User Speech → STT (Whisper) → Language Detection → Translation → TTS → Audio Reply

---

## Installation

```bash
# clone the repo
git clone https://github.com/yourusername/uwetalk.git
cd uwetalk

# create virtual environment
python -m venv .venv
source .venv/bin/activate   # (Linux/Mac)
.venv\Scripts\activate      # (Windows)

# install dependencies
pip install -r requirements.txt
```

---

## Run Web Demo (Gradio)

```bash
python demo_web.py
```

Open your browser at [http://localhost:7860](http://localhost:7860).

---

## Run API (FastAPI)

```bash
uvicorn demo_api:app --reload --port 8000
```

API Docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Testing

```bash
pytest tests/
```

---

## Deployment Options

- **Hugging Face Spaces**: Free for quick demos.
- **Render / Railway / Fly.io**: Cloud deployment.
- **Docker**: Build portable containers.

---

## Roadmap

- [ ] Add more Nigerian languages (Efik, Tiv, Edo).
- [ ] Train custom Nigerian TTS voices.
- [ ] Mobile app (React Native).
- [ ] Business dashboard for API users.

---

## Contributing

We welcome contributions! Please open issues or PRs.

---

## License

MIT [./LICENSE](LICENSE) © 2025 UweTalk Team

---
