import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningAlertProps {
  message: string;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
      <span className="text-yellow-700">{message}</span>
    </div>
  );
};

export default WarningAlert;