'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useWallet } from '../../../hooks/useWallet';
import { useTransactions } from '../../../hooks/useTransactions';
import { useDashboard } from '../../../hooks/useDashboard';
import { formatCurrency, formatTransactionType, formatTransactionStatus, getRelativeTime } from '../../../lib/utils/apiUtils';
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  Send, 
  Download, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Calendar,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  QrCode,
  Smartphone,
  Building,
  Globe,
  Shield,
  Star,
  Settings,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCard, setSelectedCard] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // API hooks
  const { balance, currency, isBalanceLoading } = useWallet();
  const { stats, isLoading: isDashboardLoading } = useDashboard();
  const { 
    transactions, 
    updateFilters, 
    currentParams,
    isLoading: isTransactionsLoading 
  } = useTransactions();
  
  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const cards = [
    {
      id: 1,
      type: 'primary',
      name: 'GestPay Wallet',
      balance: 2647500.00,
      currency: 'NGN',
      cardNumber: '**** **** **** 1234',
      color: 'bg-gradient-to-br from-blue-600 to-purple-700',
      textColor: 'text-white'
    },
    {
      id: 2,
      type: 'savings',
      name: 'Savings Wallet',
      balance: 850000.00,
      currency: 'NGN',
      cardNumber: '**** **** **** 5678',
      color: 'bg-gradient-to-br from-green-600 to-emerald-700',
      textColor: 'text-white'
    },
    {
      id: 3,
      type: 'business',
      name: 'Business Account',
      balance: 1250000.00,
      currency: 'NGN',
      cardNumber: '**** **** **** 9012',
      color: 'bg-gradient-to-br from-gray-800 to-gray-900',
      textColor: 'text-white'
    }
  ];

  const quickActions = [
    { id: 'send', name: 'Send Money', icon: Send, color: 'blue', path: '/a/payments/send' },
    { id: 'receive', name: 'Receive', icon: Download, color: 'green', path: '/a/payments/receive' },
    { id: 'topup', name: 'Top Up', icon: Plus, color: 'purple', path: '/a/payments/topup' },
    { id: 'withdraw', name: 'Withdraw', icon: ArrowUpRight, color: 'orange', path: '/a/payments/withdraw' }
  ];

  // Use real transaction data from API
  const recentTransactions = transactions || [];

  // Use utility functions from apiUtils

  const getTransactionIcon = (feature) => {
    switch (feature) {
      case 'face-pay': return QrCode;
      case 'voice-pay': return Smartphone;
      case 'telegram-pay': return Building;
      case 'chat-pay': return Building;
      case 'wallet': return Wallet;
      default: return ArrowUpRight;
    }
  };

  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesSearch = (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.reference || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const renderWalletCard = (card, index) => (
    <div
      key={card.id}
      className={`${card.color} rounded-2xl p-6 ${card.textColor} cursor-pointer transform transition-all duration-300 hover:scale-105 ${
        selectedCard === index ? 'ring-4 ring-white ring-opacity-50' : ''
      }`}
      onClick={() => setSelectedCard(index)}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm opacity-80 mb-1">{card.name}</p>
          <p className="text-xs opacity-60">{card.cardNumber}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 opacity-80" />
          <MoreVertical className="w-4 h-4 opacity-60" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-2xl font-bold">
          {showBalance ? formatCurrency(card.balance, card.currency) : '₦••••••••'}
        </p>
      </div>
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-5 bg-white bg-opacity-20 rounded"></div>
          <div className="w-8 h-5 bg-white bg-opacity-20 rounded"></div>
        </div>
        <p className="text-xs opacity-60">Valid Thru 12/28</p>
      </div>
    </div>
  );

  const renderQuickAction = (action) => (
    <button
      key={action.id}
      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <div className={`w-12 h-12 rounded-full bg-${action.color}-100 flex items-center justify-center mb-3`}>
        <action.icon className={`w-6 h-6 text-${action.color}-600`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{action.name}</span>
    </button>
  );

  const renderTransaction = (transaction) => {
    const TransactionIcon = getTransactionIcon(transaction.feature);
    const typeInfo = formatTransactionType(transaction.type);
    const statusInfo = formatTransactionStatus(transaction.status);
    
    return (
      <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${typeInfo.bgColor}`}>
            <TransactionIcon className={`w-6 h-6 ${typeInfo.color}`} />
          </div>
          
          <div className="flex-1">
            <p className="font-medium text-gray-900">{transaction.description || 'No description'}</p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-500">{getRelativeTime(transaction.created_at)}</p>
              <span className="text-gray-300">•</span>
              <p className="text-xs text-gray-400">{transaction.reference}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`font-semibold ${typeInfo.color}`}>
            {typeInfo.sign}{formatCurrency(transaction.amount || '0')}
          </p>
          <div className={`flex items-center justify-end space-x-1 mt-1 px-2 py-1 rounded-full text-xs ${statusInfo.bgColor} ${statusInfo.color}`}>
            <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
            <span className="capitalize">{statusInfo.label}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout 
      title="My Wallet" 
      subtitle="Manage your funds, cards, and transactions"
    >
      <div className="space-y-8">
        {/* Wallet Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Wallet Overview</h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showBalance ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {isBalanceLoading ? 'Loading...' : showBalance ? formatCurrency(balance, currency) : '₦••••••••'}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <ArrowDown className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Received</p>
              <p className="text-2xl font-bold text-gray-900">
                {isDashboardLoading ? 'Loading...' : showBalance ? formatCurrency(stats.total_received || '0') : '₦••••••••'}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <ArrowUp className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {isDashboardLoading ? 'Loading...' : showBalance ? formatCurrency(stats.total_sent || '0') : '₦••••••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Cards */}
        {/* <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Cards</h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Card</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => renderWalletCard(card, index))}
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(renderQuickAction)}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={currentParams.type || 'all'}
                onChange={(e) => handleFilterChange('type', e.target.value === 'all' ? undefined : e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="debit">Sent</option>
                <option value="credit">Received</option>
              </select>
              
              <select
                value={currentParams.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {isTransactionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map(renderTransaction)
              ) : (
                <div className="text-center py-12">
                  <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No transactions found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Wallet Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Shield className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Security Settings</p>
                <p className="text-sm text-gray-500">Manage PIN, biometrics</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Star className="w-6 h-6 text-yellow-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Limits & Preferences</p>
                <p className="text-sm text-gray-500">Set spending limits</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">General Settings</p>
                <p className="text-sm text-gray-500">Notifications, currency</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
