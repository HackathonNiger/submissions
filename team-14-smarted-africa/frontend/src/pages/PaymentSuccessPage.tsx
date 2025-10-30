import React from 'react';
import { CheckCircle, BookOpen } from 'lucide-react';

interface PaymentSuccessPageProps {
  courseTitle: string;
  paymentMethod: string;
  onContinue: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  courseTitle,
  paymentMethod,
  onContinue
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-2">
          You've successfully subscribed to <strong>{courseTitle}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Payment method: <span className="font-medium capitalize">{paymentMethod}</span>
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-green-800">
            <BookOpen className="w-5 h-5 mr-2" />
            <span className="font-medium">Your course is ready!</span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            You can now access all lessons offline and start learning immediately.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
