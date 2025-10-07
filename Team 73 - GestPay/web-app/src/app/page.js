
'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { 
  Scan, Shield, Zap, Users, ArrowRight, CheckCircle, 
  Star, Globe, Smartphone, Code, Building2, CreditCard, 
  Lock, Eye, AlertTriangle, Database, Play, ChevronRight,
  MessageSquare, Mic, Camera, Hand, TrendingUp, BarChart3,
  PieChart, DollarSign, Clock, Award, FileText, Headphones,
  Store, UserCheck, Briefcase
} from 'lucide-react';
import Link from 'next/link';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  return { ref, inView };
};

export default function Home() {
  const featuresAnimation = useScrollAnimation();
  const statsAnimation = useScrollAnimation();
  const securityAnimation = useScrollAnimation();
  const whoWeServeAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white font-space">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="animate-fadeInUp delay-200">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  <Zap className="w-4 h-4 mr-2" />
                  Next-Generation Payment Platform
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-space">
                Accept payments with
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  biometric technology
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Enable your customers to pay using their face, voice, or gestures. 
                Secure, instant, and seamless transactions without cards or cash.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/get-started"><button className="group bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                  Create free account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button></Link>
                <Link href="/get-started"><button className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" />
                  See how it works
                </button></Link>
              </div>
              
              {/* Trust Indicators */}
              {/* <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  PCI DSS Compliant
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  99.99% Uptime
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-purple-500" />
                  ISO 27001 Certified
                </div>
              </div> */}
            </div>
            
            {/* Right Content - Hero Image/Dashboard */}
            <div className="relative animate-fadeInUp delay-400">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Image 
                      src="/logo.png" 
                      alt="GestPay" 
                      width={24} 
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-semibold text-gray-900">GestPay Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-500">Live</span>
                  </div>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">₦2.4M</div>
                      <div className="text-sm text-gray-600">Today's Volume</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-gray-600">Transactions</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">99.8%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Recent Transactions</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Camera className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">FacePay Transaction</span>
                        </div>
                        <span className="text-sm font-medium">₦15,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Mic className="w-4 h-4 text-green-500" />
                          <span className="text-sm">VoicePay Transaction</span>
                        </div>
                        <span className="text-sm font-medium">₦8,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">SocialPay Transfer</span>
                        </div>
                        <span className="text-sm font-medium">₦3,200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-white p-3 rounded-full animate-float">
                <Shield className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full animate-float delay-200">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white" ref={featuresAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${featuresAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Our Payment Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge biometric payment technologies designed for the modern world
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FacePay */}
            <div className={`group bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 ${featuresAnimation.inView ? 'animate-fadeInUp delay-100' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-space">FacePay</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Secure facial recognition payments with advanced AI verification and 
                location-based security protocols for ultimate protection.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Instant face enrollment
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Anti-spoofing technology
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Geolocation verification
                </li>
              </ul>
              <button className="text-primary font-semibold hover:text-primary/80 transition-colors group-hover:translate-x-2 transform duration-300 flex items-center">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* VoicePay */}
            <div className={`group bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 ${featuresAnimation.inView ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-space">VoicePay</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Voice biometric authentication analyzing unique vocal patterns, 
                pitch, and tone for secure payment authorization.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Unique voiceprint creation
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Multi-factor voice analysis
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Secure phrase protection
                </li>
              </ul>
              <button className="text-primary font-semibold hover:text-primary/80 transition-colors group-hover:translate-x-2 transform duration-300 flex items-center">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* SocialPay */}
            <div className={`group bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 ${featuresAnimation.inView ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-space">SocialPay</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Seamless money transfers through WhatsApp and Telegram with 
                natural language processing for instant transactions.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  WhatsApp & Telegram bots
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Natural language commands
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                  Instant fund transfers
                </li>
              </ul>
              <button className="text-primary font-semibold hover:text-primary/80 transition-colors group-hover:translate-x-2 transform duration-300 flex items-center">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-primary text-white" ref={statsAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className={`${statsAnimation.inView ? 'animate-fadeInUp delay-100' : 'opacity-0'}`}>
              <div className="text-4xl font-bold mb-2 animate-bounce">1M+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div className={`${statsAnimation.inView ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="text-4xl font-bold mb-2 animate-bounce">99.9%</div>
              <div className="text-blue-100">Accuracy Rate</div>
            </div>
            <div className={`${statsAnimation.inView ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
              <div className="text-4xl font-bold mb-2 animate-bounce">&lt;100ms</div>
              <div className="text-blue-100">Verification Speed</div>
            </div>
            <div className={`${statsAnimation.inView ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
              <div className="text-4xl font-bold mb-2 animate-bounce">50+</div>
              <div className="text-blue-100">Countries Supported</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Who We Serve Section */}
      <section className="py-20 bg-gray-50" ref={whoWeServeAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${whoWeServeAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From individual consumers to enterprise businesses, our biometric payment solutions scale to meet your needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Individual Users */}
            <div className={`${whoWeServeAnimation.inView ? 'animate-fadeInUp delay-100' : 'opacity-0'}`}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-space">Individual Users</h3>
                    <p className="text-gray-600">Personal payment solutions</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure Personal Payments</h4>
                      <p className="text-gray-600 text-sm">Pay with your face or voice for ultimate convenience</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Social Transfers</h4>
                      <p className="text-gray-600 text-sm">Send money through WhatsApp and Telegram</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Privacy Protection</h4>
                      <p className="text-gray-600 text-sm">Your biometric data stays encrypted and secure</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-50 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Merchants */}
            <div className={`${whoWeServeAnimation.inView ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-space">Merchants</h3>
                    <p className="text-gray-600">Business payment integration</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Easy Integration</h4>
                      <p className="text-gray-600 text-sm">Simple APIs and SDKs for quick setup</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Reduced Fraud</h4>
                      <p className="text-gray-600 text-sm">Biometric verification eliminates chargebacks</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-time Analytics</h4>
                      <p className="text-gray-600 text-sm">Comprehensive dashboard and reporting</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-50 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors">
                  Start Integration
                </button>
              </div>
            </div>

            {/* Developers */}
            <div className={`${whoWeServeAnimation.inView ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-space">Developers</h3>
                    <p className="text-gray-600">Build with our platform</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Comprehensive APIs</h4>
                      <p className="text-gray-600 text-sm">RESTful APIs with detailed documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Multiple SDKs</h4>
                      <p className="text-gray-600 text-sm">iOS, Android, Web, and backend libraries</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Sandbox Environment</h4>
                      <p className="text-gray-600 text-sm">Test and develop without real transactions</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-purple-50 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bank-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multi-layered security approach with advanced AI and biometric technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Layer Verification</h3>
                    <p className="text-gray-600">Combines biometrics, geolocation, and device binding for ultimate security.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Anti-Spoofing AI</h3>
                    <p className="text-gray-600">Advanced AI detects photos, recordings, and deepfakes to prevent fraud.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy-First Storage</h3>
                    <p className="text-gray-600">Biometric data is hashed and encrypted, never stored in raw format.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Process</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <span className="text-gray-700">Biometric Capture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="text-gray-700">AI Verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="text-gray-700">Location Check</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <span className="text-gray-700">Payment Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Payments?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses already using GestPay for seamless biometric payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
         Get Started
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
              Contact us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
