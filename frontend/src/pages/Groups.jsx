import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Plus, Users, Calendar, Clock, CheckCircle, XCircle, Search, Share } from 'lucide-react'

const Groups = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState('myGroups') // 'myGroups' or 'groupDetail'
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showJoinGroup, setShowJoinGroup] = useState(false)

  // Handle create group navigation
  const handleCreateGroup = () => {
    navigate('/groups/create')
  }

  // Sample groups data
  const userGroups = [
    {
      id: 1,
      name: "Office Colleagues",
      description: "A contribution tool for software developers and tech professionals",
      members: 8,
      maxMembers: 10,
      amount: 10000,
      frequency: "monthly",
      status: "active",
      progress: 6,
      nextPayout: "Dec 15, 2024",
      credibility: 95,
      startDate: "September 25, 2025",
      nextContribution: "October 25, 2025",
      totalPool: 200000,
      admin: "Sarah Johnson",
      membersList: [
        { name: "Sarah Johnson", joinDate: "September 25, 2025", role: "Admin", status: "completed", turns: 1 },
        { name: "Mike Chen", joinDate: "September 25, 2025", role: "Member", status: "completed", turns: 1 },
        { name: "John Doe", joinDate: "September 26, 2025", role: "Member", status: "completed", turns: 1 },
        { name: "Jane Smith", joinDate: "September 27, 2025", role: "Member", status: "completed", turns: 1 },
        { name: "Robert Brown", joinDate: "September 28, 2025", role: "Member", status: "current", turns: 0 },
        { name: "Emily Davis", joinDate: "September 29, 2025", role: "Member", status: "pending", turns: 0 },
        { name: "Michael Wilson", joinDate: "September 30, 2025", role: "Member", status: "pending", turns: 0 },
        { name: "Sarah Thompson", joinDate: "October 1, 2025", role: "Member", status: "pending", turns: 0 }
      ]
    },
    {
      id: 2,
      name: "Family Savings",
      description: "Monthly family contribution for joint projects",
      members: 5,
      maxMembers: 8,
      amount: 5000,
      frequency: "Monthly",
      status: "active",
      progress: 3,
      nextPayout: "Jan 15, 2025",
      credibility: 88,
      startDate: "August 15, 2025",
      nextContribution: "November 15, 2025",
      totalPool: 150000,
      admin: "Mike Chen",
      membersList: [
        { name: "Mike Chen", joinDate: "August 15, 2025", role: "Admin", status: "completed", turns: 1 },
        { name: "Lisa Chen", joinDate: "August 15, 2025", role: "Member", status: "completed", turns: 1 },
        { name: "John Doe", joinDate: "August 20, 2025", role: "Member", status: "completed", turns: 1 },
        { name: "Emma Wilson", joinDate: "September 1, 2025", role: "Member", status: "current", turns: 0 },
        { name: "David Brown", joinDate: "September 5, 2025", role: "Member", status: "pending", turns: 0 }
      ]
    },
    {
      id: 3,
      name: "University Friends",
      description: "Graduation trip savings group",
      members: 12,
      maxMembers: 15,
      amount: 2000,
      frequency: "Weekly",
      status: "pending",
      progress: 2,
      nextPayout: "Mar 1, 2025",
      credibility: 92,
      startDate: "October 1, 2025",
      nextContribution: "October 8, 2025",
      totalPool: 80000,
      admin: "Emily Davis",
      membersList: [
        { name: "Emily Davis", joinDate: "October 1, 2025", role: "Admin", status: "completed", turns: 1 },
        { name: "John Doe", joinDate: "October 1, 2025", role: "Member", status: "completed", turns: 1 },
        { name: "Sarah Johnson", joinDate: "October 2, 2025", role: "Member", status: "pending", turns: 0 }
      ]
    }
  ]

  const handleGroupClick = (group) => {
    setSelectedGroup(group)
    setActiveView('groupDetail')
  }

  const handleJoinGroup = () => {
    setShowJoinGroup(true)
  }

  const handleBackToGroups = () => {
    setActiveView('myGroups')
    setSelectedGroup(null)
  }

  const renderGroupCard = (group) => (
    <div 
      key={group.id}
      className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200 cursor-pointer"
      onClick={() => handleGroupClick(group)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-deepBlue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-deepBlue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-deepBlue-800">{group.name}</h4>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              group.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {group.status === 'active' ? 'Active' : 'Pending'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Highly Credible ({group.credibility}%)
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm text-deepBlue-600">
        <span>{group.members} members</span>
        <span>₦{group.amount.toLocaleString()}</span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-deepBlue-600">Frequency: {group.frequency}</span>
        <span className={`text-sm font-medium ${
          group.status === 'active' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          {group.status === 'active' ? 'Active' : 'Pending'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-deepBlue-600 mb-1">
          <span>Progress</span>
          <span>{group.progress}/{group.maxMembers} turns</span>
        </div>
        <div className="w-full bg-deepBlue-200 rounded-full h-2">
          <div 
            className="bg-deepBlue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(group.progress / group.maxMembers) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-deepBlue-600">
        <span>Next Payout: {group.nextPayout}</span>
      </div>
    </div>
  )

  const renderGroupDetail = () => {
    if (!selectedGroup) return null

    return (
      <div className="min-h-screen bg-deepBlue-50">
        {/* Header Navigation */}
        <div className="bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToGroups}
              className="flex items-center text-deepBlue-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold text-deepBlue-800">{selectedGroup.name}</h1>
            <button className="text-deepBlue-600">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Blue Gradient Header Card - Full Width */}
        <div className="w-full px-4 md:px-8 lg:px-16 mt-6">
          <div className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5 relative shadow-md">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
                <p className="text-sm">{selectedGroup.members} members • ₦{selectedGroup.amount.toLocaleString()} {selectedGroup.frequency.toLowerCase()}</p>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium mt-2 md:mt-0">
                {selectedGroup.status}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm mb-1">Progress</p>
              <div className="w-full h-2 bg-white/30 rounded-full">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${(selectedGroup.progress / selectedGroup.maxMembers) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-2 flex-wrap gap-2">
                <span>Next payout: {selectedGroup.nextPayout}</span>
                <span>{selectedGroup.progress}/{selectedGroup.maxMembers} turns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Turn Tracker */}
        <div className="container mx-auto px-4 mt-6">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Turn Tracker</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 overflow-hidden">
            {selectedGroup.membersList.map((member, index) => (
              <div key={index} className={`flex items-center justify-between p-4 ${
                index !== selectedGroup.membersList.length - 1 ? 'border-b border-deepBlue-100' : ''
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-deepBlue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-deepBlue-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-deepBlue-800">{member.name}</span>
                      {member.role === 'Admin' && (
                        <span className="px-2 py-1 bg-deepBlue-100 text-deepBlue-700 rounded-full text-xs font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-deepBlue-500">Joined {member.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {member.status === 'completed' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                  {member.status === 'current' && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Current</span>
                    </div>
                  )}
                  {member.status === 'pending' && (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                  <div className="text-sm text-deepBlue-500">
                    Turn {member.turns + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Turn Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">Next Turn</h3>
            <p className="text-blue-700 text-sm">
              {selectedGroup.membersList.find(m => m.status === 'current')?.name || 'Waiting for next member'} is next to receive payout
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button className="flex-1 bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700 transition duration-200">
              Make Contribution
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-deepBlue-200 rounded-xl text-deepBlue-600 hover:bg-deepBlue-50 transition duration-200">
              <Search className="w-5 h-5 mr-2" />
              View Transactions
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderJoinGroupModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-deepBlue-100">
          <button 
            onClick={() => setShowJoinGroup(false)}
            className="flex items-center text-deepBlue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-lg font-semibold text-deepBlue-800">Join Group</h2>
          <div className="w-20"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-deepBlue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-deepBlue-600" />
            </div>
            <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">Enter Group</h3>
            <p className="text-deepBlue-600">Enter the 6-digit code shared by the group admin</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                Group Invitation Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code (e.g., ABC123)"
                className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
              />
            </div>

            <button className="w-full bg-deepBlue-600 text-white py-3 rounded-lg font-semibold hover:bg-deepBlue-700 transition duration-200">
              Find Group
            </button>

            <button className="w-full text-deepBlue-600 text-sm font-medium hover:underline">
              Don't have a code? Browse Public Groups
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (activeView === 'groupDetail') {
    return renderGroupDetail()
  }

  return (
    <div className="min-h-screen bg-deepBlue-50">
      {/* Join Group Modal */}
      {showJoinGroup && renderJoinGroupModal()}

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
        <div className="space-y-4 mb-8">
          {userGroups.map(renderGroupCard)}
        </div>

        {/* Join Group Button */}
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
      </div>
    </div>
  )
}

export default Groups