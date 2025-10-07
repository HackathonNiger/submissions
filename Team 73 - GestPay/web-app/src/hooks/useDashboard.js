import { useGetDashboardQuery } from '../lib/api/gestpayApi';

export const useDashboard = () => {
  const { 
    data: dashboardData, 
    isLoading,
    error,
    refetch 
  } = useGetDashboardQuery();
  
  const dashboard = dashboardData?.data || {};
  
  // Debug logging
  console.log('useDashboard Debug:', {
    dashboardData,
    dashboard,
    recentTransactions: dashboard.recent_transactions,
    isLoading,
    error
  });
  
  return {
    // User info
    user: dashboard.user || {},
    
    // Statistics
    stats: dashboard.stats || {
      total_transactions: 0,
      total_sent: '0.00',
      total_received: '0.00',
      pending_transactions: 0
    },
    
    // Recent transactions - transform to match expected structure
    recentTransactions: (dashboard.recent_transactions || []).map((transaction, index) => ({
      ...transaction,
      id: transaction.id || transaction.reference || `dashboard-transaction-${index}`,
      feature: transaction.app_feature || transaction.feature,
      created_at: transaction.date || transaction.created_at
    })),
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    refetch,
  };
};
