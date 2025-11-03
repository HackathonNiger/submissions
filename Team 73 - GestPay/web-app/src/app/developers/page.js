'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { 
  Code, Book, Download, Play, ArrowRight, CheckCircle, 
  Terminal, Smartphone, Globe, Shield, Zap, Copy,
  ExternalLink, Github, FileText, Headphones
} from 'lucide-react';

const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  return { ref, inView };
};

export default function Developers() {
  const [activeTab, setActiveTab] = useState('rest');
  const [copiedCode, setCopiedCode] = useState('');
  
  const heroAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const sdkAnimation = useScrollAnimation();

  const codeExamples = {
    rest: `curl -X POST https://api.gestpay.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 10000,
    "currency": "NGN",
    "payment_method": "facepay",
    "customer_id": "customer_123",
    "description": "Payment for order #1234"
  }'`,
    
    javascript: `import { GestPay } from '@gestpay/sdk';

const gestpay = new GestPay('your_api_key');

// Initialize FacePay
const payment = await gestpay.facePay({
  amount: 10000,
  currency: 'NGN',
  customerId: 'customer_123',
  onSuccess: (result) => {
    console.log('Payment successful:', result);
  },
  onError: (error) => {
    console.error('Payment failed:', error);
  }
});`,
    
    python: `import gestpay

# Initialize the client
client = gestpay.Client('your_api_key')

# Create a payment
payment = client.payments.create({
    'amount': 10000,
    'currency': 'NGN',
    'payment_method': 'voicepay',
    'customer_id': 'customer_123',
    'description': 'Payment for order #1234'
})

print(f"Payment ID: {payment.id}")
print(f"Status: {payment.status}")`
  };

  const copyToClipboard = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-space">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50" ref={heroAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`${heroAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-space">
                Build with
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  GestPay APIs
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Integrate biometric payments into your applications with our powerful APIs, 
                comprehensive SDKs, and developer-friendly documentation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center">
                  <Book className="w-5 h-5 mr-2" />
                  View Documentation
                </button>
                <Link href="/get-started">
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                    Get API Keys
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  RESTful APIs
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Multiple SDKs
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Sandbox Environment
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Start Building in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, powerful APIs that get you up and running quickly
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Code Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'rest', label: 'cURL', icon: Terminal },
                { id: 'javascript', label: 'JavaScript', icon: Code },
                { id: 'python', label: 'Python', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white bg-gray-800 border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="relative">
              <button
                onClick={() => copyToClipboard(codeExamples[activeTab], activeTab)}
                className="absolute top-4 right-4 flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copiedCode === activeTab ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
              
              <pre className="p-6 text-gray-300 overflow-x-auto">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" ref={featuresAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${featuresAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Everything You Need to Build
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources for seamless integration
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Book,
                title: 'Comprehensive Documentation',
                description: 'Detailed guides, API references, and tutorials to get you started quickly.',
                features: ['Interactive API explorer', 'Code examples', 'Integration guides', 'Best practices'],
                color: 'blue'
              },
              {
                icon: Terminal,
                title: 'Powerful APIs',
                description: 'RESTful APIs with webhooks, real-time updates, and comprehensive error handling.',
                features: ['RESTful endpoints', 'Webhook support', 'Real-time notifications', 'Rate limiting'],
                color: 'green'
              },
              {
                icon: Shield,
                title: 'Sandbox Environment',
                description: 'Test your integration safely with our full-featured sandbox environment.',
                features: ['Test API keys', 'Mock transactions', 'Debug tools', 'Performance monitoring'],
                color: 'purple'
              }
            ].map((feature, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${featuresAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-space">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs Section */}
      <section className="py-20 bg-white" ref={sdkAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${sdkAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              SDKs for Every Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Native SDKs and libraries for your favorite programming languages and platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'JavaScript', icon: '🟨', description: 'Web and Node.js', downloads: '50k+' },
              { name: 'Python', icon: '🐍', description: 'Django, Flask, FastAPI', downloads: '30k+' },
              { name: 'React Native', icon: '⚛️', description: 'iOS and Android', downloads: '25k+' },
              { name: 'PHP', icon: '🐘', description: 'Laravel, Symfony', downloads: '20k+' },
              { name: 'Java', icon: '☕', description: 'Spring Boot, Android', downloads: '18k+' },
              { name: 'C#', icon: '🔷', description: '.NET Core, Xamarin', downloads: '15k+' },
              { name: 'Ruby', icon: '💎', description: 'Rails, Sinatra', downloads: '12k+' },
              { name: 'Go', icon: '🐹', description: 'Gin, Echo, Fiber', downloads: '10k+' }
            ].map((sdk, index) => (
              <div key={index} className={`bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer ${sdkAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 50}` : 'opacity-0'}`}>
                <div className="text-center">
                  <div className="text-3xl mb-3">{sdk.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{sdk.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{sdk.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{sdk.downloads} downloads</span>
                    <Download className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Developer Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed with GestPay integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: 'Video Tutorials',
                description: 'Step-by-step video guides for common integration scenarios',
                link: '#',
                color: 'red'
              },
              {
                icon: Github,
                title: 'Sample Applications',
                description: 'Complete example applications in various frameworks',
                link: '#',
                color: 'gray'
              },
              {
                icon: FileText,
                title: 'API Reference',
                description: 'Complete API documentation with interactive examples',
                link: '#',
                color: 'blue'
              },
              {
                icon: Headphones,
                title: 'Developer Support',
                description: '24/7 technical support for integration questions',
                link: '#',
                color: 'green'
              },
              {
                icon: Globe,
                title: 'Community Forum',
                description: 'Connect with other developers and share knowledge',
                link: '#',
                color: 'purple'
              },
              {
                icon: Zap,
                title: 'Status Page',
                description: 'Real-time API status and performance monitoring',
                link: '#',
                color: 'yellow'
              }
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className={`w-12 h-12 bg-${resource.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <resource.icon className={`w-6 h-6 text-${resource.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-space">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
                  <span className="text-sm font-medium">Learn more</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 font-space">
            Ready to Start Building?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get your API keys and start integrating biometric payments today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Get API Keys
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
