'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { 
  Camera, Mic, MessageSquare, User, Phone, Mail,
  ArrowRight, Check, X, QrCode, Contact, Search
} from 'lucide-react';

export default function SendMoney() {
  const [selectedMethod, setSelectedMethod] = useState('facepay');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [showContacts, setShowContacts] = useState(false);

  const paymentMethods = [
    {
      id: 'facepay',
      name: 'Face Pay',
      icon: Camera,
      description: 'Pay with facial recognition',
      color: 'blue'
    },
    {
      id: 'voicepay',
      name: 'Voice Pay',
      icon: Mic,
      description: 'Pay with voice command',
      color: 'green'
    },
    {
      id: 'socialpay',
      name: 'Social Pay',
      icon: MessageSquare,
      description: 'Pay via social media',
      color: 'purple'
    }
  ];

  const recentContacts = [
    { id: 1, name: 'Sarah Johnson', phone: '+234 801 234 5678', avatar: 'SJ' },
    { id: 2, name: 'Mike Chen', phone: '+234 802 345 6789', avatar: 'MC' },
    { id: 3, name: 'Alice Brown', phone: '+234 803 456 7890', avatar: 'AB' },
    { id: 4, name: 'David Wilson', phone: '+234 804 567 8901', avatar: 'DW' }
  ];

  const formatAmount = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-NG').format(numericValue);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleSend = () => {
    console.log('Sending payment:', {
      method: selectedMethod,
      amount,
      recipient,
      description
    });
  };

  return (
    <DashboardLayout 
      title="Send Money" 
      subtitle="Transfer money using biometric authentication"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Amount Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amount</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-900">
              ₦
            </span>
            <input
              type="text"
              value={formatAmount(amount)}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full pl-12 pr-4 py-4 text-3xl font-bold text-gray-900 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>
          {amount && (
            <p className="text-sm text-gray-500 mt-2">
              Amount: ₦{formatAmount(amount)}
            </p>
          )}
        </div>

        {/* Recipient */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Send To</h2>
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium"
            >
              <Contact className="w-4 h-4" />
              <span>Contacts</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter phone number, email, or username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Recent Contacts */}
            {showContacts && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Recent Contacts</p>
                {recentContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setRecipient(contact.phone);
                      setShowContacts(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{contact.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? `border-${method.color}-500 bg-${method.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    selectedMethod === method.id
                      ? `bg-${method.color}-100`
                      : 'bg-gray-100'
                  }`}>
                    <method.icon className={`w-6 h-6 ${
                      selectedMethod === method.id
                        ? `text-${method.color}-600`
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <p className={`font-medium ${
                    selectedMethod === method.id
                      ? `text-${method.color}-900`
                      : 'text-gray-900'
                  }`}>
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {method.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description (Optional)</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this payment for?"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Send Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {amount && recipient && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Transaction Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₦{formatAmount(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₦{formatAmount(amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!amount || !recipient}
              className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                amount && recipient
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Send Money</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
