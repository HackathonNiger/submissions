import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/navigation/Navbar';
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import StudentDashboard from './pages/StudentDashboard';
import AIChat from './components/chat/AIChat';
import AuthModal from './components/auth/AuthModal';
import ReviewModal from './components/reviews/ReviewModal';
import { translations as _translations } from './utils/translations';
import { Course } from './pages/CoursesPage';

// -------------------- Types --------------------
interface UserSubscription {
  plan: 'free' | 'premium' | 'pro';
  status: 'active' | 'expired' | 'none';
  courseId?: string;
  expiresAt?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  subscription: UserSubscription;
}

// -------------------- Main App --------------------
const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showAutoTranslatePopup, setShowAutoTranslatePopup] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [showAutoDetect, setShowAutoDetect] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<
    'landing' | 'courses' | 'subscription' | 'checkout' | 'payment-success' | 'StudentDashboard'
  >('landing');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewCourse, setReviewCourse] = useState<{ id: string; title: string } | null>(null);

  // A safe demo user used when real user is not present (prevents blank screen)
  const demoUser: User = {
    id: 'demo_user',
    email: 'demo@student.africa',
    name: 'Demo Student',
    subscription: {
      plan: 'free',
      status: 'active',
      courseId: selectedCourse?.id || 'demo-course',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  // -------------------- Auth Check --------------------
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('smarted_auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const mockUser: User = {
        id: 'user_123',
        email: 'student@example.com',
        name: 'Chiamaka Okonkwo',
        subscription: {
          plan: 'free',
          status: 'active',
          courseId: 'waec-maths',
          expiresAt: '2025-12-31',
        },
      };

      setUser(mockUser);
      setDashboardLoading(true);

      // Delay to show welcome animation then load dashboard
      setTimeout(() => {
        setDashboardLoading(false);
        setDashboardReady(true);
        setCurrentPage('StudentDashboard');
      }, 2500);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('smarted_auth_token');
      setUser(null);
      setCurrentPage('landing');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // -------------------- Mock Language Detection --------------------
  useEffect(() => {
    const detectLanguage = () => {
      const random = Math.random();
      let lang = 'en';

      if (random < 0.25) lang = 'ig';
      else if (random < 0.5) lang = 'yo';
      else if (random < 0.75) lang = 'ha';

      setDetectedLanguage(lang);
      setShowAutoDetect(lang !== 'en');
      setShowAutoTranslatePopup(lang !== 'en');
    };

    detectLanguage();
  }, []);

  // -------------------- Handlers --------------------
  const handleTranslateAccept = () => {
    setCurrentLanguage(detectedLanguage);
    setShowAutoTranslatePopup(false);
  };

  const handleTranslateDecline = () => setShowAutoTranslatePopup(false);

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: User) => {
    localStorage.setItem('smarted_auth_token', 'mock_jwt_token');
    setUser(userData);
    setDashboardLoading(true);
    setTimeout(() => {
      setDashboardLoading(false);
      setDashboardReady(true);
      setCurrentPage('StudentDashboard');
    }, 2500);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('smarted_auth_token');
    setUser(null);
    setCurrentPage('landing');
    setDashboardReady(false);
  };

  const handleCourseSubscribe = (course: Course) => {
    setSelectedCourse(course);
    setCurrentPage('subscription');
  };

  const handleWriteReview = (courseId: string, courseTitle: string) => {
    setReviewCourse({ id: courseId, title: courseTitle });
    setIsReviewModalOpen(true);
  };

  // -------------------- Loading / Welcome Transition --------------------
  if (isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center transition-all duration-700">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            {dashboardLoading ? 'Preparing your Dashboard...' : 'Loading SmartEd Africa...'}
          </h2>
          <p className="text-gray-600 mt-2">
            {dashboardLoading ? 'Welcome to your Dashboard 🎓' : 'Preparing your AI-powered learning experience'}
          </p>
        </div>
      </div>
    );
  }

  // -------------------- Main Render --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 transition-all duration-700">
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        showAutoDetect={showAutoDetect}
        onAuthClick={handleAuthClick}
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-full shadow-lg hover:from-green-700 hover:to-teal-700 transition-all"
        aria-label="Open AI Chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} currentLanguage={currentLanguage} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        authType={authType}
        currentLanguage={currentLanguage}
        onSuccess={handleAuthSuccess}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        courseId={reviewCourse?.id || ''}
        courseTitle={reviewCourse?.title || ''}
      />

      {/* -------------------- Auto Translate Popup -------------------- */}
      {showAutoTranslatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Language Detected</h3>
            </div>
            <p className="text-gray-600 mb-4">
              We detected that you might prefer{' '}
              <strong>
                {detectedLanguage === 'ig'
                  ? '🇳🇬 Igbo'
                  : detectedLanguage === 'yo'
                  ? '🇳🇬 Yoruba'
                  : detectedLanguage === 'ha'
                  ? '🇳🇬 Hausa'
                  : 'English'}
              </strong>
              . Would you like to translate this page?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleTranslateAccept}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Yes, Translate
              </button>
              <button
                onClick={handleTranslateDecline}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                No, Keep English
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Page Rendering -------------------- */}
      {!dashboardReady && currentPage === 'landing' && (
        <LandingPage
          currentLanguage={currentLanguage}
          onAuthClick={handleAuthClick}
          onNavigateToCourses={() => setCurrentPage('courses')}
        />
      )}

      {!dashboardReady && currentPage === 'courses' && (
        <CoursesPage
          currentLanguage={currentLanguage}
          onSubscribe={handleCourseSubscribe}
          onWriteReview={handleWriteReview}
        />
      )}

      {!dashboardReady && currentPage === 'subscription' && selectedCourse && (
        <SubscriptionPage
          course={selectedCourse}
          onBack={() => setCurrentPage('courses')}
          onProceedToCheckout={() => setCurrentPage('checkout')}
        />
      )}

      {!dashboardReady && currentPage === 'checkout' && selectedCourse && (
        <CheckoutPage
          course={selectedCourse}
          onBack={() => setCurrentPage('subscription')}
          onComplete={(method) => {
            setPaymentMethod(method);
            setCurrentPage('payment-success');
          }}
        />
      )}

      {!dashboardReady && currentPage === 'payment-success' && selectedCourse && (
        <PaymentSuccessPage
          courseTitle={selectedCourse.title}
          paymentMethod={paymentMethod}
          onContinue={() => {
            if (user) {
              const updatedUser: User = {
                ...user,
                subscription: {
                  plan: 'premium',
                  status: 'active',
                  courseId: selectedCourse.id,
                  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
              };
              setUser(updatedUser);
            }
            setDashboardLoading(true);
            setTimeout(() => {
              setDashboardLoading(false);
              setDashboardReady(true);
              setCurrentPage('StudentDashboard');
            }, 2500);
          }}
        />
      )}

      {dashboardReady && currentPage === 'StudentDashboard' && (
        <StudentDashboard user={user ?? demoUser} />
      )}
    </div>
  );
};

export default App;
