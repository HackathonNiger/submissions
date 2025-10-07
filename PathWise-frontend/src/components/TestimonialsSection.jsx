import React from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah",
      role: "Career Changer",
      text: "Pathwise AI helped me transition from marketing to software development in just 8 months. The personalized roadmap was exactly what I needed.",
      avatar: "bg-gradient-to-br from-pink-400 to-purple-600"
    },
    {
      name: "Alex",
      role: "Student",
      text: "As a computer science student, Pathwise AI showed me the practical skills I needed beyond my coursework. Landed my dream internship!",
      avatar: "bg-gradient-to-br from-blue-400 to-cyan-600"
    },
    {
      name: "Marcus",
      role: "Professional",
      text: "The adaptive learning feature kept me engaged throughout my upskilling journey. Now I'm leading a team of developers at my company.",
      avatar: "bg-gradient-to-br from-green-400 to-emerald-600"
    },
    {
      name: "Emily",
      role: "Freelancer",
      text: "The curated resources saved me hundreds of hours. I went from beginner to landing my first client project in record time.",
      avatar: "bg-gradient-to-br from-orange-400 to-red-600"
    },
    {
      name: "David",
      role: "Team Lead",
      text: "Our entire development team uses Pathwise AI for continuous learning. The progress tracking helps us stay aligned with industry standards.",
      avatar: "bg-gradient-to-br from-indigo-400 to-purple-600"
    },
    {
      name: "Lisa",
      role: "Bootcamp Grad",
      text: "After completing my bootcamp, Pathwise AI filled in the gaps and helped me become job-ready. Got hired within 2 weeks!",
      avatar: "bg-gradient-to-br from-teal-400 to-blue-600"
    }
  ];

  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#101727' }}>
      <div className="max-w-6xl mx-auto">{/* Constrain to show ~3 cards */}
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by <span className="text-green-500">Students</span> and  <span className="text-green-500">Professionals</span>
          </h2>
        </div>

        {/* Moving testimonials container */}
        <div className="relative">
          <div className="flex animate-scroll space-x-6 w-max">
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 w-80 bg-gray-800 bg-opacity-40 p-6 rounded-2xl border border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatar} flex items-center justify-center`}>
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">@{testimonial.role.toLowerCase().replace(' ', '')}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 w-80 bg-gray-800 bg-opacity-40 p-6 rounded-2xl border border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatar} flex items-center justify-center`}>
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">@{testimonial.role.toLowerCase().replace(' ', '')}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h3 className="text-3xl font-semibold text-white mb-4">
            Start Your Career With PathWise AI
          </h3>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Get personalized career guidance in minutes. Free to start, easy to use.
          </p>
          <a href="/auth">
            <button 
              className="px-8 py-4 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ background: '#00a73e' }}
            >
              Sign Up Now
            </button>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        /* Hide horizontal scrollbar */
        body {
          overflow-x: hidden;
        }
      `}</style>
    </section>
  );
}