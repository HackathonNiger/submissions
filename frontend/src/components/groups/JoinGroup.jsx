// frontend/src/components/groups/JoinGroup.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, CheckCircle, Calendar, Clock, User, AlertCircle } from 'lucide-react'
import { api } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const JoinGroup = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('enterCode') // 'enterCode', 'reviewGroup', 'joined'
  const [groupCode, setGroupCode] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFindGroup = async () => {
    if (!groupCode.trim()) {
      setError('Please enter an invitation code')
      return
    }

    if (groupCode.length !== 6) {
      setError('Invitation code must be 6 characters')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔍 Finding group with code:', groupCode)

      // Call API to find group by code
      const response = await api.get(`/groups/find/${groupCode.toUpperCase()}`)

      console.log('✅ Group found:', response.data.group)

      setSelectedGroup(response.data.group)
      setStep('reviewGroup')

    } catch (err) {
      console.error('❌ Failed to find group:', err)
      
      if (err.statusCode === 404) {
        setError('Invalid invitation code. Group not found.')
      } else if (err.message.includes('already a member')) {
        setError('You are already a member of this group')
      } else if (err.message.includes('full')) {
        setError('This group is full and cannot accept new members')
      } else {
        setError(err.message || 'Failed to find group. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    if (!selectedGroup) return

    setIsLoading(true)
    setError(null)

    try {
      console.log('👥 Joining group:', selectedGroup._id)

      // Call API to join group
      const response = await api.post(`/groups/${selectedGroup._id}/join`)

      console.log('✅ Successfully joined group')

      setStep('joined')

    } catch (err) {
      console.error('❌ Failed to join group:', err)
      
      if (err.message.includes('already a member')) {
        setError('You are already a member of this group')
      } else if (err.message.includes('full')) {
        setError('This group is full and cannot accept new members')
      } else {
        setError(err.message || 'Failed to join group. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'reviewGroup') {
      setStep('enterCode')
      setSelectedGroup(null)
      setError(null)
    } else if (step === 'joined') {
      navigate('/groups')
    } else {
      navigate('/dashboard')
    }
  }

  const renderEnterCode = () => (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-deepBlue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Users className="w-6 h-6 text-deepBlue-600" />
        </div>
        <h3 className="text-lg font-semibold text-deepBlue-800 mb-1">Enter Group Code</h3>
        <p className="text-deepBlue-600 text-sm">Enter the 6-digit code shared by the group admin</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-1">
            Group Invitation Code
          </label>
          <input
            type="text"
            value={groupCode}
            onChange={(e) => {
              setGroupCode(e.target.value.toUpperCase())
              setError(null)
            }}
            placeholder="Enter 6-digit code (e.g., ABC123)"
            className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500 text-center text-base font-mono uppercase"
            maxLength={6}
            disabled={isLoading}
          />
          <p className="text-xs text-deepBlue-500 mt-1 text-center">
            {groupCode.length}/6 characters
          </p>
        </div>

        <button
          onClick={handleFindGroup}
          disabled={isLoading || groupCode.length !== 6}
          className="w-full bg-deepBlue-600 text-white py-2 rounded-lg font-semibold hover:bg-deepBlue-700 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" text="" />
              <span className="ml-2">Searching...</span>
            </>
          ) : (
            'Find Group'
          )}
        </button>

        <button 
          onClick={() => navigate('/groups')}
          className="w-full text-deepBlue-600 text-xs font-medium hover:underline"
        >
          Don't have a code? Go back to groups
        </button>
      </div>
    </div>
  )

  const renderReviewGroup = () => (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Group Card */}
      <div className="bg-white border border-deepBlue-200 rounded-xl p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-base font-semibold text-deepBlue-800">{selectedGroup.name}</h4>
            {selectedGroup.description && (
              <p className="text-deepBlue-600 mt-1 text-sm">{selectedGroup.description}</p>
            )}
          </div>
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Credible ({selectedGroup.credibilityScore}%)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-deepBlue-600">Members</p>
              <p className="font-semibold text-deepBlue-800 text-sm">
                {selectedGroup.members.length}/{selectedGroup.maxMembers}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-deepBlue-600">Frequency</p>
              <p className="font-semibold text-deepBlue-800 text-sm">{selectedGroup.frequency}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-deepBlue-600">Duration</p>
              <p className="font-semibold text-deepBlue-800 text-sm">{selectedGroup.duration} months</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-deepBlue-600">Admin</p>
              <p className="font-semibold text-deepBlue-800 text-sm">
                {selectedGroup.admin.firstName}
              </p>
            </div>
          </div>
        </div>

        {/* Group Details */}
        <div className="space-y-2 text-xs border-t border-deepBlue-100 pt-3">
          <div className="flex justify-between">
            <span className="text-deepBlue-600">Contribution Amount:</span>
            <span className="font-medium text-deepBlue-800">
              ₦{selectedGroup.contributionAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepBlue-600">Start Date:</span>
            <span className="font-medium text-deepBlue-800">
              {new Date(selectedGroup.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepBlue-600">Next Contribution:</span>
            <span className="font-medium text-deepBlue-800">
              {new Date(selectedGroup.nextContribution).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepBlue-600">Total Pool:</span>
            <span className="font-medium text-deepBlue-800">
              ₦{selectedGroup.totalPool.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepBlue-600">Status:</span>
            <span className={`font-medium ${
              selectedGroup.status === 'active' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {selectedGroup.status.charAt(0).toUpperCase() + selectedGroup.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Current Members */}
        <div className="mt-4">
          <h5 className="font-semibold text-deepBlue-800 mb-2 text-sm">
            Current Members ({selectedGroup.members.length})
          </h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedGroup.membersList.map((member, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-deepBlue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-deepBlue-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-deepBlue-800 text-sm">{member.name}</p>
                    <p className="text-xs text-deepBlue-500">
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.role === 'Admin' 
                    ? 'bg-deepBlue-100 text-deepBlue-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleJoinGroup}
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" text="" />
            <span className="ml-2">Joining...</span>
          </>
        ) : (
          'Join Group'
        )}
      </button>
    </div>
  )

  const renderJoined = () => (
    <div className="text-center py-6">
      <div className="flex justify-center mb-3">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-lg font-semibold text-deepBlue-800 mb-1">
        Group Joined Successfully!
      </h3>
      <p className="text-deepBlue-600 mb-4 text-sm">
        Welcome to {selectedGroup.name}. You are now part of the savings group!
      </p>
      
      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-left">
        <h4 className="font-semibold text-blue-800 text-sm mb-2">What's Next?</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Your first contribution: ₦{selectedGroup.contributionAmount.toLocaleString()}</li>
          <li>• Due date: {new Date(selectedGroup.nextContribution).toLocaleDateString()}</li>
          <li>• Frequency: {selectedGroup.frequency}</li>
        </ul>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => navigate(`/groups/${selectedGroup._id}`)}
          className="w-full bg-deepBlue-600 text-white py-2 rounded-lg font-semibold hover:bg-deepBlue-700 transition duration-200 text-sm"
        >
          View Group Details
        </button>
        <button
          onClick={() => navigate('/groups')}
          className="w-full border border-deepBlue-200 text-deepBlue-600 py-2 rounded-lg font-semibold hover:bg-deepBlue-50 transition duration-200 text-sm"
        >
          Back to All Groups
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-deepBlue-600 text-xs sm:text-sm"
              disabled={isLoading}
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Back
            </button>
            <h1 className="text-base sm:text-lg font-bold text-deepBlue-800 text-center">
              {step === 'reviewGroup' ? 'Review Group Details' : 'Join Group'}
            </h1>
            <div className="w-16"></div>
          </div>

          {/* Content */}
          {step === 'enterCode' && renderEnterCode()}
          {step === 'reviewGroup' && renderReviewGroup()}
          {step === 'joined' && renderJoined()}
        </div>
      </div>
    </div>
  )
}

export default JoinGroup