'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { 
  Store, CreditCard, Building2, ArrowRight, CheckCircle, 
  TrendingUp, Shield, Zap, Users, BarChart3, Globe,
  Smartphone, Clock, Award, DollarSign, Target
} from 'lucide-react';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  return { ref, inView };
};

export default function Solutions() {
  const heroAnimation = useScrollAnimation();
  const solutionsAnimation = useScrollAnimation();
  const benefitsAnimation = useScrollAnimation();
  const statsAnimation = useScrollAnimation();

  const solutions = [
    {
      id: 'retail',
      icon: Store,
      title: 'Retail & E-commerce',
      subtitle: 'Transform your customer checkout experience',
      description: 'Enable seamless biometric payments for both online and offline retail environments. Reduce cart abandonment and increase customer satisfaction.',
      features: [
        'In-store biometric terminals',
        'E-commerce payment integration',
        'Mobile app SDK',
        'Inventory management integration',
        'Customer analytics dashboard',
        'Multi-location support'
      ],
      benefits: [
        'Reduce checkout time by 70%',
        'Eliminate payment fraud',
        'Increase customer retention',
        'Streamline operations'
      ],
      useCases: [
        'Grocery stores and supermarkets',
        'Fashion and apparel retailers',
        'Electronics and gadget stores',
        'Online marketplaces'
      ],
      color: 'blue'
    },
    {
      id: 'fintech',
      icon: CreditCard,
      title: 'Fintech & Banking',
      subtitle: 'Next-generation financial services',
      description: 'Integrate advanced biometric authentication into your financial products. Enhance security while improving user experience.',
      features: [
        'KYC biometric verification',
        'Secure transaction authentication',
        'Mobile banking integration',
        'ATM biometric access',
        'Loan application processing',
        'Regulatory compliance tools'
      ],
      benefits: [
        'Enhanced security protocols',
        'Reduced operational costs',
        'Improved customer onboarding',
        'Regulatory compliance'
      ],
      useCases: [
        'Digital banks and neobanks',
        'Microfinance institutions',
        'Payment service providers',
        'Cryptocurrency exchanges'
      ],
      color: 'green'
    },
    {
      id: 'enterprise',
      icon: Building2,
      title: 'Enterprise Solutions',
      subtitle: 'Scale biometric payments across your organization',
      description: 'Deploy enterprise-grade biometric payment solutions with advanced security, compliance, and integration capabilities.',
      features: [
        'Enterprise API suite',
        'Custom integration support',
        'Advanced security protocols',
        'Multi-tenant architecture',
        'Real-time monitoring',
        '24/7 enterprise support'
      ],
      benefits: [
        'Scalable infrastructure',
        'Enhanced security',
        'Operational efficiency',
        'Cost optimization'
      ],
      useCases: [
        'Large corporations',
        'Government institutions',
        'Healthcare systems',
        'Educational institutions'
      ],
      color: 'purple'
    }
  ];

  const stats = [
    { value: '500+', label: 'Enterprise Clients', icon: Building2 },
    { value: '99.9%', label: 'System Uptime', icon: Shield },
    { value: '2.5M+', label: 'Daily Transactions', icon: TrendingUp },
    { value: '150+', label: 'Countries Served', icon: Globe }
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
                Solutions for Every
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Business Need
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                From small retailers to large enterprises, our biometric payment solutions 
                scale to meet your unique business requirements and industry needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started">
                  <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center">
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white" ref={solutionsAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${solutionsAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored biometric payment solutions designed for your industry's unique challenges and requirements
            </p>
          </div>

          <div className="space-y-20">
            {solutions.map((solution, index) => (
              <div key={solution.id} className={`${solutionsAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  
                  {/* Content */}
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className={`w-16 h-16 bg-gradient-to-br from-${solution.color}-500 to-${solution.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                      <solution.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 font-space">
                      {solution.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      {solution.subtitle}
                    </p>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {solution.description}
                    </p>

                    {/* Key Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {solution.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href={`/solutions/${solution.id}`}>
                      <button className={`bg-${solution.color}-50 text-${solution.color}-600 px-6 py-3 rounded-lg font-semibold hover:bg-${solution.color}-100 transition-colors flex items-center`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                  </div>

                  {/* Visual/Stats */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                      <div className="space-y-6">
                        {/* Benefits */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Business Benefits:</h4>
                          <div className="space-y-3">
                            {solution.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className={`w-2 h-2 bg-${solution.color}-500 rounded-full mr-3`}></div>
                                <span className="text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Use Cases */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
                          <div className="space-y-2">
                            {solution.useCases.map((useCase, idx) => (
                              <div key={idx} className="flex items-center">
                                <Target className={`w-4 h-4 text-${solution.color}-500 mr-2`} />
                                <span className="text-sm text-gray-600">{useCase}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white" ref={statsAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className={`${statsAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-blue-200" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50" ref={benefitsAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${benefitsAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Why Choose GestPay Solutions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide more than just payment processing - we deliver complete business transformation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade security with advanced encryption, fraud detection, and compliance with global standards including PCI DSS and ISO 27001.',
                color: 'blue'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Process transactions in under 100ms with 99.99% uptime. Our global infrastructure ensures optimal performance worldwide.',
                color: 'yellow'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: '24/7 dedicated support team with industry expertise. From integration to optimization, we\'re with you every step.',
                color: 'green'
              }
            ].map((benefit, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${benefitsAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                  <benefit.icon className={`w-6 h-6 text-${benefit.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-space">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 font-space">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using GestPay to revolutionize their payment experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
