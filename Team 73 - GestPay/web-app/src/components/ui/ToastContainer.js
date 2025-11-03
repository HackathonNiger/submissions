'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectToasts, removeToast } from '../../lib/slices/toastSlice';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

const ToastItem = ({ toast, onRemove }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dispatch]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`${styles.bg} border rounded-lg p-4 shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          {toast.title && (
            <h4 className={`text-sm font-semibold ${styles.titleColor} mb-1`}>
              {toast.title}
            </h4>
          )}
          <p className={`text-sm ${styles.messageColor}`}>
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => dispatch(removeToast(toast.id))}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all ease-linear ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{
            animation: `shrink ${toast.duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
};

export default ToastContainer;
