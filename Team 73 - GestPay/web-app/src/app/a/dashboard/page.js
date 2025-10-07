'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useDashboard } from '../../../hooks/useDashboard';
import { useWallet } from '../../../hooks/useWallet';
import { useAuth } from '../../../hooks/useAuth';
import { useTransactions } from '../../../hooks/useTransactions';
import { formatCurrency, formatTransactionType, getRelativeTime } from '../../../lib/utils/apiUtils';
import { 
  TrendingUp, TrendingDown, Users, CreditCard, 
  ArrowUpRight, ArrowDownRight, Eye, EyeOff,
  Calendar, Filter, Download, Plus, Camera,
  Mic, MessageSquare, Wallet, Shield, Clock,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  
  // API hooks
  const { user } = useAuth();
  const { stats, recentTransactions, isLoading: isDashboardLoading } = useDashboard();
  const { balance, currency, isBalanceLoading } = useWallet();
  const { transactions: fallbackTransactions, isLoading: isTransactionsLoading } = useTransactions({ limit: 5 });
  
  // Stats data with real API data
  const statsData = [
    {
      title: 'Total Balance',
      value: isBalanceLoading 
        ? 'Loading...' 
        : showBalance 
          ? formatCurrency(balance, currency) 
          : '₦••••••••',
      change: '+12.5%', // This would come from API in real implementation
      trend: 'up',
      icon: Wallet,
      color: 'blue'
    },
    {
      title: 'Total Received',
      value: isDashboardLoading 
        ? 'Loading...' 
        : formatCurrency(stats.total_received || '0'),
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Total Transactions',  
      value: isDashboardLoading 
        ? 'Loading...' 
        : (stats.total_transactions || 0).toString(),
      change: '+15.3%',
      trend: 'up',
      icon: CreditCard,
      color: 'purple'
    }
  ];

  // Use real transaction data from API - fallback to transactions hook if dashboard doesn't have them
  const transactionsList = recentTransactions && recentTransactions.length > 0 
    ? recentTransactions 
    : fallbackTransactions || [];
    
  console.log('Dashboard transactions debug:', {
    recentTransactions,
    fallbackTransactions,
    transactionsList,
    isDashboardLoading,
    isTransactionsLoading
  });

  const quickActions = [
    {
      title: 'Send Money',
      description: 'Transfer to contacts',
      icon: ArrowUpRight,
      color: 'blue',
      href: '/a/payments/send'
    },
    {
      title: 'Request Payment',
      description: 'Generate payment link',
      icon: ArrowDownRight,
      color: 'green',
      href: '/a/payments/request'
    },
    {
      title: 'Setup Biometric',
      description: 'Configure face/voice',
      icon: Camera,
      color: 'purple',
      href: '/a/biometric'
    },
    {
      title: 'View Analytics',
      description: 'Payment insights',
      icon: BarChart3,
      color: 'orange',
      href: '/a/analytics'
    }
  ];

  const getMethodIcon = (feature) => {
    switch (feature) {
      case 'face-pay': return Camera;
      case 'voice-pay': return Mic;
      case 'telegram-pay': return MessageSquare;
      case 'chat-pay': return MessageSquare;
      default: return CreditCard;
    }
  };

  const getMethodColor = (feature) => {
    switch (feature) {
      case 'face-pay': return 'text-blue-600 bg-blue-100';
      case 'voice-pay': return 'text-green-600 bg-green-100';
      case 'telegram-pay': return 'text-purple-600 bg-purple-100';
      case 'chat-pay': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTransactionAmount = (amount, type) => {
    const typeInfo = formatTransactionType(type);
    const formatted = formatCurrency(amount);
    
    return `${typeInfo.sign}${formatted}`;
  };

  const headerActions = [
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export clicked'),
      primary: false
    },
    {
      label: 'Send Money',
      icon: Plus,
      onClick: () => console.log('Send money clicked'),
      primary: true
    }
  ];

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening with your account."
      actions={headerActions}
    >
      <div className="space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center mt-2">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                      {stat.value}
                    </p>
                    {stat.title === 'Total Balance' && (
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{stat.change}</span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-${stat.color}-100`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium whitespace-nowrap">
                    View All
                  </button>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {(isDashboardLoading && isTransactionsLoading) ? (
                <div className="p-6 text-center text-gray-500">
                  Loading transactions...
                </div>
              ) : transactionsList.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No recent transactions
                </div>
              ) : (
                transactionsList.map((transaction) => {
                  const MethodIcon = getMethodIcon(transaction.feature);
                  const methodColor = getMethodColor(transaction.feature);
                  const typeInfo = formatTransactionType(transaction.type);
                
                  return (
                    <div key={transaction.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${methodColor}`}>
                            <MethodIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {typeInfo.label}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {transaction.description || 'No description'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              <span className="hidden sm:inline">{getRelativeTime(transaction.created_at)} • </span>
                              {transaction.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className={`text-sm font-semibold ${typeInfo.color}`}>
                            {formatTransactionAmount(transaction.amount || '0', transaction.type)}
                          </p>
                          <p className="text-xs text-gray-500 capitalize hidden sm:block">
                            {transaction.feature?.replace('-', ' ') || 'Transfer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {action.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Face Pay</p>
                      <p className={`text-xs ${
                        user?.allow_face_payments ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {user?.allow_face_payments ? 'Active' : 'Setup Required'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    user?.allow_face_payments ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mic className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Voice Pay</p>
                      <p className={`text-xs ${
                        user?.allow_voice_payments ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {user?.allow_voice_payments ? 'Active' : 'Setup Required'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    user?.allow_voice_payments ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Telegram Pay</p>
                      <p className={`text-xs ${
                        user?.allow_telegram_payments ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {user?.allow_telegram_payments ? 'Active' : 'Setup Required'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    user?.allow_telegram_payments ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Manage Methods
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
