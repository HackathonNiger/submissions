import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Volume2, Loader2, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Translate = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("ha");
  const [supportedLanguages, setSupportedLanguages] = useState({});
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userCorrection, setUserCorrection] = useState("");
  const { toast } = useToast();

  // Load supported languages on component mount
  useEffect(() => {
    const loadSupportedLanguages = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/languages/`);
        if (response.ok) {
          const data = await response.json();
          setSupportedLanguages(data.supported_languages);
        }
      } catch (error) {
        console.error("Error loading supported languages:", error);
      }
    };
    
    loadSupportedLanguages();
  }, []);

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
          source_lang: sourceLanguage,
          target_lang: targetLanguage,
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
  }, [sourceLanguage, targetLanguage, toast]);

  // Auto-translate when input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performTranslation(inputText);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [inputText, performTranslation]);

  const handleVoiceRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice recording not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = sourceLanguage === 'en' ? 'en-US' : sourceLanguage;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Voice recognition failed",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleTextToSpeech = async () => {
    if (!outputText.trim()) {
      toast({
        title: "No text to speak",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/tts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: outputText,
          lang: targetLanguage,
          engine: "auto"
        }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error("TTS error:", error);
      toast({
        title: "Text-to-speech failed",
        description: "Could not generate audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const submitFeedback = async (rating: number) => {
    if (!inputText.trim() || !outputText.trim()) {
      toast({
        title: "Cannot submit feedback",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      await fetch(`${backendUrl}/feedback/translation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: inputText,
          translated_text: outputText,
          source_lang: sourceLanguage,
          target_lang: targetLanguage,
          user_rating: rating,
          user_correction: userCorrection || null
        }),
      });

      toast({
        title: "Feedback submitted",
        description: "Thank you for helping improve our translation quality!",
      });

      setUserRating(rating);
    } catch (error) {
      console.error("Feedback error:", error);
      toast({
        title: "Feedback failed",
        description: "Could not submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const submitCorrection = async () => {
    if (!userCorrection.trim()) {
      toast({
        title: "No correction provided",
        description: "Please enter a correction before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      await fetch(`${backendUrl}/feedback/correction/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_text: outputText,
          corrected_text: userCorrection,
          source_lang: sourceLanguage,
          target_lang: targetLanguage,
          correction_type: "translation"
        }),
      });

      toast({
        title: "Correction submitted",
        description: "Thank you for helping improve our translation model!",
      });

      setUserCorrection("");
    } catch (error) {
      console.error("Correction error:", error);
      toast({
        title: "Correction failed",
        description: "Could not submit correction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">UweTalk Translation</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Translate between English and Nigerian indigenous languages with voice support
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Input Text</h2>
              <div className="flex gap-2">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(supportedLanguages).map(([name, code]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceRecording}
                  disabled={isRecording}
                  className="flex items-center gap-2"
                >
                  <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? 'Recording...' : 'Voice'}
                </Button>
              </div>
            </div>
            
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate or use voice input..."
              className="min-h-[200px] resize-none"
            />
          </Card>

          {/* Output Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Translation</h2>
              <div className="flex gap-2">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(supportedLanguages).map(([name, code]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTextToSpeech}
                  disabled={!outputText.trim()}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  Speak
                </Button>
              </div>
            </div>
            
            <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating...
                </div>
              ) : outputText ? (
                <p className="text-foreground">{outputText}</p>
              ) : (
                <p className="text-muted-foreground">Translation will appear here...</p>
              )}
            </div>

            {/* Feedback Section */}
            {outputText && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rate this translation:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => submitFeedback(star)}
                        className={`p-1 h-auto ${userRating === star ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      >
                        <Star className="h-4 w-4" fill={userRating === star ? 'currentColor' : 'none'} />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Suggest a correction:</label>
                  <div className="flex gap-2">
                    <Textarea
                      value={userCorrection}
                      onChange={(e) => setUserCorrection(e.target.value)}
                      placeholder="Enter your correction here..."
                      className="flex-1"
                    />
                    <Button
                      onClick={submitCorrection}
                      disabled={!userCorrection.trim()}
                      size="sm"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Translate;