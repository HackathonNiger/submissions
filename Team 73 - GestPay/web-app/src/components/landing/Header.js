'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Menu, X, ChevronDown, ChevronUp, Camera, Mic, MessageSquare,
  Store, CreditCard, Building2
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">   <div className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="GestPay Logo" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900 font-space">GestPay</span>
          </div> </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Products Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center text-gray-600 hover:text-primary transition-colors font-medium"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Products
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {activeDropdown === 'products' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  onMouseEnter={() => setActiveDropdown('products')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a href="#facepay" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <Camera className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">FacePay</div>
                      <div className="text-sm text-gray-500">Facial recognition payments</div>
                    </div>
                  </a>
                  <a href="#voicepay" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <Mic className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                      <div className="font-medium">VoicePay</div>
                      <div className="text-sm text-gray-500">Voice biometric authentication</div>
                    </div>
                  </a>
                  <a href="#socialpay" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <MessageSquare className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">SocialPay</div>
                      <div className="text-sm text-gray-500">WhatsApp & Telegram payments</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            {/* <div className="relative group">
              <button 
                className="flex items-center text-gray-600 hover:text-primary transition-colors font-medium"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Solutions
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {activeDropdown === 'solutions' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a href="#retail" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <Store className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">Retail & E-commerce</div>
                      <div className="text-sm text-gray-500">Online and offline stores</div>
                    </div>
                  </a>
                  <a href="#fintech" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <CreditCard className="w-5 h-5 mr-3 text-green-500" />
                    <div>
                      <div className="font-medium">Fintech & Banking</div>
                      <div className="text-sm text-gray-500">Financial institutions</div>
                    </div>
                  </a>
                  <a href="#enterprise" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <Building2 className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">Enterprise</div>
                      <div className="text-sm text-gray-500">Large organizations</div>
                    </div>
                  </a>
                </div>
              )}
            </div> */}

            <a href="/developers" className="text-gray-600 hover:text-primary transition-colors font-medium">Developers</a>
            {/* <a href="/company" className="text-gray-600 hover:text-primary transition-colors font-medium">Company</a>
            <a href="/use-cases" className="text-gray-600 hover:text-primary transition-colors font-medium">Use Cases</a>
           */}
</div>
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/sign-in">
              <button className="text-gray-600 hover:text-primary transition-colors">Sign In</button>
            </Link>
            <Link href="/get-started">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-gray-100 animate-fadeInUp">
            <div className="flex flex-col space-y-2">
              {/* Products Mobile Dropdown */}
              <div>
                <button 
                  className="flex items-center justify-between w-full text-left text-gray-600 hover:text-primary transition-colors py-2"
                  onClick={() => setMobileDropdown(mobileDropdown === 'products' ? null : 'products')}
                >
                  Products
                  {mobileDropdown === 'products' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {mobileDropdown === 'products' && (
                  <div className="pl-4 mt-2 space-y-2 animate-fadeInUp">
                    <a href="#facepay" className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors">
                      <Camera className="w-4 h-4 mr-3 text-blue-500" />
                      FacePay
                    </a>
                    <a href="#voicepay" className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors">
                      <Mic className="w-4 h-4 mr-3 text-green-500" />
                      VoicePay
                    </a>
                    <a href="#socialpay" className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4 mr-3 text-purple-500" />
                      SocialPay
                    </a>
                  </div>
                )}
              </div>

              {/* Solutions Mobile Dropdown */}
              <div>
                <button 
                  className="flex items-center justify-between w-full text-left text-gray-600 hover:text-primary transition-colors py-2"
                  onClick={() => setMobileDropdown(mobileDropdown === 'solutions' ? null : 'solutions')}
                >
                  Solutions
                  {mobileDropdown === 'solutions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {mobileDropdown === 'solutions' && (
                  <div className="pl-4 mt-2 space-y-2 animate-fadeInUp">
                    <a href="#retail" className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors">
                      <Store className="w-4 h-4 mr-3 text-blue-500" />
                      Retail & E-commerce
                    </a>
                    <a href="#fintech" className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors">
                      <CreditCard className="w-4 h-4 mr-3 text-green-500" />
                      Fintech & Banking
                    </a>
                    <a href="#enterprise" className="flex items-center py-2 text-gray-600 hover:text-primary transition-colors">
                      <Building2 className="w-4 h-4 mr-3 text-purple-500" />
                      Enterprise
                    </a>
                  </div>
                )}
              </div>

              <a href="/developers" className="text-gray-600 hover:text-primary transition-colors py-2">Developers</a>
              {/* <a href="/company" className="text-gray-600 hover:text-primary transition-colors py-2">Company</a>
              <a href="/use-cases" className="text-gray-600 hover:text-primary transition-colors py-2">Use Cases</a>
               */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link href="/sign-in">
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/get-started">
                  <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
