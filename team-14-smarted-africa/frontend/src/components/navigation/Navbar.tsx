import React, { useState, useEffect } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { translations } from '../../utils/translations';

const Navbar = ({
  currentLanguage,
  onLanguageChange,
  showAutoDetect,
  onAuthClick,
  user,
  onLogout,
  currentPage,
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target: string) => {
    // Handle section anchors (scroll to section on landing page)
    if (['features', 'audience', 'testimonials', 'team', 'contact'].includes(target)) {
      if (currentPage !== 'landing') {
        onNavigate('landing');
        setTimeout(() => {
          const element = document.getElementById(target);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    }

    // ✅ Fix: handle both dashboard and StudentDashboard navigation
    else if (target === 'dashboard' || target === 'StudentDashboard') {
      onNavigate('StudentDashboard');
      setIsMenuOpen(false);
    }

    // Handle normal pages
    else if (['landing', 'courses'].includes(target)) {
      onNavigate(target);
      setIsMenuOpen(false);
    }
  };

  const getTranslation = (key, fallback) =>
    translations[currentLanguage]?.[key] ?? fallback;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-green-600" />
            <span
              className="ml-2 text-xl font-bold text-green-600 cursor-pointer"
              onClick={() => handleNavClick('landing')}
            >
              SmartEd Africa
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => handleNavClick('features')} className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              {getTranslation('features', 'Features')}
            </button>
            <button onClick={() => handleNavClick('audience')} className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              {getTranslation('solutions', 'Solutions')}
            </button>
            <button onClick={() => handleNavClick('testimonials')} className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              {getTranslation('successStories', 'Success Stories')}
            </button>
            <button onClick={() => handleNavClick('team')} className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              {getTranslation('ourTeam', 'Our Team')}
            </button>
            <button onClick={() => handleNavClick('courses')} className="text-gray-600 hover:text-green-600 font-medium">
              Courses
            </button>
            <button onClick={() => handleNavClick('contact')} className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              {getTranslation('contact', 'Contact')}
            </button>

            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              showAutoDetect={showAutoDetect}
            />

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={() => handleNavClick('StudentDashboard')}
                  className="text-green-600 font-medium hover:underline transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:from-red-600 hover:to-orange-600 transition-all text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAuthClick('login')}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                {getTranslation('login', 'Login')}
              </button>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              showAutoDetect={showAutoDetect}
            />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <button onClick={() => handleNavClick('features')} className="text-gray-600 hover:text-green-600 font-medium py-2 text-left">
                {getTranslation('features', 'Features')}
              </button>
              <button onClick={() => handleNavClick('audience')} className="text-gray-600 hover:text-green-600 font-medium py-2 text-left">
                {getTranslation('solutions', 'Solutions')}
              </button>
              <button onClick={() => handleNavClick('testimonials')} className="text-gray-600 hover:text-green-600 font-medium py-2 text-left">
                {getTranslation('successStories', 'Success Stories')}
              </button>
              <button onClick={() => handleNavClick('team')} className="text-gray-600 hover:text-green-600 font-medium py-2 text-left">
                {getTranslation('ourTeam', 'Our Team')}
              </button>
              <button onClick={() => handleNavClick('courses')} className="text-gray-600 hover:text-green-600 font-medium py-2 text-left">
                Courses
              </button>
              <button onClick={() => handleNavClick('contact')} className="text-gray-600 hover:text-green-600 font-medium py-2 text-left">
                {getTranslation('contact', 'Contact')}
              </button>

              {user ? (
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => handleNavClick('StudentDashboard')}
                    className="w-full border-2 border-green-600 text-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    onClick={() => {
                      onAuthClick('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-full font-medium hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    {getTranslation('login', 'Login')}
                  </button>
                  <button
                    onClick={() => {
                      onAuthClick('signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full border-2 border-green-600 text-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
                  >
                    {getTranslation('signup', 'Sign Up')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
