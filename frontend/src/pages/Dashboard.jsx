import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Search, Bell, Users, Calendar, Plus } from 'lucide-react'

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth')
    }
  }, [isAuthenticated, loading, navigate])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600 mx-auto"></div>
          <p className="mt-4 text-deepBlue-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error if no user but authenticated (shouldn't happen)
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

  const userGroups = [
    {
      name: "Office Colleagues",
      members: 12,
      status: "active",
      nextPayout: "Dec 15, 2024",
      amount: 50000
    },
    {
      name: "Family Savings",
      members: 8,
      status: "active",
      nextPayout: "Jan 10, 2025",
      amount: 25000
    },
    {
      name: "Tech Community",
      members: 15,
      status: "pending",
      nextPayout: "Feb 1, 2025",
      amount: 75000
    }
  ]

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-deepBlue-800">
              Good Morning, {user?.firstName}
            </h1>
            <p className="text-deepBlue-600">Ready to save today?</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-deepBlue-600">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-2 text-deepBlue-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Total Savings Card */}
        <div className="bg-gradient-to-r from-deepBlue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-deepBlue-100">Total Savings</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-bold">
                  {showBalance ? '₦150,000' : '••••••'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-deepBlue-100"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-deepBlue-100">Joined Groups</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-deepBlue-300">
            <div>
              <p className="text-deepBlue-100 text-sm">Next Payout</p>
              <p className="font-semibold">Dec 15, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-deepBlue-100 text-sm">Amount</p>
              <p className="font-semibold">₦50,000</p>
            </div>
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
              className="bg-white rounded-2xl p-6 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-deepBlue-800">Create Group</span>
                <div className="w-10 h-10 bg-deepBlue-100 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-deepBlue-600" />
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/groups/join')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-deepBlue-100 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-deepBlue-800">Join Group</span>
                <Users className="w-6 h-6 text-deepBlue-600" />
              </div>
            </button>
          </div>
        </div>

        {/* My Groups */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-deepBlue-800">My Groups</h3>
            <button className="text-deepBlue-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {userGroups.map((group, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-deepBlue-800">{group.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      group.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {group.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-deepBlue-600">{group.members} members</p>
                    <p className="font-semibold text-deepBlue-800">₦{group.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-deepBlue-600">
                  <span>Next Contribution: ₦1,000</span>
                  <span>Due: {group.nextPayout}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard