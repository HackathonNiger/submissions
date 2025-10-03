import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Shield, CreditCard, Share, Download } from 'lucide-react'

const Payment = () => {
  const navigate = useNavigate()
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [paymentStep, setPaymentStep] = useState('selectGroup') // 'selectGroup', 'paymentDetails', 'paymentSuccess'
  const [paymentMethod, setPaymentMethod] = useState('paystack')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    pin: '',
    token: ''
  })

  // Sample groups data with payment status
  const userGroups = [
    {
      id: 1,
      name: "Office Colleagues",
      credibility: 95,
      members: 8,
      amountDue: 1000,
      dueDate: "Dec 25, 2025",
      status: "due", // due, upcoming, paid
      nextContribution: "Jan 25, 2025"
    },
    {
      id: 2,
      name: "Family Savings",
      credibility: 88,
      members: 5,
      amountDue: 5000,
      dueDate: "Jan 15, 2025",
      status: "upcoming",
      nextContribution: "Feb 15, 2025"
    },
    {
      id: 3,
      name: "University Friends",
      credibility: 92,
      members: 12,
      amountDue: 2000,
      dueDate: "Dec 10, 2025",
      status: "paid",
      nextContribution: "Jan 10, 2025"
    }
  ]

  // Sample transaction history
  const recentTransactions = [
    {
      id: 1,
      groupName: "Office Colleagues",
      date: "Dec 25, 2025",
      transactionId: "TXN1234567",
      amount: 1000,
      status: "completed",
      type: "contribution"
    },
    {
      id: 2,
      groupName: "Family Savings",
      date: "Dec 20, 2025",
      transactionId: "TXN1234568",
      amount: 5000,
      status: "completed",
      type: "contribution"
    },
    {
      id: 3,
      groupName: "University Friends",
      date: "Dec 15, 2025",
      transactionId: "TXN1234569",
      amount: 2000,
      status: "completed",
      type: "contribution"
    }
  ]

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setPaymentStep('paymentDetails')
  }

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('paymentSuccess')
    }, 2000)
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const handleNewPayment = () => {
    setSelectedGroup(null)
    setPaymentStep('selectGroup')
  }

  const handleCardDetailChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return value
  }

  const renderSelectGroup = () => (
    <div className="min-h-screen bg-deepBlue-50">
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
          <h1 className="text-xl font-bold text-deepBlue-800">Make Contribution</h1>
          <div className="w-20"></div>
        </div>

        {/* Due Payments Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Payment Due</h3>
              <p className="text-yellow-700 text-sm">
                You have pending contributions. Please make payments to maintain group credibility.
              </p>
            </div>
          </div>
        </div>

        {/* Due Payments */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Due Payments</h2>
          <div className="space-y-3">
            {userGroups.filter(group => group.status === 'due').map(group => (
              <div 
                key={group.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => handleGroupSelect(group)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-deepBlue-800">{group.name}</h3>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1">
                      Highly Credible ({group.credibility}%)
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Due Now
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-deepBlue-600 mb-2">
                  <span>{group.members} members</span>
                  <span>Amount Due: ₦{group.amountDue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-deepBlue-600">Due date: {group.dueDate}</span>
                  <span className="text-red-600 font-semibold">Overdue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Upcoming Payments</h2>
          <div className="space-y-3">
            {userGroups.filter(group => group.status === 'upcoming').map(group => (
              <div 
                key={group.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => handleGroupSelect(group)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-deepBlue-800">{group.name}</h3>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1">
                      Highly Credible ({group.credibility}%)
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Upcoming
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-deepBlue-600 mb-2">
                  <span>{group.members} members</span>
                  <span>Amount: ₦{group.amountDue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-deepBlue-600">
                  <span>Due date: {group.dueDate}</span>
                  <span>Next: {group.nextContribution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contributions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-deepBlue-800">Recent Contributions</h2>
            <button className="text-deepBlue-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-deepBlue-800">{transaction.groupName}</span>
                  <span className="text-red-600 font-semibold">-₦{transaction.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-deepBlue-600">
                  <div className="flex items-center space-x-2">
                    <span>{transaction.date}</span>
                    <span>•</span>
                    <span>{transaction.transactionId}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentDetails = () => (
    <div className="min-h-screen bg-deepBlue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setPaymentStep('selectGroup')}
            className="flex items-center text-deepBlue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">Payment Details</h1>
          <div className="w-20"></div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Payment Details</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-deepBlue-600">Contribution to:</span>
              <span className="font-semibold text-deepBlue-800">{selectedGroup?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-deepBlue-600">Amount:</span>
              <span className="font-semibold text-deepBlue-800">₦{selectedGroup?.amountDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-deepBlue-600">Due Date:</span>
              <span className="font-semibold text-deepBlue-800">{selectedGroup?.dueDate}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-deepBlue-800 mb-3">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-deepBlue-200 rounded-lg cursor-pointer hover:bg-deepBlue-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paystack"
                  checked={paymentMethod === 'paystack'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-deepBlue-600 focus:ring-deepBlue-500"
                />
                <CreditCard className="w-5 h-5 text-deepBlue-600" />
                <span className="font-medium">Pay with Paystack</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 text-deepBlue-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>Your payment is secured with 256-bit encryption</span>
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'paystack' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardDetails.cardNumber)}
                  onChange={(e) => handleCardDetailChange('cardNumber', e.target.value)}
                  maxLength={19}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formatExpiryDate(cardDetails.expiryDate)}
                    onChange={(e) => handleCardDetailChange('expiryDate', e.target.value)}
                    maxLength={5}
                    className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardDetailChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                    PIN
                  </label>
                  <input
                    type="password"
                    placeholder="Enter PIN"
                    value={cardDetails.pin}
                    onChange={(e) => handleCardDetailChange('pin', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                    Token
                  </label>
                  <input
                    type="text"
                    placeholder="Enter token"
                    value={cardDetails.token}
                    onChange={(e) => handleCardDetailChange('token', e.target.value)}
                    className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            className="w-full bg-deepBlue-600 text-white py-4 rounded-xl font-semibold hover:bg-deepBlue-700 transition duration-200 mt-6"
          >
            Pay ₦{selectedGroup?.amountDue.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )

  const renderPaymentSuccess = () => (
    <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-deepBlue-800 mb-2">Payment Successful!</h2>
          <p className="text-deepBlue-600">
            Your contribution to {selectedGroup?.name} has been processed successfully.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-deepBlue-50 rounded-xl p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Amount:</span>
              <span className="font-semibold text-deepBlue-800">₦{selectedGroup?.amountDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Group:</span>
              <span className="font-semibold text-deepBlue-800">{selectedGroup?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Transaction ID:</span>
              <span className="font-semibold text-deepBlue-800">TXN{Date.now().toString().slice(-7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepBlue-600">Date:</span>
              <span className="font-semibold text-deepBlue-800">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition duration-200"
          >
            Back to Dashboard
          </button>
          <button className="w-full border border-deepBlue-200 text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition duration-200 flex items-center justify-center">
            <Share className="w-5 h-5 mr-2" />
            Share Success
          </button>
        </div>

        {/* Download Receipt */}
        <button className="w-full text-deepBlue-600 py-3 font-medium hover:text-deepBlue-700 transition duration-200 flex items-center justify-center mt-4">
          <Download className="w-5 h-5 mr-2" />
          Download Receipt
        </button>
      </div>
    </div>
  )

  // Render appropriate view based on current step
  switch (paymentStep) {
    case 'selectGroup':
      return renderSelectGroup()
    case 'paymentDetails':
      return renderPaymentDetails()
    case 'paymentSuccess':
      return renderPaymentSuccess()
    default:
      return renderSelectGroup()
  }
}

export default Payment