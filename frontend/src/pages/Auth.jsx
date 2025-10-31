// // import React, { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { useAuth } from '../context/AuthContext'
// // import Login from '../components/auth/Login'
// // import Signup from '../components/auth/Signup'
// // import VerificationSteps from '../components/auth/VerificationSteps'
// // import { ArrowLeft } from 'lucide-react'

// // const Auth = () => {
// //   const [activeTab, setActiveTab] = useState('login')
// //   const [showVerification, setShowVerification] = useState(false)
// //   const [currentStep, setCurrentStep] = useState(1) // track step progress from VerificationSteps
// //   const navigate = useNavigate()
// //   const { isAuthenticated, loading } = useAuth()

// //   useEffect(() => {
// //     if (!loading && isAuthenticated) {
// //       navigate('/dashboard')
// //     }
// //   }, [isAuthenticated, loading, navigate])

// //   const handleLogin = (userData) => {
// //     setShowVerification(true)
// //   }

// //   const handleSignup = (userData) => {
// //     // Signup logic handled in Signup component
// //   }

// //   const handleVerificationComplete = () => {
// //     navigate('/dashboard')
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
// //       </div>
// //     )
// //   }

// //   if (showVerification) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
// //         <div className="container mx-auto px-4 max-w-md">

// //           {/* Identity Verification header */}
// //           <div className="text-center mb-4">
// //             <h2 className="text-lg font-semibold text-deepBlue-800">Identity Verification</h2>
// //             <p className="text-sm text-deepBlue-600">Step {currentStep} of 3</p>
// //           </div>

// //           {/* Progress Bar */}
// //           <div className="w-full bg-deepBlue-200 rounded-full h-2 mb-6">
// //             <div
// //               className="bg-deepBlue-600 h-2 rounded-full transition-all duration-300"
// //               style={{ width: `${(currentStep / 3) * 100}%` }}
// //             ></div>
// //           </div>

// //           {/* Back Button */}
// //           <button
// //             onClick={() => setShowVerification(false)}
// //             className="flex items-center text-deepBlue-600 mb-6"
// //           >
// //             <ArrowLeft className="w-5 h-5 mr-2" />
// //             Back
// //           </button>

// //           {/* Verification Steps */}
// //           <VerificationSteps
// //             onComplete={handleVerificationComplete}
// //             onStepChange={setCurrentStep} // keep parent step in sync
// //           />
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
// //       <div className="container mx-auto px-4 max-w-md">
// //         <div className="bg-white rounded-2xl shadow-lg p-6">
// //           <div className="text-center mb-8">
// //             <h2 className="text-2xl font-bold text-deepBlue-800">Welcome Back</h2>
// //           </div>

// //           {/* Tab Navigation */}
// //           <div className="flex mb-6 bg-deepBlue-50 rounded-lg p-1">
// //             <button
// //               onClick={() => setActiveTab('login')}
// //               className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
// //                 activeTab === 'login'
// //                   ? 'bg-white text-deepBlue-600 shadow-sm'
// //                   : 'text-deepBlue-500'
// //               }`}
// //             >
// //               Login
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('signup')}
// //               className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
// //                 activeTab === 'signup'
// //                   ? 'bg-white text-deepBlue-600 shadow-sm'
// //                   : 'text-deepBlue-500'
// //               }`}
// //             >
// //               Sign Up
// //             </button>
// //           </div>

// //           {/* Tab Content */}
// //           {activeTab === 'login' ? (
// //             <Login onLogin={handleLogin} />
// //           ) : (
// //             <Signup onSignup={handleSignup} />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Auth

// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import Login from '../components/auth/Login'
// import Signup from '../components/auth/Signup'
// import VerificationSteps from '../components/auth/VerificationSteps'
// import { ArrowLeft } from 'lucide-react'

// const Auth = () => {
//   const [activeTab, setActiveTab] = useState('login')
//   const [showVerification, setShowVerification] = useState(false)
//   const [currentStep, setCurrentStep] = useState(1)
//   const navigate = useNavigate()
//   const { isAuthenticated, loading } = useAuth()

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate('/dashboard')
//     }
//   }, [isAuthenticated, loading, navigate])

//   const handleLogin = (userData) => {
//     setShowVerification(true)
//   }

//   const handleSignup = (userData) => {
//     // Signup logic handled inside Signup component
//   }

//   const handleVerificationComplete = () => {
//     navigate('/dashboard')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
//       </div>
//     )
//   }

//   if (showVerification) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
//         <div className="container mx-auto px-4 max-w-md">

//           {/* Identity Verification header */}
//           <div className="text-center mb-4">
//             <h2 className="text-lg font-semibold text-deepBlue-800">Identity Verification</h2>
//             <p className="text-sm text-deepBlue-600">Step {currentStep} of 3</p>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full bg-deepBlue-200 rounded-full h-2 mb-6">
//             <div
//               className="bg-deepBlue-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${(currentStep / 3) * 100}%` }}
//             ></div>
//           </div>

//           {/* Back Button (for verification flow) */}
//           <button
//             onClick={() => setShowVerification(false)}
//             className="flex items-center text-deepBlue-600 mb-6"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back
//           </button>

//           {/* Verification Steps */}
//           <VerificationSteps
//             onComplete={handleVerificationComplete}
//             onStepChange={setCurrentStep}
//           />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
//       <div className="container mx-auto px-4 max-w-md">
//         <div className="bg-white rounded-2xl shadow-lg p-6">

//           {/* Auth Card Header with Back Arrow */}
//           <div className="flex items-center justify-center mb-8 relative">
//             <button
//               onClick={() => navigate('/')} // navigate home (or adjust as needed)
//               className="absolute left-0 flex items-center text-deepBlue-600 hover:text-deepBlue-800"
//             >
//               <ArrowLeft className="w-5 h-5 mr-1" />
//               <span className="text-sm">Back</span>
//             </button>
//             <h2 className="text-2xl font-bold text-deepBlue-800">Welcome Back</h2>
//           </div>

//           {/* Tab Navigation */}
//           <div className="flex mb-6 bg-deepBlue-50 rounded-lg p-1">
//             <button
//               onClick={() => setActiveTab('login')}
//               className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
//                 activeTab === 'login'
//                   ? 'bg-white text-deepBlue-600 shadow-sm'
//                   : 'text-deepBlue-500'
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => setActiveTab('signup')}
//               className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
//                 activeTab === 'signup'
//                   ? 'bg-white text-deepBlue-600 shadow-sm'
//                   : 'text-deepBlue-500'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Tab Content */}
//           {activeTab === 'login' ? (
//             <Login onLogin={handleLogin} />
//           ) : (
//             <Signup onSignup={handleSignup} />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Auth
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'
import VerificationSteps from '../components/auth/VerificationSteps'
import { ArrowLeft } from 'lucide-react'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [showVerification, setShowVerification] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, loading, navigate])

  const handleLogin = (userData) => {
    setShowVerification(true)
  }

  const handleSignup = (userData) => {
    // Signup logic handled inside Signup component
  }

  const handleVerificationComplete = () => {
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
        <div className="container mx-auto px-4 max-w-md">

          {/* Identity Verification header */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-deepBlue-800">Identity Verification</h2>
            <p className="text-sm text-deepBlue-600">Step {currentStep} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-deepBlue-200 rounded-full h-2 mb-6">
            <div
              className="bg-deepBlue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>

          {/* Back Button (for verification flow) */}
          <button
            onClick={() => setShowVerification(false)}
            className="flex items-center text-deepBlue-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* Verification Steps */}
          <VerificationSteps
            onComplete={handleVerificationComplete}
            onStepChange={setCurrentStep}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6">

          {/* Auth Card Header with Back Arrow */}
          <div className="flex items-center justify-center mb-8 relative">
            <button
              onClick={() => navigate('/')} // navigate home (or adjust as needed)
              className="absolute left-0 flex items-center text-deepBlue-600 hover:text-deepBlue-800"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">Back</span>
            </button>
            <h2 className="text-2xl font-bold text-deepBlue-800">Welcome Back</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-deepBlue-50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-deepBlue-600 shadow-sm'
                  : 'text-deepBlue-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
                activeTab === 'signup'
                  ? 'bg-white text-deepBlue-600 shadow-sm'
                  : 'text-deepBlue-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'login' ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Signup onSignup={handleSignup} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
