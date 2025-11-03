// backend/src/controllers/paymentController.js

// ------------------------------------
// Payment Controller
// ------------------------------------
// Handles payment session creation, webhook listening,
// and retrieving payment records for users and admins.
// Stripe code is included but commented out for later use.
// ------------------------------------

const Payment = require('../models/Payment.js'); // Payment model
const logger = require('../utils/logger.js');    // Logger utility

// Uncomment if you want real Stripe integration later
// const Stripe = require('stripe');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc   Create checkout session (pseudo or Stripe)
 * @route  POST /api/payments/checkout
 * @access Private (user)
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, currency = 'usd', description = 'SmartEd Payment' } = req.body;

    // --------------------------
    // FAKE / PSEUDO PAYMENT FLOW
    // --------------------------
    // Instead of calling Stripe, we simulate success.
    const fakePayment = await Payment.create({
      user: userId,
      amount,
      currency,
      description,
      status: 'pending', // will be updated later
      provider: 'pseudo',
      providerSessionId: `session_${Date.now()}`, // mock session id
    });

    logger.info('Payment session created (pseudo)', fakePayment.id);

    return res.json({
      success: true,
      message: 'Payment session created (pseudo)',
      sessionId: fakePayment.providerSessionId,
    });

    // ----------------------------------
    // REAL STRIPE IMPLEMENTATION (later)
    // ----------------------------------
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: { name: description },
          unit_amount: amount * 100, // amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: req.user.email,
    });

    await Payment.create({
      user: userId,
      amount,
      currency,
      description,
      status: 'pending',
      provider: 'stripe',
      providerSessionId: session.id,
    });

    res.json({ success: true, url: session.url });
    */
  } catch (err) {
    logger.error('createCheckoutSession failed', err.message);
    res.status(500).json({ success: false, error: 'Payment session failed' });
  }
};

/**
 * @desc   Handle payment webhooks (pseudo / Stripe)
 * @route  POST /api/payments/webhook
 * @access Public (Stripe calls this endpoint)
 */
exports.handleWebhook = async (req, res) => {
  try {
    // --------------------------
    // PSEUDO FLOW: auto mark paid
    // --------------------------
    const { sessionId } = req.body; // e.g., "session_123"
    const payment = await Payment.findOne({ providerSessionId: sessionId });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    payment.status = 'paid';
    await payment.save();

    logger.info('Payment marked as paid (pseudo)', payment.id);
    return res.json({ success: true });

    // --------------------------
    // REAL STRIPE FLOW (later)
    // --------------------------
    /*
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      logger.error('Webhook signature verification failed', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const payment = await Payment.findOne({ providerSessionId: session.id });
      if (payment) {
        payment.status = 'paid';
        await payment.save();
        logger.info('Stripe payment completed', session.id);
      }
    }

    res.json({ received: true });
    */
  } catch (err) {
    logger.error('handleWebhook failed', err.message);
    res.status(500).json({ success: false, error: 'Webhook handling failed' });
  }
};

/**
 * @desc   Get current user's payments
 * @route  GET /api/payments/my
 * @access Private (user)
 */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    logger.error('getUserPayments failed', err.message);
    res.status(500).json({ success: false, error: 'Cannot fetch payments' });
  }
};

/**
 * @desc   Get all payments (admin only)
 * @route  GET /api/payments
 * @access Private (admin)
 */
exports.adminGetAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    logger.error('adminGetAllPayments failed', err.message);
    res.status(500).json({ success: false, error: 'Cannot fetch payments' });
  }
};
