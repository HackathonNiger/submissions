import React, { useState } from 'react';
import { BookOpen, User, Clock, Star, RotateCcw } from 'lucide-react';
import CaptchaComponent from '../components/auth/CaptchaComponent';
import { Course } from './CoursesPage';

interface SubscriptionPageProps {
  course: Course;
  onBack: () => void;
  onProceedToCheckout: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  course,
  onBack,
  onProceedToCheckout
}) => {
  const [subscriptionDuration, setSubscriptionDuration] = useState<'monthly' | 'quarterly' | 'yearly'>('yearly');
  const [captchaSolved, setCaptchaSolved] = useState(false);

  const VAT_RATE = 0.075;

  const getDurationMultiplier = () => {
    switch (subscriptionDuration) {
      case 'quarterly': return 2.7;
      case 'yearly': return 10;
      default: return 1;
    }
  };

  const calculateTotalPrice = () => {
    const base = course.basePrice * getDurationMultiplier();
    return base * (1 + VAT_RATE);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Subscribe to {course.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                    <p className="text-gray-600 mt-1">by {course.instructor}</p>
                  </div>
                  <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium text-gray-800">4.8</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{course.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Plan</h3>

              <div className="space-y-3 mb-6">
                {(['monthly', 'quarterly', 'yearly'] as const).map((duration) => (
                  <label key={duration} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
                    <input
                      type="radio"
                      name="duration"
                      checked={subscriptionDuration === duration}
                      onChange={() => setSubscriptionDuration(duration)}
                      className="h-4 w-4 text-green-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium capitalize">
                        {duration}
                        {duration === 'quarterly' && ' (10% off)'}
                        {duration === 'yearly' && ' (16.7% off)'}
                      </span>
                      <p className="text-sm text-gray-500">
                        ₦{Math.round(course.basePrice * (duration === 'quarterly' ? 2.7 : duration === 'yearly' ? 10 : 1)).toLocaleString()} / {duration}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Price:</span>
                  <span>₦{Math.round(course.basePrice * getDurationMultiplier()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">VAT (7.5%):</span>
                  <span>₦{Math.round(course.basePrice * getDurationMultiplier() * VAT_RATE).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">₦{Math.round(calculateTotalPrice()).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <CaptchaComponent
                onSolve={setCaptchaSolved}
                solved={captchaSolved}
              />

              <button
                onClick={onProceedToCheckout}
                disabled={!captchaSolved}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
