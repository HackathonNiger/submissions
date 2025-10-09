import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Translate = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // This function now contains the core translation logic
  const performTranslation = useCallback(async (text: string) => {
    if (!text.trim()) {
      setOutputText(""); // Clear output if input is empty
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          source_lang: 'en',
          target_lang: 'ha',
        }),
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();
      setOutputText(data.translated_text);

    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "Could not connect to the translation service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // useEffect for automatic translation with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      performTranslation(inputText);
    }, 500); // 500ms delay after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [inputText, performTranslation]);

  const handleTranslate = () => {
    performTranslation(inputText);
  };

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition 
      || (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = "en-US";
    recognition.continuous = false;
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event: Event) => {
      const speechEvent = event as unknown as { results: { transcript: string }[][] };
      const transcript = speechEvent.results[0][0].transcript;
      setInputText(transcript);
    };
      
    
    recognition.onerror = () => {
      toast({
        title: "Recording failed",
        description: "Could not capture voice input",
        variant: "destructive",
      });
      setIsRecording(false);
    };
    
    recognition.start();
  };

  const handlePlayAudio = async () => {
    if (!outputText) return;

    // URL to your FastAPI backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${backendUrl}/tts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: outputText,
          lang: 'ha', // Hausa
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio from backend');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error("Audio playback error:", error);
      toast({
        title: "Audio playback failed",
        description: "Could not play audio from the backend.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Uwe Talk AI Translation</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Instant English to Hausa translation with voice support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">English</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isRecording}
                className="gap-2"
              >
                <Mic className={`h-4 w-4 ${isRecording ? "text-destructive animate-pulse" : ""}`} />
                {isRecording ? "Listening..." : "Voice Input"}
              </Button>
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or speak your text here..."
              className="min-h-[200px] resize-none"
            />
            <Button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="w-full mt-4 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate to Hausa"
              )}
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Hausa</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayAudio}
                disabled={!outputText}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Play Audio
              </Button>
            </div>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Translation will appear here..."
              className="min-h-[200px] resize-none bg-muted/50"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Translate;
