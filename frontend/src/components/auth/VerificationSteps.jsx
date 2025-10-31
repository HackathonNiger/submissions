import React, { useState } from 'react'
import { Shield, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const VerificationSteps = ({ onComplete, onStepChange }) => {
  const { login } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    bvn: '',
    nin: '',
    dateOfBirth: '',
    address: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentStep < 3) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      onStepChange(nextStep) // Update parent component
    } else {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+2349011223344',
        isVerified: true
      }
      login(userData)
      onComplete()
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <Shield className="w-16 h-16 text-deepBlue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">BVN Verification</h3>
            <p className="text-deepBlue-600 mb-6">
              We need your Bank Number to verify your Identity
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2 text-left">
                  BVN (Bank Verification Number)
                </label>
                <input
                  type="text"
                  name="bvn"
                  value={formData.bvn}
                  onChange={handleChange}
                  placeholder="Enter your 11-digit BVN"
                  maxLength="11"
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  required
                />
              </div>
              <p className="text-sm text-deepBlue-500">
                Your BVN is encrypted and Securely Stored
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <Shield className="w-16 h-16 text-deepBlue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">NIN Verification</h3>
            <p className="text-deepBlue-600 mb-6">
              Please provide your National Identification Number
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2 text-left">
                  NIN (National Identification Number)
                </label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  placeholder="Enter your 11-digit NIN"
                  maxLength="11"
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2 text-left">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">Final Details</h3>
            <p className="text-deepBlue-600 mb-6">
              Complete your Profile to start saving
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2 text-left">
                  Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full Address"
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  required
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-700 font-medium">BVN Verified</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-medium">NIN Verified</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold mt-6 transition duration-200 ${
            currentStep === 3
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
          }`}
        >
          {currentStep === 3 ? 'Complete Verification' : 'Continue'}
        </button>
      </form>
    </div>
  )
}

export default VerificationSteps