import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/images/logo.JPG' // Keep your logo import

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Users className="w-8 h-8 text-green-400 rounded" />,
      title: "Join Trusted Groups",
      description: "Save with Verified Community Members"
    },
    {
      icon: <Shield className="w-8 h-8 text-deepBlue-600" />,
      title: "Secure and Transparent",
      description: "All Transactions are tracked and Verified"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Grow your Savings",
      description: "Disciplined Saving with regular payout"
    }
  ]

  // Redirect authenticated users to dashboard automatically
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGetStarted = () => {
    // If not authenticated, go to auth page
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="AjoSave Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-dark-400 mb-2">AjoSave</h1>
          <p className="text-xl text-dark-300">Digital Community Saving Made Simple</p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-dark-300 mb-2">
                {feature.title}
              </h3>
              <p className="text-black-200">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Get Started Section */}
        <div className="text-center">
          <button
            onClick={handleGetStarted}
            className="bg-deepBlue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-deepBlue-700 transition duration-200 mb-4 flex items-center justify-center mx-auto"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="text-sm text-black-600">
            By Continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
