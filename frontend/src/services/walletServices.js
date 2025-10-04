// frontend/src/services/walletServices.js

import { api } from './api';

/**
 * Get current user's wallet
 */
const getMyWallet = async () => {
  try {
    console.log('💰 Fetching wallet...');
    const response = await api.get('/wallets/me');
    console.log('✅ Wallet fetched');
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch wallet:', error);
    throw error;
  }
};

/**
 * Get wallet transactions
 */
const getWalletTransactions = async (params = {}) => {
  try {
    console.log('📜 Fetching transactions...');
    const response = await api.get('/transactions', params);
    console.log('✅ Transactions fetched');
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch transactions:', error);
    throw error;
  }
};

const walletService = {
  getMyWallet,
  getWalletTransactions
};

export default walletService;