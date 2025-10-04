// frontend/src/pages/Payment.jsx - UPDATED WITH PAYSTACK

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Shield, 
  CreditCard, 
  Download,
  Users,
  Calendar
} from 'lucide-react'
import groupService from '../services/groupServices'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Payment = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  console.log('🔑 Paystack Key:', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY)

  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [paymentStep, setPaymentStep] = useState('selectGroup')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  // Fetch user's groups on mount
  useEffect(() => {
    fetchUserGroups()
  }, [])

  const fetchUserGroups = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching user groups for payment...')
      
      const response = await groupService.getUserGroups()
      const userGroups = response.data.groups || []
      
      // Filter to show only active groups
      const activeGroups = userGroups.filter(g => g.status === 'active' || g.status === 'pending')
      
      console.log('✅ Found groups:', activeGroups.length)
      setGroups(activeGroups)
    } catch (err) {
      console.error('❌ Failed to fetch groups:', err)
      setError('Failed to load your groups')
    } finally {
      setLoading(false)
    }
  }

  const handleGroupSelect = (group) => {
    console.log('💰 Selected group for payment:', group.name)
    setSelectedGroup(group)
    setPaymentStep('paymentDetails')
    setError(null)
  }

  const initiatePaystackPayment = () => {
    if (!selectedGroup || !user) return

    setProcessing(true)
    setError(null)

    // Generate unique reference
    const reference = `AJO-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    console.log('🔄 Initiating Paystack payment:', {
      amount: selectedGroup.contributionAmount,
      email: user.email,
      reference
    })

    // Initialize Paystack Popup
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxx', // Add to .env
      email: user.email,
      amount: selectedGroup.contributionAmount * 100, // Convert to kobo
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Group Name",
            variable_name: "group_name",
            value: selectedGroup.name
          },
          {
            display_name: "Group ID",
            variable_name: "group_id",
            value: selectedGroup._id
          },
          {
            display_name: "User Name",
            variable_name: "user_name",
            value: `${user.firstName} ${user.lastName}`
          }
        ]
      },
      onClose: () => {
        console.log('❌ Payment window closed')
        setProcessing(false)
      },
      callback: (response) => {
        console.log('✅ Payment successful:', response)
        verifyPayment(response.reference)
      }
    })

    handler.openIframe()
  }

  const verifyPayment = async (reference) => {
    try {
      console.log('🔍 Verifying payment:', reference)
      setProcessing(true)

      // Call backend to verify and create transaction
      const response = await api.post('/transactions/contribution', {
        groupId: selectedGroup._id,
        reference: reference,
        amount: selectedGroup.contributionAmount
      })

      console.log('✅ Payment verified and transaction created:', response.data)

      // Store success data
      setSuccessData({
        transaction: response.data.data.transaction,
        updatedWallet: response.data.data.wallet,
        updatedGroup: response.data.data.group
      })

      setPaymentStep('paymentSuccess')
      setProcessing(false)
    } catch (err) {
      console.error('❌ Payment verification failed:', err)
      setError(err.message || 'Failed to verify payment. Please contact support.')
      setProcessing(false)
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const handleNewPayment = () => {
    setSelectedGroup(null)
    setPaymentStep('selectGroup')
    setSuccessData(null)
    setError(null)
    fetchUserGroups()
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading payment options..." />
      </div>
    )
  }

  // Select Group Screen
  const renderSelectGroup = () => (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">Make Contribution</h1>
          <div className="w-20"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">Payment Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Groups List */}
        {groups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-deepBlue-100">
            <Users className="w-16 h-16 text-deepBlue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">No Active Groups</h3>
            <p className="text-deepBlue-600 mb-6">
              You don't have any active groups requiring contributions
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/groups/create')}
                className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700"
              >
                Create Group
              </button>
              <button
                onClick={() => navigate('/groups/join')}
                className="border-2 border-deepBlue-600 text-deepBlue-600 px-6 py-2 rounded-lg hover:bg-deepBlue-50"
              >
                Join Group
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-deepBlue-800">Select Group to Contribute</h2>
              <p className="text-sm text-deepBlue-600">Choose a group to make your contribution</p>
            </div>
            
            <div className="space-y-3">
              {groups.map((group) => {
                const isDue = new Date(group.nextContribution) <= new Date()
                
                return (
                  <div
                    key={group._id}
                    onClick={() => handleGroupSelect(group)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-deepBlue-800">{group.name}</h3>
                          {isDue && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Due Now
                            </span>
                          )}
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-deepBlue-800">
                          ₦{group.contributionAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-deepBlue-600">{group.frequency}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-4 text-deepBlue-600">
                        <span>{group.members.length} members</span>
                        <span>•</span>
                        <span>{group.credibilityScore}% credible</span>
                      </div>
                      {group.nextContribution && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className={isDue ? 'text-red-600 font-medium' : 'text-deepBlue-600'}>
                            {new Date(group.nextContribution).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Payment Details Screen
  const renderPaymentDetails = () => (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setPaymentStep('selectGroup')}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800"
            disabled={processing}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">Payment Details</h1>
          <div className="w-20"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">Payment Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Payment Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-deepBlue-100">
              <span className="text-deepBlue-600">Group</span>
              <span className="font-semibold text-deepBlue-800">{selectedGroup?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-deepBlue-100">
              <span className="text-deepBlue-600">Contribution Amount</span>
              <span className="font-semibold text-deepBlue-800">
                ₦{selectedGroup?.contributionAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-deepBlue-100">
              <span className="text-deepBlue-600">Frequency</span>
              <span className="font-semibold text-deepBlue-800">{selectedGroup?.frequency}</span>
            </div>
            {selectedGroup?.nextContribution && (
              <div className="flex justify-between py-2 border-b border-deepBlue-100">
                <span className="text-deepBlue-600">Due Date</span>
                <span className="font-semibold text-deepBlue-800">
                  {new Date(selectedGroup.nextContribution).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 pt-4">
              <span className="text-lg font-semibold text-deepBlue-800">Total Amount</span>
              <span className="text-2xl font-bold text-deepBlue-800">
                ₦{selectedGroup?.contributionAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Payment Method</h2>
          
          <div className="border-2 border-deepBlue-600 rounded-xl p-4 bg-deepBlue-50">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-deepBlue-600" />
              <div className="flex-1">
                <p className="font-semibold text-deepBlue-800">Pay with Card</p>
                <p className="text-sm text-deepBlue-600">Secured by Paystack</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4 text-deepBlue-600 text-sm">
            <Shield className="w-4 h-4" />
            <span>Your payment is secured with 256-bit encryption</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={initiatePaystackPayment}
          disabled={processing}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition duration-200 flex items-center justify-center space-x-2 ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
          }`}
        >
          {processing ? (
            <>
              <LoadingSpinner size="sm" text="" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Pay ₦{selectedGroup?.contributionAmount.toLocaleString()}</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-deepBlue-500 mt-4">
          You will be redirected to Paystack to complete your payment
        </p>
      </div>
    </div>
  )

  // Success Screen
  const renderPaymentSuccess = () => (
    <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center px-4 pb-20">
      <div className="bg-white rounded-2xl shadow-lg border border-deepBlue-100 p-8 max-w-md w-full">
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
        {successData?.transaction && (
          <div className="bg-deepBlue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-deepBlue-800 mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-deepBlue-600">Transaction ID:</span>
                <span className="font-medium text-deepBlue-800">{successData.transaction.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepBlue-600">Amount:</span>
                <span className="font-medium text-deepBlue-800">
                  ₦{successData.transaction.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepBlue-600">Group:</span>
                <span className="font-medium text-deepBlue-800">{selectedGroup?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepBlue-600">Date:</span>
                <span className="font-medium text-deepBlue-800">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepBlue-600">Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>
        )}

        {/* Updated Balances */}
        {successData?.updatedWallet && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Updated Wallet</h3>
            <div className="text-sm text-blue-700">
              <p>Total Contributions: ₦{successData.updatedWallet.totalContributions.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition duration-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleNewPayment}
            className="w-full border-2 border-deepBlue-600 text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition duration-200"
          >
            Make Another Payment
          </button>
        </div>

        {/* Download Receipt (Future) */}
        <button className="w-full text-deepBlue-600 py-3 font-medium hover:text-deepBlue-700 transition duration-200 flex items-center justify-center mt-4">
          <Download className="w-5 h-5 mr-2" />
          Download Receipt
        </button>
      </div>
    </div>
  )

  // Render appropriate screen based on current step
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