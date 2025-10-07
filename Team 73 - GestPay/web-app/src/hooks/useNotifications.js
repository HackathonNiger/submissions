import { useState, useEffect } from 'react';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '../lib/api/gestpayApi';
import { useToast } from './useToast';

export const useNotifications = (initialParams = {}) => {
  const toast = useToast();
  const [params, setParams] = useState({
    limit: 20,
    ...initialParams
  });

  // Get notifications
  const { data: notificationsData, isLoading, error, refetch } = useGetNotificationsQuery(params);

  // Mark as read mutation
  const [markAsReadMutation, { isLoading: isMarkingAsRead }] = useMarkNotificationAsReadMutation();

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await markAsReadMutation(notificationId).unwrap();
      refetch();
    } catch (error) {
      toast.error('Failed to mark notification as read', 'Error');
    }
  };

  // Update filter parameters
  const updateFilters = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  useEffect(() => {
    if (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [error]);

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notificationsData?.data?.unread_count || 0;

  return {
    // Data
    notifications,
    unreadCount,
    // Loading states
    isLoading,
    error,
    isMarkingAsRead,
    // Actions
    refetch,
    markAsRead,
    updateFilters,
    // Current params
    currentParams: params,
  };
};
