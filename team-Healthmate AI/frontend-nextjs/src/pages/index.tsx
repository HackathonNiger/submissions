import React from 'react';
import Link from 'next/link';
import { Heart, Stethoscope, Lightbulb, Book, MessageCircle, Phone, Cross, Building2, ChevronRight, Globe } from '@/components/icons';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Medical symbols floating animation */}
          <div className="absolute top-20 left-10 animate-bounce delay-1000">
            <Stethoscope className="w-8 h-8 text-green-300 opacity-60" />
          </div>
          <div className="absolute top-32 right-20 animate-pulse delay-2000">
            <Heart className="w-6 h-6 text-red-300 opacity-50" />
          </div>
          <div className="absolute bottom-40 left-1/4 animate-bounce delay-3000">
            <Cross className="w-7 h-7 text-blue-300 opacity-40" />
          </div>
          <div className="absolute top-1/2 right-10 animate-pulse delay-500">
            <Book className="w-5 h-5 text-purple-300 opacity-60" />
          </div>
          
          {/* African/Nigerian inspired patterns */}
          <div className="absolute top-10 right-1/3 w-32 h-32 border-2 border-green-200 rounded-full opacity-20 animate-spin-slow"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 border border-emerald-300 rounded-full opacity-30 animate-ping-slow"></div>
          
          {/* Stars representing excellence */}
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-twinkle delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="hero-logo mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl animate-heartbeat">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-300">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                HealthMate AI
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-green-600" />
              <p className="text-2xl font-medium text-gray-700">
                Your Multilingual Health Companion
              </p>
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-500">
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              🇳🇬 Solving Nigeria's critical health challenges with AI-powered guidance in <strong>your language</strong>
            </p>
            <div className="flex flex-wrap justify-center items-center space-x-4 mb-8 text-lg">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">English</span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">Yoruba</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">Hausa</span>
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">Igbo</span>
              <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-medium">Pidgin</span>
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Health Chat
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/symptoms"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Check Symptoms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Comprehensive Health Solutions</h2>
            <p className="text-2xl text-gray-600 mb-4">Powered by AI, Designed for Nigeria</p>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Symptom Checker Card */}
            <div className="group feature-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="feature-icon mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300">
                  <Stethoscope className="w-10 h-10 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Symptom Analysis</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get instant AI-powered symptom analysis in your native language - Yoruba, Hausa, Igbo & more
              </p>
              <Link 
                href="/symptoms" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-bold text-lg group-hover:translate-x-2 transition-transform duration-300"
              >
                Check Symptoms <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Health Chat Card */}
            <div className="group feature-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="feature-icon mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300">
                  <MessageCircle className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold">🇳🇬</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Smart Health Chat</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Chat with our AI health assistant in pidgin, Yoruba, Hausa - get personalized health guidance
              </p>
              <Link 
                href="/chat" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold text-lg group-hover:translate-x-2 transition-transform duration-300"
              >
                Start Chatting <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Health Awareness Card */}
            <div className="group feature-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="feature-icon mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                  <Book className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold">📚</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Health Education</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Learn about health topics relevant to Nigeria - malaria, diabetes, hypertension in local languages
              </p>
              <Link 
                href="/awareness" 
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-bold text-lg group-hover:translate-x-2 transition-transform duration-300"
              >
                Learn More <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Emergency Support Card */}
            <div className="group feature-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-red-200 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="feature-icon mb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center group-hover:from-red-500 group-hover:to-orange-500 transition-all duration-300">
                  <Phone className="w-10 h-10 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">Emergency Support</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Quick access to emergency services and first aid guidance for critical health situations
              </p>
              <Link 
                href="/first-aid" 
                className="inline-flex items-center text-red-600 hover:text-red-700 font-bold text-lg group-hover:translate-x-2 transition-transform duration-300"
              >
                Get Help <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nigerian Focus Section */}
      <section className="trust-section py-24 bg-gradient-to-r from-green-500 to-emerald-600 relative overflow-hidden">
        {/* Nigerian flag inspired pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-white mb-6">Built for Nigeria 🇳🇬</h2>
            <p className="text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Breaking down language barriers in healthcare. Get medical guidance in <strong>your mother tongue</strong> - because health information should be accessible to everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white animate-fade-in-up delay-300">
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-xl">Nigerian Languages</div>
              <div className="text-green-100 mt-2">English, Yoruba, Hausa, Igbo, Pidgin</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white animate-fade-in-up delay-500">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl">AI Health Support</div>
              <div className="text-green-100 mt-2">Always available when you need us</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white animate-fade-in-up delay-700">
              <div className="text-4xl font-bold mb-2">🏥</div>
              <div className="text-xl">Nigerian Healthcare</div>
              <div className="text-green-100 mt-2">Focused on local health challenges</div>
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-900">
            <p className="text-xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              <strong>Important:</strong> HealthMate AI provides educational information to help you make informed health decisions. 
              Always consult licensed healthcare professionals for diagnosis, treatment, and medical emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Resources Section */}
      <section className="emergency-section py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Emergency Resources</h2>
            <p className="text-xl text-gray-600 mb-6">Quick access to important health contacts</p>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="emergency-card bg-white rounded-xl p-8 shadow-custom hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Emergency Services</h3>
              <p className="text-gray-600 mb-6">
                Immediate assistance for life-threatening situations
              </p>
              <a 
                href="tel:112" 
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 animate-pulse"
              >
                <Phone className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="text-lg font-bold">112</div>
                  <div className="text-sm">Emergency Call</div>
                </div>
              </a>
            </div>
            
            <div className="emergency-card bg-white rounded-xl p-8 shadow-custom hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Cross className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">First Aid Guides</h3>
              <p className="text-gray-600 mb-6">
                Step-by-step instructions for common emergency situations
              </p>
              <Link 
                href="/first-aid" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                View Guides <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="emergency-card bg-white rounded-xl p-8 shadow-custom hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Hospitals</h3>
              <p className="text-gray-600 mb-6">
                Locate nearby healthcare facilities and emergency rooms
              </p>
              <button className="inline-flex items-center text-primary hover:text-primary-dark font-medium">
                Find Nearby <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">HealthMate AI</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 HealthMate AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}