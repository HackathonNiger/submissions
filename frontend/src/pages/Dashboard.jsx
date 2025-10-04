// frontend/src/pages/Dashboard.jsx - UPDATED WITH REAL DATA

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Search, Bell, Users, Calendar, Plus, TrendingUp, Wallet, CreditCard } from 'lucide-react'
import groupService from '../services/groupServices'
import walletService from '../services/walletServices'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [showBalance, setShowBalance] = useState(true)
  const [wallet, setWallet] = useState(null)
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData()
    }
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📊 Fetching dashboard data...')
      
      // Fetch wallet and groups in parallel
      const [walletResponse, groupsResponse] = await Promise.all([
        walletService.getMyWallet(),
        groupService.getUserGroups()
      ])

      console.log('✅ Wallet data:', walletResponse.data.wallet)
      console.log('✅ Groups data:', groupsResponse.data.groups)

      setWallet(walletResponse.data.wallet)
      setGroups(groupsResponse.data.groups || [])
      
      console.log('✅ Dashboard data loaded successfully')
    } catch (err) {
      console.error('❌ Failed to load dashboard:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth')
    }
  }, [isAuthenticated, authLoading, navigate])

  // Calculate statistics
  const activeGroups = groups.filter(g => g.status === 'active').length
  const pendingGroups = groups.filter(g => g.status === 'pending').length
  const completedGroups = groups.filter(g => g.status === 'completed').length
  
  const nextPayout = groups
    .filter(g => g.nextPayout && g.status === 'active')
    .sort((a, b) => new Date(a.nextPayout) - new Date(b.nextPayout))[0]

  const upcomingContributions = groups
    .filter(g => g.nextContribution && g.status === 'active')
    .sort((a, b) => new Date(a.nextContribution) - new Date(b.nextContribution))
    .slice(0, 3)

  // Calculate total locked across all groups
  const totalLockedInGroups = groups
    .filter(g => g.status === 'active')
    .reduce((sum, g) => sum + (g.contributionAmount * g.members.length), 0)

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // User not found state
  if (!user) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-deepBlue-600">User not found. Please login again.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="mt-4 bg-deepBlue-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-deepBlue-800">
              {getGreeting()}, {user?.firstName}
            </h1>
            <p className="text-deepBlue-600">
              {user?.isVerified ? (
                "Ready to save today?"
              ) : (
                <span className="text-yellow-600">
                  ⚠️ Please verify your account to start saving
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-deepBlue-600 hover:bg-deepBlue-100 rounded-lg transition">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-2 text-deepBlue-600 hover:bg-deepBlue-100 rounded-lg transition relative">
              <Bell className="w-6 h-6" />
              {upcomingContributions.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Verification Banner (if not verified) */}
        {!user?.isVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-1">Account Verification Required</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  Complete your account verification to create groups and make contributions.
                </p>
                <button 
                  onClick={() => navigate('/auth')}
                  className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                >
                  Verify Now →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Total Savings Card */}
        <div className="bg-gradient-to-r from-deepBlue-500 to-purple-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-deepBlue-100 text-sm">Total Balance</p>
              <div className="flex items-center space-x-3 mt-1">
                <h2 className="text-3xl font-bold">
                  {showBalance ? `₦${wallet?.totalBalance?.toLocaleString() || '0'}` : '•••••••'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-deepBlue-100 hover:text-white transition"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div>
                  <span className="text-deepBlue-200">Available: </span>
                  <span className="font-semibold">
                    {showBalance ? `₦${wallet?.availableBalance?.toLocaleString() || '0'}` : '•••'}
                  </span>
                </div>
                <div>
                  <span className="text-deepBlue-200">Locked: </span>
                  <span className="font-semibold">
                    {showBalance ? `₦${wallet?.lockedBalance?.toLocaleString() || '0'}` : '•••'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-deepBlue-100 text-sm">Active Groups</p>
              <p className="text-3xl font-bold">{activeGroups}</p>
              {pendingGroups > 0 && (
                <p className="text-deepBlue-200 text-xs mt-1">{pendingGroups} pending</p>
              )}
            </div>
          </div>
          
          {nextPayout && (
            <div className="flex justify-between items-center pt-4 border-t border-deepBlue-400">
              <div>
                <p className="text-deepBlue-100 text-sm">Next Payout</p>
                <p className="font-semibold">{new Date(nextPayout.nextPayout).toLocaleDateString()}</p>
                <p className="text-deepBlue-200 text-xs">{nextPayout.name}</p>
              </div>
              <div className="text-right">
                <p className="text-deepBlue-100 text-sm">Amount</p>
                <p className="font-semibold">
                  ₦{(nextPayout.contributionAmount * nextPayout.maxMembers).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-deepBlue-600 text-sm mb-1">Total Payouts</p>
            <p className="text-2xl font-bold text-deepBlue-800">
              ₦{wallet?.totalPayouts?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-deepBlue-600 text-sm mb-1">Total Contributions</p>
            <p className="text-2xl font-bold text-deepBlue-800">
              ₦{wallet?.totalContributions?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-deepBlue-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/groups/create')}
              disabled={!user?.isVerified}
              className={`rounded-2xl p-6 shadow-sm border transition duration-200 ${
                user?.isVerified 
                  ? 'bg-white border-deepBlue-100 hover:shadow-md' 
                  : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-deepBlue-800">Create Group</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  user?.isVerified ? 'bg-deepBlue-100' : 'bg-gray-200'
                }`}>
                  <Plus className={`w-6 h-6 ${user?.isVerified ? 'text-deepBlue-600' : 'text-gray-400'}`} />
                </div>
              </div>
              {!user?.isVerified && (
                <p className="text-xs text-gray-500 mt-2">Verification required</p>
              )}
            </button>
            
            <button 
              onClick={() => navigate('/groups/join')}
              disabled={!user?.isVerified}
              className={`rounded-2xl p-6 shadow-sm border transition duration-200 ${
                user?.isVerified 
                  ? 'bg-white border-deepBlue-100 hover:shadow-md' 
                  : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-deepBlue-800">Join Group</span>
                <Users className={`w-6 h-6 ${user?.isVerified ? 'text-deepBlue-600' : 'text-gray-400'}`} />
              </div>
              {!user?.isVerified && (
                <p className="text-xs text-gray-500 mt-2">Verification required</p>
              )}
            </button>
          </div>
        </div>

        {/* My Groups */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-deepBlue-800">My Groups</h3>
            <button 
              onClick={() => navigate('/groups')}
              className="text-deepBlue-600 text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          
          {groups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-deepBlue-100">
              <Users className="w-16 h-16 text-deepBlue-300 mx-auto mb-4" />
              <p className="text-deepBlue-600 mb-4">You haven't joined any groups yet</p>
              {user?.isVerified ? (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/groups/create')}
                    className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700"
                  >
                    Create Your First Group
                  </button>
                  <button
                    onClick={() => navigate('/groups/join')}
                    className="border-2 border-deepBlue-600 text-deepBlue-600 px-6 py-2 rounded-lg hover:bg-deepBlue-50"
                  >
                    Join a Group
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
                >
                  Verify Account to Get Started
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {groups.slice(0, 3).map((group) => (
                <div
                  key={group._id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  {/* Group Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {group.credibilityScore}% Credible
                      </span>
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-deepBlue-600" />
                      <span className="text-sm text-deepBlue-600">
                        {group.members.length}/{group.maxMembers} members
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-deepBlue-800">
                        ₦{group.contributionAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-deepBlue-600">/{group.frequency}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
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

                  {/* Next Action */}
                  {group.nextContribution && group.status === 'active' && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-deepBlue-100">
                      <div className="flex items-center space-x-1 text-deepBlue-600">
                        <Calendar className="w-4 h-4" />
                        <span>Next Contribution:</span>
                      </div>
                      <span className="font-medium text-deepBlue-800">
                        {new Date(group.nextContribution).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Contributions Alert */}
        {upcomingContributions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">Upcoming Contributions</h3>
                <div className="space-y-2">
                  {upcomingContributions.map((group) => (
                    <div key={group._id} className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">{group.name}</span>
                      <span className="font-medium text-blue-800">
                        ₦{group.contributionAmount.toLocaleString()} - {new Date(group.nextContribution).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/payment')}
                  className="mt-3 text-sm font-medium text-blue-800 hover:text-blue-900 underline"
                >
                  Make Payment →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;