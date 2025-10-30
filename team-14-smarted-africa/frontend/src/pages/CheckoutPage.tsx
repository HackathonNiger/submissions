import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, CheckCircle, RotateCcw } from 'lucide-react';
import { Course } from './CoursesPage';

interface CheckoutPageProps {
  course: Course;
  onBack: () => void;
  onComplete: (paymentMethod: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ course, onBack, onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState('paystack');

  const paymentMethods = [
    { id: 'paystack', name: 'Paystack', icon: CreditCard, color: 'bg-green-100 text-green-700' },
    { id: 'interswitch', name: 'Interswitch', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
    { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'bg-purple-100 text-purple-700' },
    { id: 'bank', name: 'Bank Transfer', icon: Banknote, color: 'bg-gray-100 text-gray-700' },
    { id: 'crypto', name: 'Cryptocurrency', icon: Smartphone, color: 'bg-yellow-100 text-yellow-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Back to Subscription
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout: {course.title}</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="sr-only"
                />
                <div className={`p-2 rounded-lg ${method.color}`}>
                  <method.icon className="w-5 h-5" />
                </div>
                <span className="ml-3 font-medium text-gray-900">{method.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => onComplete(selectedMethod)}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
