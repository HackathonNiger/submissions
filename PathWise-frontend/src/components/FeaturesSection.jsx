import React from 'react';

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#101727' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-green-500">Pathwise AI?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We don't just give you resources - we give you a clear path to success
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personalized Roadmaps */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Personalized Roadmaps</h3>
            <p className="text-gray-300 leading-relaxed">
              AI-powered career paths tailored to your goals, experience level, and learning style.
            </p>
          </div>

          {/* Curated Resources */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Curated Resources</h3>
            <p className="text-gray-300 leading-relaxed">
              Hand-picked courses, tutorials, and materials - no more information overload.
            </p>
          </div>

          {/* Industry Standards */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Industry Standards</h3>
            <p className="text-gray-300 leading-relaxed">
              Learn what employers actually want. Our roadmaps are built with industry insights.
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Progress Tracking</h3>
            <p className="text-gray-300 leading-relaxed">
              Visual progress tracking with milestones to keep you motivated and on track.
            </p>
          </div>

          {/* Community Support */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 6c-.8 0-1.54.5-1.85 1.26l-1.92 5.76-2.69-2.69A1.997 1.997 0 0 0 9.18 10H3v2h5.5l3 3 .5 6h7z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Community Support</h3>
            <p className="text-gray-300 leading-relaxed">
              Connect with peers on similar journeys and get support from our community.
            </p>
          </div>

          {/* Adaptive Learning */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Adaptive Learning</h3>
            <p className="text-gray-300 leading-relaxed">
              Your roadmap evolves as you grow, ensuring you're always challenged appropriately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}