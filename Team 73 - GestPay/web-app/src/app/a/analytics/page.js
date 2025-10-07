'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Filter, 
  Download, 
  Eye,
  Camera,
  Mic,
  Smartphone,
  Globe,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');

  const tabs = [
    { id: 'overview', title: 'Overview', icon: BarChart3 },
    { id: 'transactions', title: 'Transactions', icon: CreditCard },
    { id: 'customers', title: 'Customers', icon: Users },
    { id: 'biometric', title: 'Biometric Usage', icon: Camera }
  ];

  const dateRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ];

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '₦12.4M',
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last period'
    },
    {
      title: 'Transactions',
      value: '8,429',
      change: '+12.3%',
      trend: 'up',
      icon: CreditCard,
      description: 'total transactions'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      description: 'monthly active users'
    },
    {
      title: 'Success Rate',
      value: '98.2%',
      change: '+0.5%',
      trend: 'up',
      icon: Target,
      description: 'transaction success'
    }
  ];

  const transactionStats = [
    {
      title: 'Face Pay Transactions',
      value: '5,247',
      percentage: 62.2,
      change: '+15.3%',
      trend: 'up',
      icon: Camera,
      color: 'blue'
    },
    {
      title: 'Card Payments',
      value: '2,156',
      percentage: 25.6,
      change: '+8.7%',
      trend: 'up',
      icon: CreditCard,
      color: 'green'
    },
    {
      title: 'Bank Transfers',
      value: '892',
      percentage: 10.6,
      change: '-2.1%',
      trend: 'down',
      icon: Smartphone,
      color: 'yellow'
    },
    {
      title: 'Voice Pay',
      value: '134',
      percentage: 1.6,
      change: 'New',
      trend: 'new',
      icon: Mic,
      color: 'purple'
    }
  ];

  const biometricStats = [
    {
      title: 'Face Recognition Success',
      value: '97.8%',
      change: '+1.2%',
      trend: 'up',
      description: 'Authentication success rate'
    },
    {
      title: 'Liveness Detection',
      value: '99.1%',
      change: '+0.3%',
      trend: 'up',
      description: 'Fraud prevention rate'
    },
    {
      title: 'Average Auth Time',
      value: '2.3s',
      change: '-0.4s',
      trend: 'up',
      description: 'Time to authenticate'
    },
    {
      title: 'Daily Face Pay Users',
      value: '1,247',
      change: '+18.5%',
      trend: 'up',
      description: 'Active biometric users'
    }
  ];

  const topLocations = [
    { city: 'Lagos', transactions: 3247, percentage: 38.5, growth: '+12%' },
    { city: 'Abuja', transactions: 1892, percentage: 22.4, growth: '+8%' },
    { city: 'Port Harcourt', transactions: 1156, percentage: 13.7, growth: '+15%' },
    { city: 'Kano', transactions: 892, percentage: 10.6, growth: '+5%' },
    { city: 'Ibadan', transactions: 743, percentage: 8.8, growth: '+22%' },
    { city: 'Others', transactions: 499, percentage: 6.0, growth: '+3%' }
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: 'Adebayo Johnson',
      amount: 25000,
      method: 'Face Pay',
      status: 'completed',
      time: '2 minutes ago',
      location: 'Lagos'
    },
    {
      id: 2,
      customer: 'Fatima Abdullahi',
      amount: 8500,
      method: 'Card',
      status: 'completed',
      time: '5 minutes ago',
      location: 'Abuja'
    },
    {
      id: 3,
      customer: 'Chinedu Okafor',
      amount: 150000,
      method: 'Face Pay',
      status: 'pending',
      time: '8 minutes ago',
      location: 'Port Harcourt'
    },
    {
      id: 4,
      customer: 'Aisha Mohammed',
      amount: 12000,
      method: 'Bank Transfer',
      status: 'completed',
      time: '12 minutes ago',
      location: 'Kano'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <button className="text-sm text-primary hover:text-primary/80">View Details</button>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 52, 89, 94, 76, 85].map((height, index) => (
              <div key={index} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${height}%` }}>
                <div className="w-full bg-primary rounded-t" style={{ height: '20%' }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Transaction Methods */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <button className="text-sm text-primary hover:text-primary/80">View All</button>
          </div>
          <div className="space-y-4">
            {transactionStats.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    method.color === 'blue' ? 'bg-blue-100' :
                    method.color === 'green' ? 'bg-green-100' :
                    method.color === 'yellow' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    <method.icon className={`w-4 h-4 ${
                      method.color === 'blue' ? 'text-blue-600' :
                      method.color === 'green' ? 'text-green-600' :
                      method.color === 'yellow' ? 'text-yellow-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.title}</p>
                    <p className="text-sm text-gray-600">{method.value} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{method.percentage}%</p>
                  <p className={`text-sm ${
                    method.trend === 'up' ? 'text-green-600' :
                    method.trend === 'down' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {method.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
            <button className="text-sm text-primary hover:text-primary/80">View Map</button>
          </div>
          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{location.city}</p>
                    <p className="text-sm text-gray-600">{location.transactions.toLocaleString()} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{location.percentage}%</p>
                  <p className="text-sm text-green-600">{location.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-primary hover:text-primary/80">View All</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.customer}</p>
                    <p className="text-sm text-gray-600">{transaction.method} • {transaction.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                    <span className="text-xs text-gray-500">{transaction.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBiometricAnalytics = () => (
    <div className="space-y-6">
      {/* Biometric Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {biometricStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">{stat.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Face Pay Usage Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Face Pay Usage Over Time</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Daily</button>
            <button className="px-3 py-1 text-sm bg-primary text-white rounded-lg">Weekly</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Monthly</button>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between space-x-1">
          {[45, 67, 89, 78, 92, 85, 94, 76, 88, 91, 87, 95, 89, 93].map((height, index) => (
            <div key={index} className="flex-1 bg-primary/20 rounded-t flex flex-col justify-end" style={{ height: `${height}%` }}>
              <div className="w-full bg-primary rounded-t" style={{ height: '30%' }}></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      {/* Authentication Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Authentication Success Rates</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Face Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '97.8%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">97.8%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Liveness Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.1%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">99.1%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Voice Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">94.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Fraud Attempts Blocked</span>
                <span className="text-lg font-bold text-green-900">23</span>
              </div>
              <p className="text-xs text-green-700 mt-1">↓ 15% from last week</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Average Auth Time</span>
                <span className="text-lg font-bold text-blue-900">2.3s</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">↓ 0.4s improvement</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">False Positive Rate</span>
                <span className="text-lg font-bold text-purple-900">0.2%</span>
              </div>
              <p className="text-xs text-purple-700 mt-1">↓ 0.1% improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Analytics Dashboard" 
      subtitle="Monitor your business performance and insights"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'biometric' && renderBiometricAnalytics()}
          {(activeTab === 'transactions' || activeTab === 'customers') && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Detailed {activeTab} analytics will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
