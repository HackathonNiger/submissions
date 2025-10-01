import gradio as gr
from uwetalk.pipeline.uwe_pipeline import UwePipeline

pipeline = UwePipeline()

def gradio_pipeline(audio, target_lang):
    result = pipeline.run(audio, target_lang)
    return result["translated_text"], result["audio_file"]

demo = gr.Interface(
    fn=gradio_pipeline,
    inputs=[
        gr.Audio(sources=["microphone"], streaming=True, type="filepath", label="🎤 Live Speech"),
        gr.Dropdown(["en", "fr", "yo", "ha", "ig"], value="en", label="🌍 Target Language"),
    ],
    outputs=[
        gr.Textbox(label="📝 Text Output"),
        gr.Audio(type="filepath", label="🔊 Translated Speech"),
    ],
    live=True,
    title="UweTalk 🌍",
    description="Real-time speech → translation → speech."
)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
