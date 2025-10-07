import React from 'react';

const Footer = () => {
  return (
    <footer className="pt-0 px-6 bg-[#101727] text-gray-100">
      {/* Thin green horizontal line on top */}
      <div className="h-0.5 w-full bg-[#019438]"></div>

      <div className="py-12 max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <i className="fas fa-robot text-[#019438] text-xl"></i>
            </div>
            <span className="text-xl font-bold text-[#019438]">Pathwise AI</span>
          </div>
          <p className="mb-4">
            AI-powered assistant helping Nigerian vendors grow their businesses smarter.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#017b30] flex items-center justify-center hover:bg-[#015e25] transition"
            >
              <i className="fab fa-facebook-f text-white"></i>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#017b30] flex items-center justify-center hover:bg-[#015e25] transition"
            >
              <i className="fab fa-twitter text-white"></i>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#017b30] flex items-center justify-center hover:bg-[#015e25] transition"
            >
              <i className="fab fa-instagram text-white"></i>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#017b30] flex items-center justify-center hover:bg-[#015e25] transition"
            >
              <i className="fab fa-linkedin-in text-white"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Features</a></li>
            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition">Download</a></li>
            <li><a href="#" className="hover:text-white transition">Updates</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Community</a></li>
            <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 text-center text-sm text-white">
        <p>© 2025 Pathwise AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;