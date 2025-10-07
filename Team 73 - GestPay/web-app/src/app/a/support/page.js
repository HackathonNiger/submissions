'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  Clock, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight,
  Search,
  Send,
  Headphones,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  Settings,
  AlertCircle,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('help');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });

  const supportOptions = [
    {
      id: 'help',
      title: 'Help Center',
      icon: HelpCircle,
      description: 'Browse articles and guides'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: MessageCircle,
      description: 'Get in touch with support'
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: BookOpen,
      description: 'Documentation and tutorials'
    }
  ];

  const quickActions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      status: 'online',
      action: () => console.log('Start chat')
    },
    {
      title: 'Call Support',
      description: '+234 901 9659 410',
      icon: Phone,
      status: 'available',
      action: () => console.log('Call support')
    },
    {
      title: 'Email Support',
      description: 'support@usegestpay.com',
      icon: Mail,
      status: 'available',
      action: () => console.log('Email support')
    }
  ];

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Users,
      faqs: [
        {
          question: 'How do I create a GestPay account?',
          answer: 'To create a GestPay account, visit our signup page and provide your basic information including name, email, and phone number. You\'ll need to verify your email and complete KYC verification for full access to all features.'
        },
        {
          question: 'What documents do I need for verification?',
          answer: 'For individual accounts, you need a valid government-issued ID (National ID, Driver\'s License, or International Passport) and a utility bill. For business accounts, additional documents like CAC certificate and business registration are required.'
        },
        {
          question: 'How long does account verification take?',
          answer: 'Account verification typically takes 24-48 hours for individual accounts and 3-5 business days for business accounts. You\'ll receive email notifications about your verification status.'
        }
      ]
    },
    {
      title: 'Payments & Transactions',
      icon: CreditCard,
      faqs: [
        {
          question: 'What payment methods are supported?',
          answer: 'GestPay supports bank transfers, card payments, USSD, mobile money, and our innovative biometric payment methods including Face Pay and Voice Pay (coming soon).'
        },
        {
          question: 'Are there transaction limits?',
          answer: 'Transaction limits vary by account type and verification level. Basic accounts have daily limits of ₦100,000, while verified business accounts can process up to ₦10,000,000 daily.'
        },
        {
          question: 'How do I dispute a transaction?',
          answer: 'To dispute a transaction, go to your transaction history, select the transaction, and click "Dispute". Provide details about the issue and any supporting evidence. Our team will investigate within 5-7 business days.'
        }
      ]
    },
    {
      title: 'Biometric Features',
      icon: Shield,
      faqs: [
        {
          question: 'How secure is Face Pay?',
          answer: 'Face Pay uses advanced facial recognition with liveness detection to prevent spoofing. Your biometric data is encrypted and stored securely, never shared with third parties.'
        },
        {
          question: 'Can I use Face Pay in low light?',
          answer: 'Face Pay works in various lighting conditions, but optimal lighting improves accuracy. The system will guide you to adjust your position for better recognition.'
        },
        {
          question: 'What if Face Pay doesn\'t recognize me?',
          answer: 'If Face Pay fails to recognize you, you can use alternative payment methods or re-enroll your face data. Factors like significant appearance changes or poor lighting can affect recognition.'
        }
      ]
    },
    {
      title: 'Account & Security',
      icon: Settings,
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email. You can also reset your password from your account settings.'
        },
        {
          question: 'How do I enable two-factor authentication?',
          answer: 'Go to Settings > Security > Two-Factor Authentication. You can enable 2FA using SMS, authenticator apps, or biometric methods for enhanced security.'
        },
        {
          question: 'Can I change my registered phone number?',
          answer: 'Yes, you can update your phone number in Settings > Profile. You\'ll need to verify the new number via SMS before the change takes effect.'
        }
      ]
    }
  ];

  const resources = [
    {
      title: 'API Documentation',
      description: 'Complete guide for developers',
      icon: FileText,
      link: '/docs/api',
      type: 'documentation'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      link: '/tutorials',
      type: 'video'
    },
    {
      title: 'Best Practices',
      description: 'Security and optimization tips',
      icon: Shield,
      link: '/best-practices',
      type: 'guide'
    },
    {
      title: 'Integration Examples',
      description: 'Sample code and implementations',
      icon: Settings,
      link: '/examples',
      type: 'code'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Handle form submission
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const renderHelpCenter = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <action.icon className="w-8 h-8 text-primary group-hover:text-primary/80" />
              <div className={`w-3 h-3 rounded-full ${
                action.status === 'online' ? 'bg-green-500' :
                action.status === 'available' ? 'bg-blue-500' : 'bg-gray-400'
              }`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <category.icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {category.faqs.map((faq, faqIndex) => (
                <div key={faqIndex} className="p-6">
                  <button
                    onClick={() => setExpandedFaq(
                      expandedFaq === `${categoryIndex}-${faqIndex}` 
                        ? null 
                        : `${categoryIndex}-${faqIndex}`
                    )}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h4 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h4>
                    {expandedFaq === `${categoryIndex}-${faqIndex}` ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === `${categoryIndex}-${faqIndex}` && (
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Was this helpful?</span>
                        <button className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Yes</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700">
                          <ThumbsDown className="w-4 h-4" />
                          <span>No</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
          <p className="text-gray-600">We're here to help. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={contactForm.category}
                onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing & Payments</option>
                <option value="account">Account Management</option>
                <option value="biometric">Biometric Features</option>
                <option value="api">API & Integration</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={contactForm.priority}
                onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Please provide as much detail as possible about your issue..."
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Response Time:</p>
                <ul className="space-y-1">
                  <li>• Urgent: Within 2 hours</li>
                  <li>• High: Within 4 hours</li>
                  <li>• Medium: Within 24 hours</li>
                  <li>• Low: Within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources & Documentation</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access comprehensive guides, tutorials, and documentation to help you make the most of GestPay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <resource.icon className="w-8 h-8 text-primary group-hover:text-primary/80" />
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                resource.type === 'documentation' ? 'bg-blue-100 text-blue-800' :
                resource.type === 'video' ? 'bg-purple-100 text-purple-800' :
                resource.type === 'guide' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {resource.type}
              </span>
              <button className="text-primary hover:text-primary/80 font-medium text-sm">
                View Resource →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need More Help?</h3>
          <p className="text-gray-600 mb-6">
            Join our community forum to connect with other users and get answers from our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              Join Community Forum
            </button>
            <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold">
              Schedule Demo Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Support Center" 
      subtitle="Get help and find answers to your questions"
    >
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {supportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveTab(option.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === option.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <option.icon className="w-5 h-5" />
                <span>{option.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'help' && renderHelpCenter()}
          {activeTab === 'contact' && renderContactForm()}
          {activeTab === 'resources' && renderResources()}
        </div>
      </div>
    </DashboardLayout>
  );
}
