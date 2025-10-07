import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [careerPathsCount, setCareerPathsCount] = useState(0);
  const [successRateCount, setSuccessRateCount] = useState(0);

  useEffect(() => {
    const animateCounters = () => {
      const duration = 4000;// 4seconds
      const steps = 60; // 60 steps for smooth animation
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStudentsCount(Math.floor(10000 * progress));
        setCareerPathsCount(Math.floor(500 * progress));
        setSuccessRateCount(Math.floor(95 * progress));

        if (currentStep >= steps) {
          clearInterval(interval);
          // Set final values to ensure exact numbers
          setStudentsCount(10000);
          setCareerPathsCount(500);
          setSuccessRateCount(95);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const cleanup = animateCounters();
    return cleanup;
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6" style={{ background: 'linear-gradient(135deg, #1a4a3a 0%, #2d5a4a 20%, #101727 50%, #0f2419 80%, #101727 100%)' }}>
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-gray-800 bg-opacity-50 px-6 py-3 rounded-full mb-12 border border-gray-700 mt-7">
          <span className="text-2xl">🚀</span>
          <span className="text-green-400 font-medium">Your personalized career journey starts here</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Career Roadmap,
          <br />
          <span className="text-green-500">Personalized & Guided</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Stop wandering through endless courses. Get a step-by-step roadmap 
          tailored to your goals, from beginner to industry standard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-w-48">
            Start Your Journey
          </button>
          <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-w-48">
            Watch Demo
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
              {studentsCount.toLocaleString()}+
            </div>
            <div className="text-gray-400 text-lg">Students Guided</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
              {careerPathsCount}+
            </div>
            <div className="text-gray-400 text-lg">Career Paths</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
              {successRateCount}%
            </div>
            <div className="text-gray-400 text-lg">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}