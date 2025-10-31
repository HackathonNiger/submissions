import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Languages, Mic, Globe, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
              <span className="text-gradient">Uwe Talk AI</span>
              <br />
              <span className="text-foreground">Translation Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Powerful English to Hausa translation with voice support. 
              Built for everyone, from individuals to businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/translate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  Start Translating
                </Button>
              </Link>
              <Link to="/api">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-primary/50">
                  View API Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">Uwe Talk AI</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced AI-powered translation with multiple input methods and business-ready API
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Languages className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accurate Translation</h3>
              <p className="text-muted-foreground">
                AI-powered translation engine trained on extensive Hausa language data
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Voice Support</h3>
              <p className="text-muted-foreground">
                Speak or listen with our speech-to-text and text-to-speech features
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Business API</h3>
              <p className="text-muted-foreground">
                Integrate Hausa translation directly into your applications
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Continuous Learning</h3>
              <p className="text-muted-foreground">
                Our AI model improves daily with new training data uploads
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to break language barriers?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands using Uwe Talk AI for personal and business translation needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/translate">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                    Try it Free
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button size="lg" variant="outline" className="px-8 border-primary/50">
                    Admin Access
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
