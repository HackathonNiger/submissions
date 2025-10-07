'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { getRelativeTime } from '../../lib/utils/apiUtils';
import { 
  Search, Bell, Settings, User, ChevronDown, 
  Plus, Download, Filter, Calendar, Menu, X,
  HelpCircle, LogOut, CreditCard, Shield, Zap
} from 'lucide-react';

export default function DashboardHeader({ title, subtitle, actions, onMobileMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // API hooks
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, isLoading: isNotificationsLoading } = useNotifications();
  
  const handleMarkAllRead = async () => {
    // Mark all unread notifications as read
    const unreadNotifications = notifications.filter(n => !n.is_read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };
  
  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };
  
  const handleLogout = () => {
    setShowProfile(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Mobile Menu + Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 mt-0.5 text-sm hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Search */}
          {/* <div className={`hidden sm:block relative transition-all duration-200 ${
            searchFocused ? 'w-80' : 'w-64'
          }`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions, customers..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div> */}

          {/* Mobile Search Button */}
          {/* <button className="sm:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200">
            <Search className="w-5 h-5 text-gray-600" />
          </button> */}


          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {isNotificationsLoading ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.is_read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.is_read ? 'bg-primary' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {notification.type} Notification
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getRelativeTime(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{user?.role} Account</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Billing & Plans</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Security</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Preferences</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Help & Support</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}
