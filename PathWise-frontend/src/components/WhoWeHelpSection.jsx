import React from 'react';

export default function WhoWeHelpSection() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#101727' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Who We <span className="text-green-500">Help</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Career Changers */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className="fas fa-route text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Career Changers</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Personalized transition roadmaps from any background</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Skills gap analysis and targeted learning</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Industry insights and market trends</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Portfolio building guidance</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Interview preparation and networking</p>
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className="fas fa-graduation-cap text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Students</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Complement academic learning with practical skills</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Early career planning and goal setting</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Internship and job search preparation</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Build competitive project portfolio</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Connect with industry mentors</p>
              </div>
            </div>
          </div>

          {/* Professionals */}
          <div className="bg-gray-800 bg-opacity-30 p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <i className="fas fa-user-tie text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Professionals</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Upskill for career advancement opportunities</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Stay current with emerging technologies</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Leadership and management skill development</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Certification and specialization guidance</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">Strategic career planning and growth</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}