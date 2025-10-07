import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="GestPay Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900 font-space">GestPay</span>
            </div>
            <p className="text-gray-600 mb-4">
              The future of payments with biometric technology. Secure, fast, and convenient.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#facepay" className="hover:text-primary transition-colors">FacePay</a></li>
              <li><a href="#voicepay" className="hover:text-primary transition-colors">VoicePay</a></li>
              <li><a href="#socialpay" className="hover:text-primary transition-colors">SocialPay</a></li>
              <li><a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Developers</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#api-docs" className="hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#sdks" className="hover:text-primary transition-colors">SDKs</a></li>
              <li><a href="#sandbox" className="hover:text-primary transition-colors">Sandbox</a></li>
              <li><a href="#support" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#careers" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#blog" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {currentYear} GestPay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
