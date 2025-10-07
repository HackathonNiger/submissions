'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  User,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Adebayo Johnson',
      email: 'adebayo.johnson@email.com',
      phone: '+234 801 234 5678',
      location: 'Lagos, Nigeria',
      joinDate: '2024-01-15',
      totalTransactions: 45,
      totalSpent: 2450000,
      lastTransaction: '2 hours ago',
      status: 'active',
      riskLevel: 'low',
      avatar: null,
      tags: ['VIP', 'Regular Customer']
    },
    {
      id: 2,
      name: 'Fatima Abdullahi',
      email: 'fatima.abdullahi@email.com',
      phone: '+234 802 345 6789',
      location: 'Abuja, Nigeria',
      joinDate: '2024-02-20',
      totalTransactions: 23,
      totalSpent: 890000,
      lastTransaction: '1 day ago',
      status: 'active',
      riskLevel: 'low',
      avatar: null,
      tags: ['New Customer']
    },
    {
      id: 3,
      name: 'Chinedu Okafor',
      email: 'chinedu.okafor@email.com',
      phone: '+234 803 456 7890',
      location: 'Port Harcourt, Nigeria',
      joinDate: '2023-11-10',
      totalTransactions: 78,
      totalSpent: 5670000,
      lastTransaction: '3 days ago',
      status: 'active',
      riskLevel: 'medium',
      avatar: null,
      tags: ['High Value', 'VIP']
    },
    {
      id: 4,
      name: 'Aisha Mohammed',
      email: 'aisha.mohammed@email.com',
      phone: '+234 804 567 8901',
      location: 'Kano, Nigeria',
      joinDate: '2024-03-05',
      totalTransactions: 12,
      totalSpent: 340000,
      lastTransaction: '1 week ago',
      status: 'inactive',
      riskLevel: 'low',
      avatar: null,
      tags: ['New Customer']
    },
    {
      id: 5,
      name: 'Olumide Adeyemi',
      email: 'olumide.adeyemi@email.com',
      phone: '+234 805 678 9012',
      location: 'Ibadan, Nigeria',
      joinDate: '2023-08-22',
      totalTransactions: 156,
      totalSpent: 12340000,
      lastTransaction: '5 hours ago',
      status: 'active',
      riskLevel: 'high',
      avatar: null,
      tags: ['VIP', 'High Value', 'Frequent User']
    }
  ]);

  const tabs = [
    { id: 'all', title: 'All Customers', count: customers.length },
    { id: 'active', title: 'Active', count: customers.filter(c => c.status === 'active').length },
    { id: 'inactive', title: 'Inactive', count: customers.filter(c => c.status === 'inactive').length },
    { id: 'vip', title: 'VIP', count: customers.filter(c => c.tags.includes('VIP')).length }
  ];

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.status === 'active').length.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: CheckCircle
    },
    {
      title: 'New This Month',
      value: '23',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Customer Lifetime Value',
      value: '₦4.2M',
      change: '+5%',
      trend: 'up',
      icon: CreditCard
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && customer.status === 'active') ||
                      (activeTab === 'inactive' && customer.status === 'inactive') ||
                      (activeTab === 'vip' && customer.tags.includes('VIP'));
    
    return matchesSearch && matchesTab;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const renderCustomerModal = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {selectedCustomer.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalTransactions}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedCustomer.totalSpent)}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedCustomer.lastTransaction}</p>
                <p className="text-sm text-gray-600">Last Transaction</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${
                  selectedCustomer.riskLevel === 'low' ? 'text-green-600' :
                  selectedCustomer.riskLevel === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {selectedCustomer.riskLevel.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">Risk Level</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Send Message
              </button>
              <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Transactions
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout 
      title="Customer Management" 
      subtitle="Manage and analyze your customer base"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.title} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Bulk Actions */}
          {selectedCustomers.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-3">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Send Message
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Export Selected
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.location}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {customer.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{customer.email}</p>
                        <p className="text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{customer.totalTransactions}</p>
                        <p className="text-gray-500">Last: {customer.lastTransaction}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          customer.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {customer.riskLevel} risk
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {renderCustomerModal()}
    </DashboardLayout>
  );
}
