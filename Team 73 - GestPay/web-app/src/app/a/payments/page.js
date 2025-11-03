'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Search, Filter, Download, Plus, Calendar,
  Camera, Mic, MessageSquare, CreditCard,
  ArrowUpRight, ArrowDownRight, Clock,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock transactions data
  const transactions = [
    {
      id: 'TXN001',
      type: 'received',
      method: 'facepay',
      amount: 25000,
      from: 'Sarah Johnson',
      to: 'You',
      description: 'Payment for web development services',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      reference: 'REF-001-2024'
    },
    {
      id: 'TXN002',
      type: 'sent',
      method: 'voicepay',
      amount: 15500,
      from: 'You',
      to: 'Mike Chen',
      description: 'Lunch payment at restaurant',
      date: '2024-01-15T09:15:00Z',
      status: 'completed',
      reference: 'REF-002-2024'
    },
    {
      id: 'TXN003',
      type: 'received',
      method: 'socialpay',
      amount: 75000,
      from: 'David Wilson',
      to: 'You',
      description: 'WhatsApp transfer for freelance work',
      date: '2024-01-15T08:45:00Z',
      status: 'completed',
      reference: 'REF-003-2024'
    },
    {
      id: 'TXN004',
      type: 'sent',
      method: 'facepay',
      amount: 8200,
      from: 'You',
      to: 'Coffee Shop Lagos',
      description: 'Morning coffee and pastry',
      date: '2024-01-15T07:30:00Z',
      status: 'completed',
      reference: 'REF-004-2024'
    },
    {
      id: 'TXN005',
      type: 'received',
      method: 'voicepay',
      amount: 120000,
      from: 'Alice Brown',
      to: 'You',
      description: 'Payment for mobile app development',
      date: '2024-01-14T16:20:00Z',
      status: 'completed',
      reference: 'REF-005-2024'
    },
    {
      id: 'TXN006',
      type: 'sent',
      method: 'socialpay',
      amount: 35000,
      from: 'You',
      to: 'John Smith',
      description: 'Telegram payment for design work',
      date: '2024-01-14T14:10:00Z',
      status: 'pending',
      reference: 'REF-006-2024'
    },
    {
      id: 'TXN007',
      type: 'received',
      method: 'facepay',
      amount: 95000,
      from: 'Tech Solutions Ltd',
      to: 'You',
      description: 'Consulting fee payment',
      date: '2024-01-14T11:45:00Z',
      status: 'failed',
      reference: 'REF-007-2024'
    }
  ];

  const getMethodIcon = (method) => {
    switch (method) {
      case 'facepay': return Camera;
      case 'voicepay': return Mic;
      case 'socialpay': return MessageSquare;
      default: return CreditCard;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'facepay': return 'text-blue-600 bg-blue-100';
      case 'voicepay': return 'text-green-600 bg-green-100';
      case 'socialpay': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatAmount = (amount, type) => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
    
    return type === 'sent' ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
      title="Payments" 
      subtitle="View and manage all your payment transactions"
      actions={headerActions}
    >
      <div className="space-y-6">
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="received">Received</option>
                <option value="sent">Sent</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Date Range</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History ({filteredTransactions.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => {
                  const MethodIcon = getMethodIcon(transaction.method);
                  const methodColor = getMethodColor(transaction.method);
                  const StatusIcon = getStatusIcon(transaction.status);
                  const statusColor = getStatusColor(transaction.status);
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-8 rounded-full ${
                            transaction.type === 'received' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="flex items-center space-x-2">
                              {transaction.type === 'received' ? (
                                <ArrowDownRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {transaction.type === 'received' ? 'From' : 'To'}: {
                                  transaction.type === 'received' ? transaction.from : transaction.to
                                }
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              ID: {transaction.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${methodColor}`}>
                            <MethodIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-gray-900 capitalize">
                            {transaction.method.replace('pay', ' Pay')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusColor}`}>
                            <StatusIcon className="w-3 h-3" />
                          </div>
                          <span className="text-sm text-gray-900 capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {transaction.reference}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
