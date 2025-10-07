'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { 
  MessageSquare, Phone, Check, X, AlertCircle, 
  ExternalLink, Copy, QrCode, ArrowLeft, Shield,
  Bot, Users, Zap, Globe, Loader2, Settings
} from 'lucide-react';
import {
  useGetCurrentUserQuery,
  useGetWhatsAppDetailsQuery,
  useGetTelegramDetailsQuery,
  useToggleWhatsAppPaymentsMutation,
  useToggleTelegramPaymentsMutation,
  useDisconnectWhatsAppMutation,
  useDisconnectTelegramMutation
} from '../../../../lib/api/gestpayApi';

export default function SocialPaySetup() {
  const router = useRouter();
  const [copiedText, setCopiedText] = useState('');
  const [showPaymentSettings, setShowPaymentSettings] = useState({});
  
  // API hooks
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: whatsappData, isLoading: whatsappLoading, refetch: refetchWhatsApp } = useGetWhatsAppDetailsQuery(
    undefined,
    { skip: !currentUser?.data?.has_setup_whatsapp }
  );
  const { data: telegramData, isLoading: telegramLoading, refetch: refetchTelegram } = useGetTelegramDetailsQuery(
    undefined,
    { skip: !currentUser?.data?.has_setup_telegram }
  );
  
  // Mutation hooks
  const [toggleWhatsAppPayments, { isLoading: whatsappToggleLoading }] = useToggleWhatsAppPaymentsMutation();
  const [toggleTelegramPayments, { isLoading: telegramToggleLoading }] = useToggleTelegramPaymentsMutation();
  const [disconnectWhatsApp, { isLoading: whatsappDisconnectLoading }] = useDisconnectWhatsAppMutation();
  const [disconnectTelegram, { isLoading: telegramDisconnectLoading }] = useDisconnectTelegramMutation();
  
  // Determine setup status from API data
  const getSetupStatus = (platform) => {
    if (platform === 'whatsapp') {
      if (!currentUser?.data?.has_setup_whatsapp) return 'pending';
      if (whatsappData?.data?.session_state === 'linked') return 'active';
      return 'inactive';
    }
    if (platform === 'telegram') {
      if (!currentUser?.data?.has_setup_telegram) return 'pending';
      if (telegramData?.data?.session_state === 'linked') return 'active';
      return 'inactive';
    }
    return 'pending';
  };

  const socialPlatforms = [
    {
      id: 'telegram',
      name: 'Telegram Pay',
      icon: MessageSquare,
      description: 'Send and receive payments through Telegram',
      color: 'blue',
      status: getSetupStatus('telegram'),
      botUsername: 'gestpay_bot',
      botLink: 'https://t.me/gestpay_bot',
      data: telegramData?.data,
      isLoading: telegramLoading,
      features: [
        'Instant payments via chat',
        'Group payment splitting',
        'Payment notifications',
        'Transaction history'
      ],
      setupSteps: [
        'Click "Open Telegram Bot" below',
        'Start a conversation with @gestpay_bot',
        'Send /start command to the bot',
        'Follow the verification process',
        'Link your GestPay account'
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Pay',
      icon: Phone,
      description: 'Send and receive payments through WhatsApp',
      color: 'green',
      status: getSetupStatus('whatsapp'),
      botUsername: whatsappData?.data?.whatsapp_number || '+1 (555) 199-3423',
      botLink: `https://wa.me/${whatsappData?.data?.whatsapp_number?.replace('+', '') || '15551993423'}`,
      data: whatsappData?.data,
      isLoading: whatsappLoading,
      features: [
        'Chat-based payments',
        'Voice payment commands',
        'Receipt sharing',
        'Contact integration'
      ],
      setupSteps: [
        'Click "Open WhatsApp Bot" below',
        'Send "Hi" to start conversation',
        'Follow the setup instructions',
        'Verify your phone number',
        'Connect your GestPay wallet'
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return Check;
      case 'pending': return AlertCircle;
      case 'inactive': return X;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Connected';
      case 'pending': return 'Setup Required';
      case 'inactive': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    });
  };

  const handleOpenBot = (platform) => {
    window.open(platform.botLink, '_blank');
  };

  const handleDisconnect = async (platformId) => {
    try {
      if (platformId === 'whatsapp') {
        await disconnectWhatsApp().unwrap();
        refetchWhatsApp();
      } else if (platformId === 'telegram') {
        await disconnectTelegram().unwrap();
        refetchTelegram();
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleTogglePayments = async (platformId, enable) => {
    try {
      if (platformId === 'whatsapp') {
        await toggleWhatsAppPayments({ enable_payments: enable }).unwrap();
        refetchWhatsApp();
      } else if (platformId === 'telegram') {
        await toggleTelegramPayments({ enable_payments: enable }).unwrap();
        refetchTelegram();
      }
      setShowPaymentSettings(prev => ({ ...prev, [platformId]: false }));
    } catch (error) {
      console.error('Failed to toggle payments:', error);
    }
  };

  return (
    <DashboardLayout 
      title="Social Pay Setup" 
      subtitle="Connect your social media accounts for seamless payments"
    >
      <div className="space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Biometric Setup</span>
        </button>

        {/* Security Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">Secure Social Integration</h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                Your social media accounts are connected securely through encrypted channels. 
                We only access necessary information for payment processing and never store 
                your personal messages or contacts.
              </p>
            </div>
          </div>
        </div>

        {/* Social Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => {
            const StatusIcon = getStatusIcon(platform.status);
            const statusColor = getStatusColor(platform.status);
            
            return (
              <div key={platform.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${platform.color}-100`}>
                      <platform.icon className={`w-6 h-6 text-${platform.color}-600`} />
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusColor}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{getStatusText(platform.status)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {platform.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {platform.description}
                  </p>

                  {/* Bot Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {platform.id === 'whatsapp' ? platform.botUsername : `@${platform.botUsername}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(platform.botUsername, platform.id)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {copiedText === platform.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Connection Details */}
                    {platform.status === 'active' && platform.data && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Connected:</span>
                            <span>{new Date(platform.data.linked_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Activity:</span>
                            <span>{new Date(platform.data.last_activity).toLocaleDateString()}</span>
                          </div>
                          {platform.data.stats && (
                            <div className="flex justify-between">
                              <span>Messages (30d):</span>
                              <span>{platform.data.stats.messages_last_30_days}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2 mb-6">
                    {platform.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Setup Steps */}
                  <h4 className="font-medium text-gray-900 mb-3">Setup Steps:</h4>
                  <ol className="space-y-2">
                    {platform.setupSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm text-gray-600">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 bg-${platform.color}-100 text-${platform.color}-600`}>
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 space-y-3">
                  {platform.isLoading ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  ) : platform.status === 'pending' ? (
                    <button
                      onClick={() => handleOpenBot(platform)}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors bg-${platform.color}-600 text-white hover:bg-${platform.color}-700 flex items-center justify-center space-x-2`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open {platform.name.split(' ')[0]} Bot</span>
                    </button>
                  ) : platform.status === 'active' ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleOpenBot(platform)}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors bg-${platform.color}-100 text-${platform.color}-700 hover:bg-${platform.color}-200 flex items-center justify-center space-x-2`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Open Chat</span>
                      </button>
                      
                      {/* Payment Settings Toggle */}
                      <button
                        onClick={() => setShowPaymentSettings(prev => ({ ...prev, [platform.id]: !prev[platform.id] }))}
                        className="w-full py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Payment Settings</span>
                      </button>
                      
                      {/* Payment Settings Panel */}
                      {showPaymentSettings[platform.id] && (
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Enable Payments</span>
                            <button
                              onClick={() => {
                                const currentlyEnabled = platform.id === 'whatsapp' 
                                  ? platform.data?.allow_whatsapp_payments 
                                  : platform.data?.allow_telegram_payments;
                                handleTogglePayments(platform.id, !currentlyEnabled);
                              }}
                              disabled={platform.id === 'whatsapp' ? whatsappToggleLoading : telegramToggleLoading}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (platform.id === 'whatsapp' ? platform.data?.allow_whatsapp_payments : platform.data?.allow_telegram_payments)
                                  ? 'bg-green-600' 
                                  : 'bg-gray-200'
                              } ${(platform.id === 'whatsapp' ? whatsappToggleLoading : telegramToggleLoading) ? 'opacity-50' : ''}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  (platform.id === 'whatsapp' ? platform.data?.allow_whatsapp_payments : platform.data?.allow_telegram_payments)
                                    ? 'translate-x-6' 
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            {(platform.id === 'whatsapp' ? platform.data?.allow_whatsapp_payments : platform.data?.allow_telegram_payments)
                              ? 'Payments are enabled for this platform'
                              : 'Payments are disabled for this platform'
                            }
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleDisconnect(platform.id)}
                        disabled={platform.id === 'whatsapp' ? whatsappDisconnectLoading : telegramDisconnectLoading}
                        className="w-full py-2 rounded-lg font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {(platform.id === 'whatsapp' ? whatsappDisconnectLoading : telegramDisconnectLoading) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>Disconnect</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenBot(platform)}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors bg-${platform.color}-600 text-white hover:bg-${platform.color}-700`}
                    >
                      Reconnect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Connected Platforms</span>
              <span className="font-semibold">
                {socialPlatforms.filter(platform => platform.status === 'active').length} / {socialPlatforms.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(socialPlatforms.filter(platform => platform.status === 'active').length / socialPlatforms.length) * 100}%` 
                }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">
              Connect all platforms to maximize your social payment options
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Use Social Pay?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Instant Payments</h3>
              <p className="text-sm text-gray-600">
                Send money as easily as sending a message
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Social Integration</h3>
              <p className="text-sm text-gray-600">
                Pay friends and family through familiar apps
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Global Reach</h3>
              <p className="text-sm text-gray-600">
                Connect with users worldwide on popular platforms
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/support/social-pay"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Setup Guide</p>
                <p className="text-sm text-gray-500">Detailed setup instructions</p>
              </div>
            </a>
            
            <a
              href="/support/troubleshooting"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Troubleshooting</p>
                <p className="text-sm text-gray-500">Common issues and solutions</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
