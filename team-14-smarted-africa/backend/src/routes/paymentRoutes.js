import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { initPayment, verifyPayment, webhook } from '../controllers/paymentController.js';

const router = express.Router();

// User must be logged in
router.post('/init', protect, initPayment);
router.post('/verify', protect, verifyPayment);

// Webhook (Paystack → server, no auth)
router.post('/webhook', express.json({ type: '*/*' }), webhook);

export default router;
