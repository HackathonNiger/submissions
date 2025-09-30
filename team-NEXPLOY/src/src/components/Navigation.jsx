import React from 'react';
import { CheckCircle, Home, Book } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage, resetVerification }) => (
  <nav className="bg-white border-b-2 border-green-600">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-green-700">VerifyMeds</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => { setCurrentPage('home'); resetVerification(); }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              currentPage === 'home' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => setCurrentPage('resources')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              currentPage === 'resources' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Book size={20} />
            <span className="hidden sm:inline">Resources</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navigation;