'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  User, Bell, Shield, CreditCard, Globe, 
  Smartphone, Mail, Phone, Edit, ChevronRight,
  Eye, EyeOff, Check, X, AlertCircle
} from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    payments: true,
    security: true,
    marketing: false,
    updates: true
  });

  const [showBalance, setShowBalance] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const settingSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Personal Information', value: 'John Doe', action: 'edit' },
        { label: 'Email Address', value: 'john@example.com', action: 'edit' },
        { label: 'Phone Number', value: '+234 801 234 5678', action: 'edit' },
        { label: 'Profile Picture', value: 'Update photo', action: 'edit' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Change Password', value: 'Last changed 30 days ago', action: 'edit' },
        { label: 'Two-Factor Authentication', value: twoFactor ? 'Enabled' : 'Disabled', action: 'toggle', toggle: true },
        { label: 'Login History', value: 'View recent logins', action: 'view' },
        { label: 'Active Sessions', value: '3 active sessions', action: 'view' }
      ]
    },
    {
      title: 'Payment Settings',
      icon: CreditCard,
      items: [
        { label: 'Default Payment Method', value: 'Face Pay', action: 'edit' },
        { label: 'Transaction Limits', value: '₦500,000 daily', action: 'edit' },
        { label: 'Auto-pay Settings', value: 'Disabled', action: 'edit' },
        { label: 'Payment History Export', value: 'Download data', action: 'view' }
      ]
    },
    {
      title: 'Privacy',
      icon: Eye,
      items: [
        { label: 'Show Balance', value: showBalance ? 'Visible' : 'Hidden', action: 'toggle', toggle: true },
        { label: 'Transaction Privacy', value: 'Private', action: 'edit' },
        { label: 'Data Sharing', value: 'Minimal sharing', action: 'edit' },
        { label: 'Account Visibility', value: 'Private', action: 'edit' }
      ]
    }
  ];

  const handleToggle = (section, item) => {
    if (section === 'Security' && item === 'Two-Factor Authentication') {
      setTwoFactor(!twoFactor);
    } else if (section === 'Privacy' && item === 'Show Balance') {
      setShowBalance(!showBalance);
    }
  };

  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your account preferences and security settings"
    >
      <div className="space-y-6">
        
        {/* Profile Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">JD</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-600">john@example.com</p>
              <p className="text-sm text-gray-500">Member since January 2024</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.value}</p>
                  </div>
                  
                  {item.toggle ? (
                    <button
                      onClick={() => handleToggle(section.title, item.label)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        (section.title === 'Security' && item.label === 'Two-Factor Authentication' && twoFactor) ||
                        (section.title === 'Privacy' && item.label === 'Show Balance' && showBalance)
                          ? 'bg-primary'
                          : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          (section.title === 'Security' && item.label === 'Two-Factor Authentication' && twoFactor) ||
                          (section.title === 'Privacy' && item.label === 'Show Balance' && showBalance)
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[
              { key: 'payments', label: 'Payment Notifications', desc: 'Get notified about transactions' },
              { key: 'security', label: 'Security Alerts', desc: 'Important security updates' },
              { key: 'marketing', label: 'Marketing Updates', desc: 'Product news and offers' },
              { key: 'updates', label: 'App Updates', desc: 'New features and improvements' }
            ].map((notif, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notif.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{notif.desc}</p>
                </div>
                
                <button
                  onClick={() => handleNotificationToggle(notif.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[notif.key] ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[notif.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">App Preferences</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[
              { label: 'Language', value: 'English', action: 'edit' },
              { label: 'Currency Display', value: 'Nigerian Naira (₦)', action: 'edit' },
              { label: 'Theme', value: 'Light Mode', action: 'edit' },
              { label: 'App Version', value: 'v2.1.0', action: 'view' }
            ].map((pref, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pref.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{pref.value}</p>
                </div>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200">
          <div className="p-6 border-b border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Deactivate Account</p>
                <p className="text-sm text-gray-500 mt-1">Temporarily disable your account</p>
              </div>
              <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                Deactivate
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500 mt-1">Permanently delete your account and data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
