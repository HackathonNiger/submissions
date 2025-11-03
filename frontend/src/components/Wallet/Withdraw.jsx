import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Download, Wallet as WalletIcon } from 'lucide-react'

const Withdraw = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('form') // 'form', 'success'
  const [formData, setFormData] = useState({
    amount: '',
    bank: '',
    accountNumber: ''
  })
  const [availableBalance, setAvailableBalance] = useState(65000)
  const [isAnimating, setIsAnimating] = useState(false)

  const banks = [
    'Access Bank',
    'United Bank for Africa (UBA)',
    'GTBank',
    'First Bank',
    'Zenith Bank',
    'Union Bank',
    'Fidelity Bank',
    'Ecobank',
    'Stanbic IBTC',
    'Sterling Bank'
  ]

  const withdrawalFee = 50
  const totalAmount = parseFloat(formData.amount) || 0
  const totalWithFee = totalAmount + withdrawalFee

  useEffect(() => {
    if (step === 'success') {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleWithdraw = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.amount || !formData.bank || !formData.accountNumber) {
      alert('Please fill in all fields')
      return
    }

    if (totalAmount > availableBalance) {
      alert('Insufficient balance')
      return
    }

    if (totalAmount < 100) {
      alert('Minimum withdrawal amount is ₦100')
      return
    }

    // Simulate API call
    setStep('success')
  }

  const handleBackToWallet = () => {
    navigate('/wallet')
  }

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    console.log('Downloading receipt...')
    alert('Receipt downloaded successfully!')
  }

  const renderForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-deepBlue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <WalletIcon className="w-6 h-6 text-deepBlue-600" />
        </div>
        <h2 className="text-lg font-bold text-deepBlue-800 mb-1">Withdraw Funds</h2>
        <p className="text-deepBlue-600 text-sm">Transfer funds from your AjoSave Wallet to your bank account</p>
      </div>

      <form onSubmit={handleWithdraw} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-1">
            Amount (₦)
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="Enter Amount"
            className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500 text-sm"
            min="100"
            max={availableBalance}
          />
          <p className="text-xs text-deepBlue-500 mt-1">
            Available: ₦{availableBalance.toLocaleString()}
          </p>
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-1">
            Bank
          </label>
          <select
            value={formData.bank}
            onChange={(e) => handleInputChange('bank', e.target.value)}
            className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500 text-sm"
          >
            <option value="">Select Bank</option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-1">
            Account Number
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter account number"
            className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500 text-sm"
            maxLength={10}
          />
        </div>

        {/* Transaction Summary */}
        <div className="bg-deepBlue-50 rounded-lg p-3">
          <h4 className="font-semibold text-deepBlue-800 mb-2 text-sm">Transaction Summary</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Amount:</span>
              <span className="font-medium text-deepBlue-800">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Fee:</span>
              <span className="font-medium text-deepBlue-800">
                ₦{withdrawalFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-deepBlue-200 pt-1">
              <span className="text-deepBlue-800 font-semibold">Total:</span>
              <span className="font-semibold text-deepBlue-800">
                ₦{totalWithFee.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> A ₦50 transaction fee will be charged for this withdrawal.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 text-sm"
        >
          Withdraw Funds
        </button>
      </form>
    </div>
  )

  const renderSuccess = () => {
    const transactionId = `WTH${Date.now()}`
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-deepBlue-800 mb-1">
            Withdrawal Successful!
          </h2>
          <p className="text-deepBlue-600 text-sm">
            Your funds are on the way to your bank account
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-deepBlue-50 rounded-lg p-4">
          <div className="text-center mb-3">
            <p className="text-xs text-deepBlue-600 mb-1">Withdrawal Amount</p>
            <p className="text-2xl font-bold text-deepBlue-800">
              ₦{parseFloat(formData.amount).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Bank:</span>
              <span className="font-medium text-deepBlue-800">{formData.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Account:</span>
              <span className="font-medium text-deepBlue-800">
                ***{formData.accountNumber.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Transaction ID:</span>
              <span className="font-medium text-deepBlue-800">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Processing Time:</span>
              <span className="font-medium text-deepBlue-800">{currentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Status:</span>
              <span className="font-medium text-green-600">Successfully</span>
            </div>
            <div className="flex justify-between border-t border-deepBlue-200 pt-1">
              <span className="text-deepBlue-600">Fee:</span>
              <span className="font-medium text-deepBlue-800">₦50</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleBackToWallet}
            className="w-full bg-deepBlue-600 text-white py-2 rounded-lg font-semibold hover:bg-deepBlue-700 transition duration-200 text-sm"
          >
            Back to Wallet
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="w-full border border-deepBlue-200 text-deepBlue-600 py-2 rounded-lg font-semibold hover:bg-deepBlue-50 transition duration-200 flex items-center justify-center text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Download Receipt
          </button>
        </div>

        {/* Processing Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <p className="text-xs text-green-700 text-center">
            Funds will be credited to your bank account within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          {/* Header - Only back arrow, no title */}
          <div className="flex items-center mb-4">
            <button 
              onClick={() => step === 'form' ? navigate('/wallet') : setStep('form')}
              className="flex items-center text-deepBlue-600 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>

          {/* Content */}
          {step === 'form' && renderForm()}
          {step === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  )
}

export default Withdraw