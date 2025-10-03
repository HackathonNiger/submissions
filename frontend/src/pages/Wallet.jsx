import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet as WalletIcon, ArrowUp, ArrowDown, Download, Shield, CreditCard, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const Wallet = () => {
  const navigate = useNavigate()
  const [showAutoWithdrawal, setShowAutoWithdrawal] = useState(false)
  const [autoWithdrawalSettings, setAutoWithdrawalSettings] = useState({
    enabled: false,
    bankAccount: '',
    percentage: 100,
    minAmount: 1000
  })

  // Wallet data
  const walletData = {
    totalBalance: 180000,
    availableBalance: 65000,
    lockedBalance: 115000,
    totalPayouts: 270000,
    totalContributions: 450000
  }

  // Sample transactions data
  const transactions = [
    {
      id: 1,
      type: 'payout',
      amount: 120000,
      description: 'Office Colleagues',
      date: 'Dec 25, 2025',
      transactionId: 'TXN987654321',
      status: 'completed',
      icon: ArrowDown,
      iconColor: 'text-green-500'
    },
    {
      id: 2,
      type: 'contribution',
      amount: 1000,
      description: 'University Friends',
      date: 'Dec 10, 2025',
      transactionId: 'TXN987654320',
      status: 'completed',
      icon: ArrowUp,
      iconColor: 'text-red-500'
    },
    {
      id: 3,
      type: 'payout',
      amount: 50000,
      description: 'Family Savings',
      date: 'Dec 5, 2025',
      transactionId: 'TXN987654319',
      status: 'completed',
      icon: ArrowDown,
      iconColor: 'text-green-500'
    },
    {
      id: 4,
      type: 'contribution',
      amount: 5000,
      description: 'Family Savings',
      date: 'Dec 1, 2025',
      transactionId: 'TXN987654318',
      status: 'pending',
      icon: ArrowUp,
      iconColor: 'text-yellow-500'
    },
    {
      id: 5,
      type: 'contribution',
      amount: 2000,
      description: 'University Friends',
      date: 'Nov 28, 2025',
      transactionId: 'TXN987654317',
      status: 'completed',
      icon: ArrowUp,
      iconColor: 'text-red-500'
    }
  ]

  const handleWithdraw = () => {
    // Implement withdrawal logic here
    console.log('Initiate withdrawal process')
  }

  const handleExport = () => {
    // Implement export logic here
    console.log('Export transaction history')
  }

  const handleAutoWithdrawalSetup = () => {
    setShowAutoWithdrawal(true)
  }

  const handleAutoWithdrawalSave = () => {
    // Save auto-withdrawal settings
    setShowAutoWithdrawal(false)
    // Implement save logic here
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const renderAutoWithdrawalModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deepBlue-100">
          <h2 className="text-xl font-bold text-deepBlue-800">Auto-Withdrawal Setup</h2>
          <button 
            onClick={() => setShowAutoWithdrawal(false)}
            className="text-deepBlue-400 hover:text-deepBlue-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                Bank Account
              </label>
              <select 
                value={autoWithdrawalSettings.bankAccount}
                onChange={(e) => setAutoWithdrawalSettings(prev => ({
                  ...prev,
                  bankAccount: e.target.value
                }))}
                className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
              >
                <option value="">Select Bank Account</option>
                <option value="1234567890">Access Bank - ••••7890</option>
                <option value="0987654321">Zenith Bank - ••••4321</option>
                <option value="1122334455">GTBank - ••••4455</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                Withdrawal Percentage
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={autoWithdrawalSettings.percentage}
                  onChange={(e) => setAutoWithdrawalSettings(prev => ({
                    ...prev,
                    percentage: parseInt(e.target.value)
                  }))}
                  className="flex-1"
                />
                <span className="text-deepBlue-600 font-medium w-12">
                  {autoWithdrawalSettings.percentage}%
                </span>
              </div>
              <p className="text-sm text-deepBlue-500 mt-1">
                Percentage of payout to automatically withdraw
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                Minimum Amount
              </label>
              <input
                type="number"
                value={autoWithdrawalSettings.minAmount}
                onChange={(e) => setAutoWithdrawalSettings(prev => ({
                  ...prev,
                  minAmount: parseInt(e.target.value)
                }))}
                className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                placeholder="Minimum amount to trigger withdrawal"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableAutoWithdrawal"
                checked={autoWithdrawalSettings.enabled}
                onChange={(e) => setAutoWithdrawalSettings(prev => ({
                  ...prev,
                  enabled: e.target.checked
                }))}
                className="w-4 h-4 text-deepBlue-600 focus:ring-deepBlue-500"
              />
              <label htmlFor="enableAutoWithdrawal" className="text-sm text-deepBlue-700">
                Enable Auto-Withdrawal
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowAutoWithdrawal(false)}
              className="flex-1 border border-deepBlue-200 text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAutoWithdrawalSave}
              className="flex-1 bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition duration-200"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-deepBlue-50">
      {/* Auto-Withdrawal Modal */}
      {showAutoWithdrawal && renderAutoWithdrawalModal()}

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-deepBlue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">My Wallet</h1>
          <div className="w-20"></div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-deepBlue-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <WalletIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-deepBlue-100">Wallet Balance</p>
                <h2 className="text-3xl font-bold">₦{walletData.totalBalance.toLocaleString()}</h2>
              </div>
            </div>
          </div>

          {/* Balance Breakdown */}
          <div className="border-t border-deepBlue-300 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-deepBlue-100">Available</span>
              <span className="font-semibold">₦{walletData.availableBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-deepBlue-100">Locked (in Groups)</span>
              <span className="font-semibold">₦{walletData.lockedBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4">
            <button 
              onClick={handleWithdraw}
              className="flex-1 bg-white text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition duration-200 flex items-center justify-center"
            >
              <ArrowUp className="w-5 h-5 mr-2" />
              Withdraw
            </button>
            <button 
              onClick={handleExport}
              className="flex-1 bg-white bg-opacity-20 text-white py-3 rounded-xl font-semibold hover:bg-opacity-30 transition duration-200 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Payouts */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowDown className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-deepBlue-600 text-sm mb-1">Total Payouts</p>
            <p className="text-2xl font-bold text-deepBlue-800">₦{walletData.totalPayouts.toLocaleString()}</p>
          </div>

          {/* Total Contributions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <ArrowUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-deepBlue-600 text-sm mb-1">Total Contributions</p>
            <p className="text-2xl font-bold text-deepBlue-800">₦{walletData.totalContributions.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 mb-6">
          <div className="p-4 border-b border-deepBlue-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-deepBlue-800">Recent Transactions</h2>
              <button className="text-deepBlue-600 text-sm font-medium">View All</button>
            </div>
          </div>

          <div className="divide-y divide-deepBlue-100">
            {transactions.map((transaction) => {
              const IconComponent = transaction.icon
              return (
                <div key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'payout' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <IconComponent className={`w-4 h-4 ${transaction.iconColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-deepBlue-800">
                            {transaction.type === 'payout' ? 'Payout' : 'Contribution'}
                          </span>
                          {getStatusIcon(transaction.status)}
                        </div>
                        <p className="text-sm text-deepBlue-600">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'payout' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'payout' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-deepBlue-500">
                    <div className="flex items-center space-x-4">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.transactionId}</span>
                    </div>
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Auto-Withdrawal Setup */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-deepBlue-800">Auto-Withdrawal Setup</h3>
              <p className="text-sm text-deepBlue-600">
                Set up automatic withdrawal to your bank account for received payouts.
              </p>
            </div>
          </div>

          <button
            onClick={handleAutoWithdrawalSetup}
            className="w-full bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition duration-200"
          >
            Setup Auto-Withdrawal
          </button>

          {/* Current Auto-Withdrawal Status */}
          {autoWithdrawalSettings.enabled && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">Auto-Withdrawal Active</p>
                  <p className="text-sm text-green-700">
                    {autoWithdrawalSettings.percentage}% of payouts to ••••{autoWithdrawalSettings.bankAccount.slice(-4)}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
          <div className="bg-deepBlue-100 rounded-xl p-3">
            <p className="text-xs text-deepBlue-600 mb-1">Total Txns</p>
            <p className="font-semibold text-deepBlue-800">{transactions.length}</p>
          </div>
          <div className="bg-green-100 rounded-xl p-3">
            <p className="text-xs text-green-600 mb-1">Completed</p>
            <p className="font-semibold text-green-800">
              {transactions.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="bg-yellow-100 rounded-xl p-3">
            <p className="text-xs text-yellow-600 mb-1">Pending</p>
            <p className="font-semibold text-yellow-800">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet