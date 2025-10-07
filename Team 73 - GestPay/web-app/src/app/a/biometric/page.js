'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Camera, Mic, MessageSquare, Check, X, 
  AlertCircle, Settings, Shield, Play, Loader2
} from 'lucide-react';
import {
  useGetCurrentUserQuery,
  useGetWhatsAppDetailsQuery,
  useGetTelegramDetailsQuery
} from '../../../lib/api/gestpayApi';

export default function BiometricSetup() {
  const router = useRouter();
  const [localSetupStatus, setLocalSetupStatus] = useState({
    face: 'pending',
    voice: 'unavailable'
  });
  
  // API hooks for social status
  const { data: currentUser, isLoading: userLoading } = useGetCurrentUserQuery();
  const { data: whatsappData, isLoading: whatsappLoading } = useGetWhatsAppDetailsQuery(
    undefined,
    { skip: !currentUser?.data?.has_setup_whatsapp }
  );
  const { data: telegramData, isLoading: telegramLoading } = useGetTelegramDetailsQuery(
    undefined,
    { skip: !currentUser?.data?.has_setup_telegram }
  );
  
  // Determine social setup status from API data
  const getSocialSetupStatus = () => {
    if (userLoading) return 'loading';
    
    const hasWhatsApp = currentUser?.data?.has_setup_whatsapp;
    const hasTelegram = currentUser?.data?.has_setup_telegram;
    
    if (!hasWhatsApp && !hasTelegram) return 'pending';
    
    const whatsappActive = hasWhatsApp && whatsappData?.data?.session_state === 'linked';
    const telegramActive = hasTelegram && telegramData?.data?.session_state === 'linked';
    
    if (whatsappActive || telegramActive) return 'active';
    if (hasWhatsApp || hasTelegram) return 'inactive';
    
    return 'pending';
  };
  
  // Combined setup status
  const setupStatus = {
    ...localSetupStatus,
    social: getSocialSetupStatus()
  };

  const biometricMethods = [
    {
      id: 'face',
      name: 'Face Recognition',
      icon: Camera,
      description: 'Use your face to authenticate payments',
      color: 'blue',
      status: setupStatus.face,
      features: [
        'Secure facial recognition',
        'Works in various lighting',
        'Anti-spoofing protection',
        'Privacy-first design'
      ]
    },
    {
      id: 'voice',
      name: 'Voice Recognition',
      icon: Mic,
      description: 'Voice authentication (Coming Soon)',
      color: 'green',
      status: setupStatus.voice,
      features: [
        'Unique voice patterns',
        'Background noise filtering',
        'Multiple language support',
        'Secure voice encryption'
      ]
    },
    {
      id: 'social',
      name: 'Social Pay',
      icon: MessageSquare,
      description: 'Pay through social media platforms',
      color: 'purple',
      status: setupStatus.social,
      isLoading: whatsappLoading || telegramLoading,
      socialData: {
        whatsapp: {
          connected: currentUser?.data?.has_setup_whatsapp,
          active: whatsappData?.data?.session_state === 'linked',
          data: whatsappData?.data
        },
        telegram: {
          connected: currentUser?.data?.has_setup_telegram,
          active: telegramData?.data?.session_state === 'linked',
          data: telegramData?.data
        }
      },
      features: [
        `WhatsApp ${currentUser?.data?.has_setup_whatsapp ? '✓' : '○'}`,
        `Telegram ${currentUser?.data?.has_setup_telegram ? '✓' : '○'}`,
        'Social verification',
        'Quick social transfers'
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return Check;
      case 'pending': return AlertCircle;
      case 'inactive': return X;
      case 'loading': return Loader2;
      case 'unavailable': return X;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'loading': return 'text-blue-600 bg-blue-100';
      case 'unavailable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Setup Required';
      case 'inactive': return 'Inactive';
      case 'loading': return 'Loading...';
      case 'unavailable': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  const handleSetup = (methodId) => {
    console.log(`Setting up ${methodId}`);
    
    if (methodId === 'face') {
      router.push('/a/biometric/face');
      return;
    }
    
    if (methodId === 'social') {
      router.push('/a/biometric/social');
      return;
    }
    
    // Simulate setup process for other methods
    setLocalSetupStatus(prev => ({
      ...prev,
      [methodId]: 'active'
    }));
  };

  const handleToggle = (methodId) => {
    if (methodId === 'social') {
      // For social, redirect to social page for management
      router.push('/a/biometric/social');
      return;
    }
    
    if (methodId === 'voice') {
      // Voice recognition is not available
      return;
    }
    
    setLocalSetupStatus(prev => ({
      ...prev,
      [methodId]: prev[methodId] === 'active' ? 'inactive' : 'active'
    }));
  };

  return (
    <DashboardLayout 
      title="Biometric Setup" 
      subtitle="Configure your biometric payment methods for secure transactions"
    >
      <div className="space-y-6">
        
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Your Security is Our Priority</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                All biometric data is encrypted and stored securely on your device. We never store 
                your actual biometric information on our servers - only encrypted mathematical 
                representations that cannot be reverse-engineered.
              </p>
            </div>
          </div>
        </div>

        {/* Biometric Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {biometricMethods.map((method) => {
            const StatusIcon = getStatusIcon(method.status);
            const statusColor = getStatusColor(method.status);
            
            return (
              <div key={method.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${method.color}-100`}>
                      <method.icon className={`w-6 h-6 text-${method.color}-600 ${method.status === 'loading' ? 'animate-spin' : ''}`} />
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusColor}`}>
                      <StatusIcon className={`w-4 h-4 ${method.status === 'loading' ? 'animate-spin' : ''}`} />
                      <span className="text-sm font-medium">{getStatusText(method.status)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {method.description}
                  </p>
                  
                  {/* Social Platform Status */}
                  {method.id === 'social' && method.socialData && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className={`flex items-center space-x-2 px-2 py-1 rounded ${
                          method.socialData.whatsapp.active ? 'bg-green-50 text-green-700' : 
                          method.socialData.whatsapp.connected ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-gray-50 text-gray-500'
                        }`}>
                          <span>WhatsApp</span>
                          {method.socialData.whatsapp.active ? 
                            <Check className="w-3 h-3" /> : 
                            method.socialData.whatsapp.connected ? 
                            <AlertCircle className="w-3 h-3" /> : 
                            <X className="w-3 h-3" />
                          }
                        </div>
                        <div className={`flex items-center space-x-2 px-2 py-1 rounded ${
                          method.socialData.telegram.active ? 'bg-green-50 text-green-700' : 
                          method.socialData.telegram.connected ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-gray-50 text-gray-500'
                        }`}>
                          <span>Telegram</span>
                          {method.socialData.telegram.active ? 
                            <Check className="w-3 h-3" /> : 
                            method.socialData.telegram.connected ? 
                            <AlertCircle className="w-3 h-3" /> : 
                            <X className="w-3 h-3" />
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 space-y-3">
                  {method.status === 'loading' ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500">Loading status...</span>
                    </div>
                  ) : method.status === 'pending' ? (
                    <button
                      onClick={() => handleSetup(method.id)}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors bg-${method.color}-600 text-white hover:bg-${method.color}-700 flex items-center justify-center space-x-2`}
                    >
                      <Play className="w-4 h-4" />
                      <span>Setup Now</span>
                    </button>
                  ) : method.status === 'unavailable' ? (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full py-3 rounded-lg font-semibold bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Coming Soon</span>
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        Voice recognition will be available in a future update
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleToggle(method.id)}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                          method.status === 'active'
                            ? (method.id === 'social' ? `bg-${method.color}-100 text-${method.color}-700 hover:bg-${method.color}-200` : 'bg-red-100 text-red-700 hover:bg-red-200')
                            : `bg-${method.color}-100 text-${method.color}-700 hover:bg-${method.color}-200`
                        }`}
                      >
                        {method.id === 'social' ? 'Manage Platforms' : (method.status === 'active' ? 'Disable' : 'Enable')}
                      </button>
                      <button 
                        onClick={() => {
                          if (method.id === 'face') {
                            router.push('/a/biometric/face');
                          } else if (method.id === 'social') {
                            router.push('/a/biometric/social');
                          } else {
                            console.log(`Configure ${method.id}`);
                          }
                        }}
                        className="w-full py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configure</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Setup Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Progress</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Biometric Methods Configured</span>
              <span className="font-semibold">
                {biometricMethods.filter(method => method.status === 'active').length} / {biometricMethods.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(biometricMethods.filter(method => method.status === 'active').length / biometricMethods.length) * 100}%` 
                }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">
              Complete all setups to unlock the full potential of biometric payments
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/support"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Setup Guide</p>
                <p className="text-sm text-gray-500">Step-by-step instructions</p>
              </div>
            </a>
            
            <a
              href="/support"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security Info</p>
                <p className="text-sm text-gray-500">How we protect your data</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
