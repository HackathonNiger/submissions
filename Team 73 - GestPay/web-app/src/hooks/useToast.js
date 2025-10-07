import { useDispatch } from 'react-redux';
import { addToast, removeToast, clearAllToasts } from '../lib/slices/toastSlice';

export const useToast = () => {
  const dispatch = useDispatch();

  const toast = {
    success: (message, title = 'Success', duration = 5000) => {
      dispatch(addToast({
        type: 'success',
        title,
        message,
        duration,
      }));
    },
    
    error: (message, title = 'Error', duration = 7000) => {
      dispatch(addToast({
        type: 'error',
        title,
        message,
        duration,
      }));
    },
    
    warning: (message, title = 'Warning', duration = 6000) => {
      dispatch(addToast({
        type: 'warning',
        title,
        message,
        duration,
      }));
    },
    
    info: (message, title = 'Info', duration = 5000) => {
      dispatch(addToast({
        type: 'info',
        title,
        message,
        duration,
      }));
    },
    
    remove: (id) => {
      dispatch(removeToast(id));
    },
    
    clear: () => {
      dispatch(clearAllToasts());
    },
  };

  return toast;
};
