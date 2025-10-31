// frontend/src/components/wallet/BankAccountModal.jsx - NEW FILE

import React, { useState } from 'react'
import { X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const BankAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankCode: '',
    accountName: ''
  })
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState(null)
  const [verified, setVerified] = useState(false)

  // Nigerian banks
  const banks = [
    { name: 'Access Bank', code: '044' },
    { name: 'Citibank', code: '023' },
    { name: 'Ecobank Nigeria', code: '050' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'First Bank of Nigeria', code: '011' },
    { name: 'First City Monument Bank', code: '214' },
    { name: 'Globus Bank', code: '00103' },
    { name: 'Guaranty Trust Bank', code: '058' },
    { name: 'Heritage Bank', code: '030' },
    { name: 'Keystone Bank', code: '082' },
    { name: 'Polaris Bank', code: '076' },
    { name: 'Providus Bank', code: '101' },
    { name: 'Stanbic IBTC Bank', code: '221' },
    { name: 'Standard Chartered Bank', code: '068' },
    { name: 'Sterling Bank', code: '232' },
    { name: 'Union Bank of Nigeria', code: '032' },
    { name: 'United Bank for Africa', code: '033' },
    { name: 'Unity Bank', code: '215' },
    { name: 'Wema Bank', code: '035' },
    { name: 'Zenith Bank', code: '057' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
    setVerified(false)
  }

  const verifyAccountNumber = async () => {
    if (!formData.accountNumber || !formData.bankCode) {
      setError('Please select bank and enter account number')
      return
    }

    if (formData.accountNumber.length !== 10) {
      setError('Account number must be 10 digits')
      return
    }

    try {
      setVerifying(true)
      setError(null)

      console.log('🔍 Verifying account:', formData)

      // Call backend to verify with Paystack
      const response = await api.post('/wallets/verify-account', {
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode
      })

      console.log('✅ Account verified:', response.data)

      setFormData(prev => ({
        ...prev,
        accountName: response.data.data.accountName
      }))
      setVerified(true)

    } catch (err) {
      console.error('❌ Verification failed:', err)
      setError(err.message || 'Failed to verify account. Please check details.')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!verified) {
      setError('Please verify account number first')
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('💾 Saving bank account...')

      const selectedBank = banks.find(b => b.code === formData.bankCode)

      // Call backend to save and create Paystack recipient
      const response = await api.post('/wallets/add-bank-account', {
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        bankCode: formData.bankCode,
        bankName: selectedBank.name
      })

      console.log('✅ Bank account saved:', response.data)

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data.data.bankAccount)
      }

      // Close modal
      onClose()

    } catch (err) {
      console.error('❌ Failed to save bank account:', err)
      setError(err.message || 'Failed to save bank account')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deepBlue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-deepBlue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-deepBlue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-deepBlue-800">Add Bank Account</h2>
              <p className="text-sm text-deepBlue-600">For receiving payouts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-deepBlue-400 hover:text-deepBlue-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {verified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Account Verified!</p>
                  <p className="text-sm text-green-700">{formData.accountName}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                Select Bank *
              </label>
              <select
                name="bankCode"
                value={formData.bankCode}
                onChange={handleChange}
                disabled={loading || verifying}
                required
                className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
              >
                <option value="">Choose your bank</option>
                {banks.map(bank => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                Account Number *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="0123456789"
                  maxLength="10"
                  disabled={loading || verifying}
                  required
                  className="flex-1 px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                />
                <button
                  type="button"
                  onClick={verifyAccountNumber}
                  disabled={loading || verifying || !formData.accountNumber || !formData.bankCode}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    verifying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : verified
                      ? 'bg-green-600 text-white'
                      : 'bg-deepBlue-600 text-white hover:bg-deepBlue-700'
                  }`}
                >
                  {verifying ? (
                    <LoadingSpinner size="sm" text="" />
                  ) : verified ? (
                    '✓'
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
              <p className="text-xs text-deepBlue-500 mt-1">
                {formData.accountNumber.length}/10 digits
              </p>
            </div>

            {/* Account Name (Read-only after verification) */}
            {verified && (
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  disabled
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This account will be used to receive your group payouts. 
              Make sure the details are correct.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-2 border-deepBlue-600 text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !verified}
              className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center ${
                loading || !verified
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                'Save Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BankAccountModal