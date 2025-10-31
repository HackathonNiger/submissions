import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Key, Send } from "lucide-react";

const Api = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">API Documentation</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Integrate Uwe Talk AI translation into your applications
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Getting Started</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              To use the Uwe Talk AI API, you'll need an API key. Contact us to get yours.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <code className="text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </Card>

          {/* Translation Endpoint */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Send className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold">Translation Endpoint</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary">POST</Badge>
                  <code className="text-sm">/api/translate</code>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Request Body</h3>
                <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
{`{
  "input_type": "text",
  "content": "Hello, how are you?",
  "target_language": "hausa"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Response</h3>
                <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
{`{
  "text_translation": "Sannu, yaya kake?",
  "audio_url": "https://yourapp.com/audio/translation_123.mp3",
  "status": "success"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </Card>

          {/* Audio Translation */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold">Audio Translation</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Audio Input</h3>
                <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
{`{
  "input_type": "audio",
  "content": "base64_encoded_audio",
  "target_language": "hausa"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Supported Formats</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">MP3</Badge>
                  <Badge variant="outline">WAV</Badge>
                  <Badge variant="outline">M4A</Badge>
                  <Badge variant="outline">WEBM</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Rate Limits */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold text-primary">100</p>
                <p className="text-sm text-muted-foreground">Requests per minute</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold text-accent">10,000</p>
                <p className="text-sm text-muted-foreground">Requests per day</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold text-secondary">5MB</p>
                <p className="text-sm text-muted-foreground">Max file size</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Api;
