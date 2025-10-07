'use client';

import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { 
  Users, Target, Award, Globe, ArrowRight, CheckCircle,
  Heart, Zap, Shield, TrendingUp, Building2, Briefcase
} from 'lucide-react';

const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  return { ref, inView };
};

export default function Company() {
  const heroAnimation = useScrollAnimation();
  const missionAnimation = useScrollAnimation();
  const valuesAnimation = useScrollAnimation();
  const teamAnimation = useScrollAnimation();
  const statsAnimation = useScrollAnimation();

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize the security and privacy of our users above all else, implementing bank-grade security measures.',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously push the boundaries of what\'s possible with biometric technology and payment systems.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Customer Centric',
      description: 'Every decision we make is guided by what\'s best for our customers and their success.',
      color: 'green'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We\'re building technology that can transform payments worldwide, starting with emerging markets.',
      color: 'purple'
    }
  ];

  const stats = [
    { value: '2019', label: 'Founded', icon: Building2 },
    { value: '50+', label: 'Team Members', icon: Users },
    { value: '150+', label: 'Countries', icon: Globe },
    { value: '$25M', label: 'Funding Raised', icon: TrendingUp }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Payments at Stripe. 15+ years in fintech and payments.',
      image: '/team/ceo.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google AI researcher. PhD in Computer Vision from Stanford.',
      image: '/team/cto.jpg'
    },
    {
      name: 'Amara Okafor',
      role: 'VP of Engineering',
      bio: 'Former Lead Engineer at PayPal. Expert in scalable payment systems.',
      image: '/team/vp-eng.jpg'
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Security',
      bio: 'Cybersecurity expert with 20+ years at major financial institutions.',
      image: '/team/security.jpg'
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
                Transforming Payments
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  for Everyone
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                We're on a mission to make payments more secure, accessible, and convenient 
                through cutting-edge biometric technology and innovative solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started">
                  <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center">
                    Join Our Mission
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                  View Careers
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white" ref={missionAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`${missionAnimation.inView ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-space">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                To democratize access to secure, convenient payment technology by making 
                biometric payments accessible to everyone, everywhere.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We believe that the future of payments lies in removing barriers - no more 
                forgotten passwords, lost cards, or complex authentication processes. 
                Just you, being you, is enough to make secure payments.
              </p>
              
              <div className="space-y-4">
                {[
                  'Eliminate payment friction for billions of people',
                  'Provide bank-grade security without complexity',
                  'Enable financial inclusion in emerging markets',
                  'Build technology that respects user privacy'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`${missionAnimation.inView ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-primary/10 to-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-space">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    A world where secure payments are as simple as being yourself - 
                    where your identity is your wallet, and financial services are 
                    accessible to everyone, regardless of location or economic status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50" ref={valuesAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${valuesAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at GestPay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center ${valuesAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className={`w-12 h-12 bg-${value.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className={`w-6 h-6 text-${value.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-space">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
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

      {/* Team Section */}
      <section className="py-20 bg-white" ref={teamAnimation.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${teamAnimation.inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced leaders from top technology and financial companies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className={`text-center ${teamAnimation.inView ? `animate-fadeInUp delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-space">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-space">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  GestPay was founded in 2019 by a team of payment industry veterans and 
                  AI researchers who witnessed firsthand the challenges of traditional 
                  payment systems in emerging markets.
                </p>
                <p>
                  After seeing millions of people excluded from digital payments due to 
                  lack of traditional banking infrastructure, we knew there had to be a 
                  better way. We envisioned a future where your identity itself could 
                  serve as your payment method.
                </p>
                <p>
                  Today, we're proud to serve millions of users across 150+ countries, 
                  processing billions in transactions while maintaining the highest 
                  standards of security and privacy.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-space">
                  Join Our Journey
                </h3>
                <p className="text-gray-600 mb-6">
                  We're always looking for talented individuals who share our passion 
                  for transforming the future of payments.
                </p>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center mx-auto">
                  <Briefcase className="w-5 h-5 mr-2" />
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 font-space">
            Ready to Be Part of the Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of users and thousands of businesses already using GestPay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started Today
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
