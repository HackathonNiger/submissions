import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
      <span className="text-green-700">{message}</span>
    </div>
  );
};

export default SuccessAlert;