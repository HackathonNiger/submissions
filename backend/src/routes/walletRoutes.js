// backend/src/routes/walletRoutes.js - UPDATED

const express = require('express');
const router = express.Router();

const { 
  getMyWallet,
  verifyBankAccount,
  addBankAccount,
  getBankAccounts
} = require('../controllers/walletController');

const { protect } = require('../middlewares/authMiddleware');

// Apply authentication to all routes
router.use(protect);

// Wallet routes
router.get('/me', getMyWallet);
router.get('/bank-accounts', getBankAccounts);
router.post('/verify-account', verifyBankAccount);
router.post('/add-bank-account', addBankAccount);

module.exports = router;