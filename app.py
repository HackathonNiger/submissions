import gradio as gr
from tts_engine import TTSEngine
from translation import Translator, CustomTranslator
from data_manager import save_uploaded_file, convert_to_jsonl
from training.train_translation import train_from_jsonl
from stt_engine import STTEngine
import os

# Init engines
stt_engine = STTEngine()
tts_engine = TTSEngine(use_coqui=True)
translator = CustomTranslator() if os.path.exists("./training/outputs/model") else Translator()

LANGUAGES = ["english", "yoruba", "igbo", "hausa", "pidgin", "esan", "tiv", "calabar", "benin"]

def handle_conversation(audio, src_lang, tgt_lang, clone_voice):
    if audio is None:
        return "", None

    # Step 1: Speech to Text
    text = stt_engine.transcribe(audio, language=src_lang)

    # Step 2: Translate
    translated = translator.translate(text, src_lang, tgt_lang)

    # Step 3: Text to Speech
    audio_path = tts_engine.speak(translated, lang=tgt_lang, voice_clone=clone_voice)

    return translated, audio_path

def admin_upload(file):
    file_path = save_uploaded_file(file, file.name)
    jsonl_path = convert_to_jsonl(file_path)
    train_from_jsonl(jsonl_path)
    return "✅ Training done. Model updated!"

with gr.Blocks(title="🌍 Two-Way Voice Translator") as demo:
    gr.Markdown("# 🌍 Nigerian Two-Way Voice Translator")
    with gr.Tab("Translator"):
        with gr.Row():
            src_lang = gr.Dropdown(LANGUAGES, value="english", label="Speaker A Language")
            tgt_lang = gr.Dropdown(LANGUAGES, value="hausa", label="Speaker B Language")

        with gr.Row():
            audio_in = gr.Audio(sources=["microphone"], type="filepath", label="🎤 Speak")
            translated = gr.Textbox(label="Translated Text", interactive=False)
            audio_out = gr.Audio(label="🔊 Translation Audio")

        clone_voice = gr.Checkbox(value=False, label="🎙️ Use my cloned voice (if my_voice.wav exists)")

        audio_in.change(
            handle_conversation,
            inputs=[audio_in, src_lang, tgt_lang, clone_voice],
            outputs=[translated, audio_out]
        )

    with gr.Tab("Admin (Training)"):
        gr.Markdown("Upload Hausa ↔ English data (.csv, .xlsx, .tsv, .jsonl)")
        file_in = gr.File(label="Upload dataset")
        train_btn = gr.Button("🚀 Train Model")
        output_box = gr.Textbox(label="Training Status")
        train_btn.click(admin_upload, inputs=file_in, outputs=output_box)

demo.launch()
