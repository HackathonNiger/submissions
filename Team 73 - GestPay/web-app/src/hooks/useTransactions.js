import { useState, useEffect } from 'react';

import {
  useGetTransactionsQuery,
  useGetTransactionQuery
} from '../lib/api/gestpayApi';

export const useTransactions = (initialParams = {}) => {
  const [params, setParams] = useState({
    limit: 20,
    offset: 0,
    ...initialParams
  });

  const { data: transactionsData, isLoading, error, refetch } = useGetTransactionsQuery(params);

  useEffect(() => {
    if (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [error]);

  const updateFilters = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams, offset: 0 }));
  };

  const loadMore = () => {
    const currentOffset = params.offset || 0;
    const limit = params.limit || 20;
    setParams(prev => ({ ...prev, offset: currentOffset + limit }));
  };

  const resetPagination = () => {
    setParams(prev => ({ ...prev, offset: 0 }));
  };

  // Transform API data to match expected structure
  const rawTransactions = transactionsData?.data || [];
  
  // Debug logging
  console.log('useTransactions Debug:', {
    transactionsData,
    rawTransactions,
    isLoading,
    error
  });
  
  const transactions = rawTransactions.map((transaction, index) => ({
    ...transaction,
    id: transaction.id || transaction.reference || `transaction-${index}`,
    feature: transaction.app_feature || transaction.feature,
    created_at: transaction.date || transaction.created_at
  }));
  const pagination = transactionsData?.data?.pagination || {};

  return {
    transactions,
    pagination,
    isLoading,
    error,
    refetch,
    updateFilters,
    loadMore,
    resetPagination,
    currentParams: params
  };
};

export const useTransaction = (transactionId) => {
  const { data: transactionData, isLoading, error, refetch } = useGetTransactionQuery(transactionId, {
    skip: !transactionId
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching transaction:', error);
    }
  }, [error]);

  return {
    transaction: transactionData?.data,
    isLoading,
    error,
    refetch
  };
};
