import React, { useState } from 'react';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';
import CaptchaComponent from '../auth/CaptchaComponent';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  courseId, 
  courseTitle 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaSolved) {
      setGlobalError('Please complete the security verification');
      return;
    }
    
    if (comment.trim().length < 10) {
      setGlobalError('Please write a review with at least 10 characters');
      return;
    }
    
    setIsSubmitting(true);
    setGlobalError('');
    setGlobalSuccess('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGlobalSuccess('Thank you for your review! It will help other students.');
      setTimeout(() => {
        onClose();
        setComment('');
        setRating(5);
        setCaptchaSolved(false);
        setGlobalSuccess('');
      }, 3000);
    } catch (error) {
      setGlobalError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gradient-to-br from-teal-50 to-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-900">{courseTitle}</h3>
          <p className="text-sm text-gray-600">Share your experience with this course</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="text-2xl focus:outline-none">
                  <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What did you like about this course? How can it be improved?"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
          </div>
          
          <CaptchaComponent onSolve={setCaptchaSolved} solved={captchaSolved} />
          
          {globalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{globalError}</span>
            </div>
          )}
          
          {globalSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">{globalSuccess}</span>
            </div>
          )}
          
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !captchaSolved || comment.trim().length < 10}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;