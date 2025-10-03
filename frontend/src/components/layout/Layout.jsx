// frontend/src/components/layout/Layout.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, CreditCard, Wallet } from 'lucide-react';
import Header from './Header'; // NEW: Import Header

const Layout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/payment', icon: CreditCard, label: 'Pay' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' }
  ];

  // Don't show footer on auth and home pages
  const showFooter = isAuthenticated && !loading && location.pathname !== '/' && location.pathname !== '/auth';

  return (
    <div className="min-h-screen bg-deepBlue-50">
      {/* NEW: Add Header */}
      <Header />
      
      {/* Main Content */}
      <div className={showFooter ? 'pb-20' : ''}>
        {children}
      </div>
      
      {/* Fixed Footer Navigation - Only show when authenticated */}
      {showFooter && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-deepBlue-200 z-50">
          <div className="flex justify-around items-center py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition duration-200 ${
                    isActive ? 'text-deepBlue-600' : 'text-deepBlue-400'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <div className="w-1 h-1 bg-deepBlue-600 rounded-full mt-1"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;