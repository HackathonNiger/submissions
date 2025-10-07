// COMPLETE FIXED Payment.jsx

// Save this as: frontend/src/pages/Payment.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  ArrowLeft, CheckCircle, Clock, AlertCircle, 
  Shield, CreditCard, Users, Calendar
} from 'lucide-react'
import groupService from '../services/groupServices'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Payment = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [paymentStep, setPaymentStep] = useState('selectGroup')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  useEffect(() => {
    fetchUserGroups()
  }, [])

  const fetchUserGroups = async () => {
    try {
      setLoading(true)
      const response = await groupService.getUserGroups()
      const userGroups = response.data.groups || []
      const activeGroups = userGroups.filter(g => g.status === 'active' || g.status === 'pending')
      setGroups(activeGroups)
    } catch (err) {
      setError('Failed to load your groups')
    } finally {
      setLoading(false)
    }
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setPaymentStep('paymentDetails')
    setError(null)
  }

  const initiatePaystackPayment = () => {
    if (!selectedGroup || !user) return
    setProcessing(true)
    setError(null)

    const reference = `AJO-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: selectedGroup.contributionAmount * 100,
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: "Group Name", variable_name: "group_name", value: selectedGroup.name },
          { display_name: "Group ID", variable_name: "group_id", value: selectedGroup._id }
        ]
      },
      onClose: () => setProcessing(false),
      callback: (response) => verifyPayment(response.reference)
    })

    handler.openIframe()
  }

  /**
   * Verifies the Paystack reference with the backend and updates state.
   * Uses defensive coding (optional chaining) to prevent UI crash for submission.
   */
  const verifyPayment = async (reference) => {
    try {
      setProcessing(true)
      const response = await api.post('/transactions/contribution', {
        groupId: selectedGroup._id,
        reference,
        amount: selectedGroup.contributionAmount
      })

      // FIX: Access the deepest data payload (response.data.data) or the direct data 
      // (response.data) if the API helper unwrapped the response. This is more robust.
      const payload = response.data.data || response.data
      
      setSuccessData({
        // Use optional chaining (?) to prevent "Cannot read properties of undefined"
        transaction: payload?.transaction,
        updatedWallet: payload?.wallet,
        updatedGroup: payload?.group
      })

      setPaymentStep('paymentSuccess')
      setProcessing(false)
    } catch (err) {
      // Log the full error, but only display a user-friendly message
      console.error('Payment verification failed:', err)
      setError(err.response?.data?.message || 'Failed to verify payment')
      setProcessing(false)
    }
  }

  // Select Group Screen
  const renderSelectGroup = () => (
    <div className="space-y-4">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-deepBlue-600 hover:text-deepBlue-700 mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-deepBlue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-8 h-8 text-deepBlue-600" />
        </div>
        <h1 className="text-2xl font-bold text-deepBlue-800 mb-2">Make Contribution</h1>
        <p className="text-deepBlue-600">Select a group to contribute to</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-deepBlue-300 mx-auto mb-4" />
          <p className="text-deepBlue-600 mb-4">You're not part of any active groups yet</p>
          <button
            onClick={() => navigate('/groups/create')}
            className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700"
          >
            Create a Group
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => handleGroupSelect(group)}
              className="w-full bg-white border-2 border-deepBlue-100 rounded-xl p-4 hover:border-deepBlue-500 transition text-left"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-deepBlue-800 mb-1">{group.name}</h3>
                  <p className="text-sm text-deepBlue-600 mb-2">{group.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-deepBlue-500">
                    <span>₦{group.contributionAmount.toLocaleString()} / {group.frequency}</span>
                    <span>•</span>
                    <span>{group.members.length}/{group.maxMembers} members</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="bg-deepBlue-100 text-deepBlue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {group.status}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // Payment Details Screen
  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <button onClick={() => setPaymentStep('selectGroup')} className="flex items-center text-deepBlue-600 hover:text-deepBlue-700 mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Groups
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-deepBlue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-8 h-8 text-deepBlue-600" />
        </div>
        <h1 className="text-2xl font-bold text-deepBlue-800 mb-2">Confirm Payment</h1>
        <p className="text-deepBlue-600">Review your contribution details</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white border-2 border-deepBlue-100 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-deepBlue-800 mb-4">Group Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-deepBlue-600">Group:</span><span className="font-medium text-deepBlue-800">{selectedGroup?.name}</span></div>
          <div className="flex justify-between"><span className="text-deepBlue-600">Frequency:</span><span className="font-medium text-deepBlue-800">{selectedGroup?.frequency}</span></div>
          <div className="flex justify-between"><span className="text-deepBlue-600">Members:</span><span className="font-medium text-deepBlue-800">{selectedGroup?.members.length}/{selectedGroup?.maxMembers}</span></div>
          <div className="border-t border-deepBlue-100 pt-3 flex justify-between"><span className="text-deepBlue-600">Contribution Amount:</span><span className="text-2xl font-bold text-deepBlue-800">₦{selectedGroup?.contributionAmount.toLocaleString()}</span></div>
        </div>
      </div>

      <button onClick={initiatePaystackPayment} disabled={processing} className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'}`}>
        {processing ? (
          <><LoadingSpinner size="sm" text="" /><span>Processing...</span></>
        ) : (
          <><CreditCard className="w-5 h-5" /><span>Pay ₦{selectedGroup?.contributionAmount.toLocaleString()}</span></>
        )}
      </button>

      <p className="text-center text-sm text-deepBlue-500 mt-4">You will be redirected to Paystack to complete your payment</p>
    </div>
  )

  // FIXED Success Screen with proper null checks
  const renderPaymentSuccess = () => (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-deepBlue-800 mb-2">Payment Successful!</h2>
        <p className="text-deepBlue-600">Your contribution to {selectedGroup?.name} has been processed successfully.</p>
      </div>

      {successData?.transaction ? (
        <div className="bg-deepBlue-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-deepBlue-800 mb-3">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-deepBlue-600">Transaction ID:</span><span className="font-medium text-deepBlue-800">{successData.transaction.transactionId}</span></div>
            <div className="flex justify-between"><span className="text-deepBlue-600">Amount:</span><span className="font-medium text-deepBlue-800">₦{successData.transaction.amount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-deepBlue-600">Group:</span><span className="font-medium text-deepBlue-800">{selectedGroup?.name}</span></div>
            <div className="flex justify-between"><span className="text-deepBlue-600">Status:</span><span className="font-medium text-green-600">Completed</span></div>
          </div>
        </div>
      ) : (
        <div className="bg-deepBlue-50 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-deepBlue-600">Payment processed successfully. Details will appear in your transaction history.</p>
        </div>
      )}

      {successData?.updatedWallet && (
        <div className="bg-gradient-to-r from-deepBlue-500 to-purple-600 rounded-xl p-4 mb-6 text-white">
          <p className="text-sm opacity-90 mb-1">New Total Contributions</p>
          <p className="text-3xl font-bold">₦{successData.updatedWallet.totalContributions.toLocaleString()}</p>
        </div>
      )}

      <div className="space-y-3">
        <button onClick={() => navigate('/dashboard')} className="w-full bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition">Back to Dashboard</button>
        <button onClick={() => navigate(`/groups/${selectedGroup?._id}`)} className="w-full border-2 border-deepBlue-600 text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition">View Group Details</button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center pb-20">
        <LoadingSpinner text="Loading your groups..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-deepBlue-100 p-6">
          {paymentStep === 'selectGroup' && renderSelectGroup()}
          {paymentStep === 'paymentDetails' && renderPaymentDetails()}
          {paymentStep === 'paymentSuccess' && renderPaymentSuccess()}
        </div>
      </div>
    </div>
  )
}

export default Payment
