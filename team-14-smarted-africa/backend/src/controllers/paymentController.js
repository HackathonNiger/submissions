/**
 * backend/src/controllers/paymentController.js
 */

import * as paymentService from '../services/paymentService.js';
import * as api from '../utils/apiResponse.js';

// ----------------------------
// Initialize Payment
// ----------------------------
export const initPayment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const email = req.user.email; // from auth middleware
    const studentId = req.user._id;

    const session = await paymentService.initializePayment({
      studentId,
      courseId,
      amount,
      email
    });

    return api.success(res, session, 'Payment session created');
  } catch (err) {
    console.error(err);
    return api.serverError(res, err.message);
  }
};

// ----------------------------
// Verify Payment
// ----------------------------
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    const enrollment = await paymentService.verifyPayment(reference);
    return api.success(res, enrollment, 'Payment verified');
  } catch (err) {
    console.error(err);
    return api.fail(res, err.message, null, 400);
  }
};

// ----------------------------
// Webhook (Paystack → server)
// ----------------------------
export const webhook = async (req, res) => {
  try {
    await paymentService.handleWebhook(req.headers, req.body);
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).send('Invalid webhook');
  }
};
