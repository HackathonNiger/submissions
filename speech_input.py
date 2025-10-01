import speech_recognition as sr

class SpeechInput:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def listen(self, prompt="Speak/Type now..."):
        print(f"\n[{prompt}] 🎙️ Listening...")
        try:
            with sr.Microphone() as source:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            return self.recognizer.recognize_google(audio)
        except Exception:
            # fallback: manual typing
            return input(f"[{prompt}] (typing fallback): ")
