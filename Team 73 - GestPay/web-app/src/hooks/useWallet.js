import { 
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
  useSendMoneyMutation 
} from '../lib/api/gestpayApi';
import { useToast } from './useToast';

export const useWallet = () => {
  const toast = useToast();
  
  // Queries
  const { 
    data: balanceData, 
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance 
  } = useGetWalletBalanceQuery();
  
  const { 
    data: transactionsData, 
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions 
  } = useGetWalletTransactionsQuery();
  
  // Mutations
  const [sendMoneyMutation, { isLoading: isSendingMoney }] = useSendMoneyMutation();
  
  // Send money function
  const sendMoney = async (transferData) => {
    try {
      const result = await sendMoneyMutation(transferData).unwrap();
      
      toast.success(
        `Successfully sent ₦${transferData.amount} to ${result.data.recipient}`,
        'Transfer Successful'
      );
      
      // Refetch balance and transactions
      refetchBalance();
      refetchTransactions();
      
      return result;
    } catch (error) {
      const errorMessage = error?.data?.message || 'Transfer failed. Please try again.';
      toast.error(errorMessage, 'Transfer Failed');
      throw error;
    }
  };

  return {
    // Balance
    balance: balanceData?.data?.balance || '0.00',
    currency: balanceData?.data?.currency || 'NGN',
    isBalanceLoading,
    balanceError,
    refetchBalance,
    
    // Transactions
    transactions: transactionsData?.data?.transactions || [],
    isTransactionsLoading,
    transactionsError,
    refetchTransactions,
    
    // Send money
    sendMoney,
    isSendingMoney,
  };
};
