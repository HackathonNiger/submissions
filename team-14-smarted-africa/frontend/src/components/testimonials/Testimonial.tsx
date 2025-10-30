import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  role: string;
  organization?: string;
  content: string;
  avatar: string;
  isStudent?: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, organization, content, avatar, isStudent = false }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
        isStudent ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-green-400 to-teal-500'
      }`}>
        {avatar}
      </div>
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600">{role}{organization && `, ${organization}`}</p>
      </div>
    </div>
    <p className="text-gray-700 italic">"{content}"</p>
    <div className="flex mt-2 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
  </div>
);

export default Testimonial;