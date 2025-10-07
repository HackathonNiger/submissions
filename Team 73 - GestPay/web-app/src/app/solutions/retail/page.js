'use client';

import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/landing/Header';
import Footer from '../../../components/landing/Footer';
import { 
  Store, ArrowRight, CheckCircle, TrendingUp, Shield, 
  Zap, Users, BarChart3, Smartphone, Clock, ShoppingCart,
  CreditCard, Eye, Camera, Mic, MessageSquare
} from 'lucide-react';

const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  return { ref, inView };
};

export default function RetailSolution() {
  const heroAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const benefitsAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white font-space">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50" ref={heroAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`${heroAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight font-space">
                Retail & E-commerce
                <span className="block text-blue-600">Payment Solutions</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your customer checkout experience with biometric payments. 
                Reduce cart abandonment, eliminate fraud, and create seamless shopping experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/get-started">
                  <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
            
            <div className={`${heroAnimation.inView ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Checkout Experience</h3>
                  <p className="text-gray-600">See how customers pay with biometrics</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">Total: ₦15,750</span>
                    </div>
                    <span className="text-green-600 font-semibold">Ready</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Camera className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <span className="text-xs text-blue-600">Face</span>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Mic className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <span className="text-xs text-green-600">Voice</span>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-xs text-purple-600">Social</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="text-green-600 font-semibold">Payment Successful!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" ref={featuresAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${featuresAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Complete Retail Payment Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to accept biometric payments in-store and online
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className={`${featuresAnimation.inView ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 font-space">
                In-Store Solutions
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Store,
                    title: 'Biometric POS Terminals',
                    description: 'Advanced point-of-sale systems with built-in biometric scanners for face and voice recognition.'
                  },
                  {
                    icon: Smartphone,
                    title: 'Mobile Payment App',
                    description: 'Customer-facing mobile app for biometric enrollment and seamless in-store payments.'
                  },
                  {
                    icon: BarChart3,
                    title: 'Real-time Analytics',
                    description: 'Comprehensive dashboard showing transaction data, customer insights, and performance metrics.'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`${featuresAnimation.inView ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <Store className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900">Smart Retail Terminal</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Today's Sales</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₦847,500</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Payment Methods</div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-blue-100 rounded p-2 text-center">
                        <div className="text-xs text-blue-600">Face: 45%</div>
                      </div>
                      <div className="flex-1 bg-green-100 rounded p-2 text-center">
                        <div className="text-xs text-green-600">Voice: 35%</div>
                      </div>
                      <div className="flex-1 bg-purple-100 rounded p-2 text-center">
                        <div className="text-xs text-purple-600">Social: 20%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`${featuresAnimation.inView ? 'animate-slideInLeft delay-200' : 'opacity-0'} order-2 lg:order-1`}>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <Smartphone className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900">E-commerce Integration</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="text-green-600 font-semibold">+23%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cart Abandonment</span>
                      <span className="text-red-500 font-semibold">-67%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Checkout Time</span>
                      <span className="text-blue-600 font-semibold">-70%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${featuresAnimation.inView ? 'animate-slideInRight delay-200' : 'opacity-0'} order-1 lg:order-2`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 font-space">
                E-commerce Integration
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: CreditCard,
                    title: 'One-Click Checkout',
                    description: 'Customers can complete purchases instantly using biometric authentication without entering payment details.'
                  },
                  {
                    icon: Shield,
                    title: 'Fraud Prevention',
                    description: 'Advanced biometric verification eliminates fraudulent transactions and chargebacks completely.'
                  },
                  {
                    icon: Zap,
                    title: 'Fast Integration',
                    description: 'Simple APIs and plugins for popular e-commerce platforms like Shopify, WooCommerce, and Magento.'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
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
              Transform Your Retail Business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the measurable impact of biometric payments on your business metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: '70%', label: 'Faster Checkout', icon: Clock, color: 'blue' },
              { metric: '100%', label: 'Fraud Reduction', icon: Shield, color: 'green' },
              { metric: '23%', label: 'Sales Increase', icon: TrendingUp, color: 'purple' },
              { metric: '89%', label: 'Customer Satisfaction', icon: Users, color: 'yellow' }
            ].map((benefit, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ${benefitsAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`w-6 h-6 text-${benefit.color}-600`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{benefit.metric}</div>
                <div className="text-gray-600">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 font-space">
            Ready to Revolutionize Your Retail Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of retailers already using GestPay to transform their customer experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
