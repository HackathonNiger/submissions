'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { 
  ShoppingCart, Utensils, GraduationCap, Heart, Car, 
  Plane, Home, Gamepad2, ArrowRight, CheckCircle, 
  Clock, Shield, Zap, Users, Star, Play
} from 'lucide-react';

const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  return { ref, inView };
};

export default function UseCases() {
  const [activeCase, setActiveCase] = useState(0);
  
  const heroAnimation = useScrollAnimation();
  const casesAnimation = useScrollAnimation();
  const benefitsAnimation = useScrollAnimation();

  const useCases = [
    {
      id: 'retail',
      icon: ShoppingCart,
      title: 'Retail Shopping',
      subtitle: 'Seamless in-store and online purchases',
      description: 'Transform the shopping experience with instant biometric checkout. No more fumbling for cards or remembering passwords.',
      scenario: 'Sarah walks into her favorite clothing store, picks up a dress, and simply looks at the checkout camera. Payment complete in 2 seconds.',
      benefits: ['70% faster checkout', 'Zero fraud risk', 'No forgotten cards', 'Seamless experience'],
      color: 'blue',
      stats: { time: '2 seconds', satisfaction: '98%', adoption: '85%' }
    },
    {
      id: 'dining',
      icon: Utensils,
      title: 'Restaurant Dining',
      subtitle: 'Pay for meals without touching anything',
      description: 'Enable contactless payments at restaurants, cafes, and food courts. Perfect for the post-pandemic world.',
      scenario: 'John finishes his meal, says "Pay with GestPay" to the server, and his voice authorizes the payment instantly.',
      benefits: ['Contactless payments', 'Split bills easily', 'No physical menus needed', 'Faster table turnover'],
      color: 'green',
      stats: { time: '5 seconds', satisfaction: '96%', adoption: '78%' }
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Campus Payments',
      subtitle: 'Student life made simple',
      description: 'Students can pay for meals, books, parking, and services across campus using just their biometrics.',
      scenario: 'Emma buys lunch at the cafeteria, pays for parking, and purchases textbooks - all with her face, no student ID needed.',
      benefits: ['No lost student cards', 'Parent spending controls', 'Campus-wide integration', 'Budget tracking'],
      color: 'purple',
      stats: { time: '3 seconds', satisfaction: '94%', adoption: '92%' }
    },
    {
      id: 'healthcare',
      icon: Heart,
      title: 'Healthcare Services',
      subtitle: 'Secure medical payments',
      description: 'HIPAA-compliant biometric payments for medical services, prescriptions, and healthcare facilities.',
      scenario: 'Dr. Martinez completes a consultation and the patient pays using voice authentication, with insurance automatically processed.',
      benefits: ['HIPAA compliant', 'Insurance integration', 'Prescription payments', 'Appointment booking'],
      color: 'red',
      stats: { time: '4 seconds', satisfaction: '97%', adoption: '73%' }
    },
    {
      id: 'transport',
      icon: Car,
      title: 'Transportation',
      subtitle: 'Frictionless travel payments',
      description: 'Pay for rides, parking, tolls, and public transport without stopping or touching anything.',
      scenario: 'Mike drives through a toll booth, the camera recognizes his face, and the toll is automatically charged to his account.',
      benefits: ['No stopping for tolls', 'Automatic ride payments', 'Parking integration', 'Public transport access'],
      color: 'yellow',
      stats: { time: '1 second', satisfaction: '99%', adoption: '67%' }
    },
    {
      id: 'entertainment',
      icon: Gamepad2,
      title: 'Entertainment',
      subtitle: 'Fun without friction',
      description: 'Pay for movies, games, events, and entertainment venues using biometric authentication.',
      scenario: 'Lisa enters a movie theater, her face is recognized, and her pre-ordered tickets and snacks are automatically charged.',
      benefits: ['Skip ticket lines', 'Concession payments', 'Event access', 'Gaming purchases'],
      color: 'pink',
      stats: { time: '2 seconds', satisfaction: '95%', adoption: '81%' }
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Average transaction time reduced from 30 seconds to under 5 seconds',
      stat: '83% faster'
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Biometric authentication provides stronger security than cards or passwords',
      stat: '100% fraud reduction'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Real-time processing with immediate confirmation and receipts',
      stat: '<100ms processing'
    },
    {
      icon: Users,
      title: 'Better Experience',
      description: 'Customers love the convenience and simplicity of biometric payments',
      stat: '96% satisfaction'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-space">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50" ref={heroAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`${heroAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-space">
                Real-World
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Use Cases
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover how biometric payments are transforming everyday experiences 
                across industries and making life more convenient for everyone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started">
                  <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center">
                    Try It Yourself
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white" ref={casesAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${casesAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Transforming Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how biometric payments are revolutionizing the way people pay across different sectors
            </p>
          </div>

          {/* Use Case Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {useCases.map((useCase, index) => (
              <button
                key={useCase.id}
                onClick={() => setActiveCase(index)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeCase === index
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <useCase.icon className="w-5 h-5 mr-2" />
                {useCase.title}
              </button>
            ))}
          </div>

          {/* Active Use Case */}
          <div className={`${casesAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    useCases[activeCase].color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    useCases[activeCase].color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    useCases[activeCase].color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    useCases[activeCase].color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    useCases[activeCase].color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-br from-pink-500 to-pink-600'
                  }`}>
                    {React.createElement(useCases[activeCase].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 font-space">
                    {useCases[activeCase].title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {useCases[activeCase].subtitle}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {useCases[activeCase].description}
                  </p>

                  {/* Scenario */}
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Real Scenario:</h4>
                    <p className="text-gray-600 italic">"{useCases[activeCase].scenario}"</p>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-3">
                    {useCases[activeCase].benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaction Time</span>
                        <span className="font-bold text-primary">{useCases[activeCase].stats.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer Satisfaction</span>
                        <span className="font-bold text-green-600">{useCases[activeCase].stats.satisfaction}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Adoption Rate</span>
                        <span className="font-bold text-blue-600">{useCases[activeCase].stats.adoption}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Customer Feedback</h4>
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-600">4.8/5</span>
                    </div>
                    <p className="text-gray-600 text-sm italic">
                      "So much faster and more convenient than traditional payments. 
                      I love not having to carry cards anymore!"
                    </p>
                  </div>

                  <Link href="/get-started">
                    <button className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      useCases[activeCase].color === 'blue' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' :
                      useCases[activeCase].color === 'green' ? 'bg-green-50 text-green-600 hover:bg-green-100' :
                      useCases[activeCase].color === 'purple' ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' :
                      useCases[activeCase].color === 'red' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                      useCases[activeCase].color === 'yellow' ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' :
                      'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }`}>
                      Try This Use Case
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50" ref={benefitsAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${benefitsAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Universal Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No matter the industry, biometric payments deliver consistent advantages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center ${benefitsAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-space">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                <div className="text-2xl font-bold text-primary">
                  {benefit.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              More Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Biometric payments are transforming experiences across all sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Plane, title: 'Travel & Tourism', desc: 'Airport security, hotel check-ins, travel bookings' },
              { icon: Home, title: 'Real Estate', desc: 'Property viewings, rent payments, security deposits' },
              { icon: GraduationCap, title: 'Education', desc: 'Tuition payments, campus services, online courses' },
              { icon: Heart, title: 'Healthcare', desc: 'Medical payments, prescription pickups, appointments' },
              { icon: Car, title: 'Automotive', desc: 'Car purchases, service payments, insurance claims' },
              { icon: Gamepad2, title: 'Gaming', desc: 'In-game purchases, tournament fees, arcade payments' }
            ].map((industry, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <industry.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 font-space">{industry.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 font-space">
            Ready to Transform Your Industry?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using GestPay to revolutionize their customer experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Your Journey
              </button>
            </Link>
            <Link href="/solutions">
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
                Explore Solutions
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
