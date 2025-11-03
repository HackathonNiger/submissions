import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't show header on auth pages
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white border-b border-deepBlue-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-deepBlue-600">AjoSave</h1>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-deepBlue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-deepBlue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-deepBlue-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-deepBlue-500">{user.email}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;