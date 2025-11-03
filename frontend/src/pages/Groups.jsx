// frontend/src/pages/Groups.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Users, Calendar, Clock, CheckCircle, Copy, Share2 } from 'lucide-react'
import groupService from '../services/groupServices'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Groups = () => {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await groupService.getUserGroups()
      setGroups(response.data.groups || [])
    } catch (err) {
      console.error('Failed to fetch groups:', err)
      setError('Failed to load groups. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = () => {
    navigate('/groups/create')
  }

  const handleJoinGroup = () => {
    navigate('/groups/join')
  }

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`)
  }

  const copyInvitationCode = (code, e) => {
    e.stopPropagation() // Prevent navigation when clicking copy
    navigator.clipboard.writeText(code)
    alert(`Invitation code ${code} copied to clipboard!`)
  }

  const shareInvitationCode = (group, e) => {
    e.stopPropagation() // Prevent navigation when clicking share
    const message = `Join my savings group "${group.name}" on AjoSave! Use code: ${group.invitationCode}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Join My Savings Group',
        text: message
      })
    } else {
      navigator.clipboard.writeText(message)
      alert('Invitation message copied to clipboard!')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderGroupCard = (group) => (
    <div 
      key={group._id}
      className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200 cursor-pointer"
      onClick={() => handleGroupClick(group._id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 bg-deepBlue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-deepBlue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-deepBlue-800 truncate">{group.name}</h4>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(group.status)}`}>
              {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {group.credibilityScore}% Credible
          </span>
        </div>
      </div>

      {/* Invitation Code - Featured */}
      <div className="bg-gradient-to-r from-deepBlue-500 to-purple-600 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/80 mb-1">Invitation Code</p>
            <p className="text-lg font-bold text-white tracking-wider">{group.invitationCode}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => copyInvitationCode(group.invitationCode, e)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Copy code"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => shareInvitationCode(group, e)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Share code"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Group Info */}
      <div className="flex justify-between items-center mb-3 text-sm text-deepBlue-600">
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{group.members.length}/{group.maxMembers} members</span>
        </div>
        <span className="font-semibold text-deepBlue-800">₦{group.contributionAmount.toLocaleString()}</span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-deepBlue-600">Frequency: {group.frequency}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-deepBlue-600 mb-1">
          <span>Progress</span>
          <span>{group.currentTurn}/{group.maxMembers} turns</span>
        </div>
        <div className="w-full bg-deepBlue-200 rounded-full h-2">
          <div 
            className="bg-deepBlue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(group.currentTurn / group.maxMembers) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Next Payout */}
      {group.nextPayout && (
        <div className="flex items-center justify-between text-sm text-deepBlue-600 pt-2 border-t border-deepBlue-100">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Next Payout:</span>
          </div>
          <span className="font-medium">{new Date(group.nextPayout).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your groups..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchGroups}
            className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-deepBlue-800">My Groups</h1>
          <button 
            onClick={handleCreateGroup}
            className="bg-deepBlue-600 text-white px-4 py-2 rounded-2xl font-semibold hover:bg-deepBlue-700 transition duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create
          </button>
        </div>

        {/* Groups List */}
        {groups.length > 0 ? (
          <div className="space-y-4 mb-8">
            {groups.map(renderGroupCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-deepBlue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">No Groups Yet</h3>
            <p className="text-deepBlue-600 mb-6">Create or join a group to start saving together</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCreateGroup}
                className="bg-deepBlue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition"
              >
                Create Group
              </button>
              <button
                onClick={handleJoinGroup}
                className="border-2 border-deepBlue-600 text-deepBlue-600 px-6 py-3 rounded-xl font-semibold hover:bg-deepBlue-50 transition"
              >
                Join Group
              </button>
            </div>
          </div>
        )}

        {/* Join Group Button */}
        {groups.length > 0 && (
          <button 
            onClick={handleJoinGroup}
            className="w-full bg-white border-2 border-dashed border-deepBlue-300 rounded-2xl p-6 hover:border-deepBlue-400 hover:bg-deepBlue-50 transition duration-200 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 bg-deepBlue-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-deepBlue-600" />
            </div>
            <span className="font-semibold text-deepBlue-700">Join a Group</span>
            <span className="text-sm text-deepBlue-500 mt-1">Enter a group code to join an existing Ajo Group</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Groups