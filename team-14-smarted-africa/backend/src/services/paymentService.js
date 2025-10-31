/**
 * backend/src/services/paymentService.js
 * - Active integration: Paystack
 * - Stripe left as commented-out example
 *
 * Flow:
 *  - initializePayment: creates Enrollment row + calls Paystack initialize API
 *  - verifyPayment: verifies transaction with Paystack + updates enrollment
 *
 * Env:
 *  - PAYSTACK_SECRET
 *  - PAYSTACK_PUBLIC
 */

import axios from 'axios';
import crypto from 'crypto';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import env from '../config/env.js';

const PAYSTACK_BASE = 'https://api.paystack.co';

// ----------------------------
// Initialize Payment
// ----------------------------
export async function initializePayment({ studentId, courseId, amount, email }) {
  // Create enrollment (status pending)
  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    amount,
    currency: 'NGN',
    provider: 'paystack',
    status: 'pending'
  });

  // Call Paystack initialize
  const res = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      amount: Math.round(amount * 100), // kobo
      email,
      metadata: { enrollmentId: enrollment._id.toString() }
    },
    { headers: { Authorization: `Bearer ${env.paystackSecret}` } }
  );

  const { authorization_url, reference } = res.data.data;

  return {
    enrollmentId: enrollment._id,
    paymentUrl: authorization_url,
    reference
  };
}

// ----------------------------
// Verify Payment
// ----------------------------
export async function verifyPayment(reference) {
  const res = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${env.paystackSecret}` } }
  );

  const data = res.data.data;
  const enrollmentId = data.metadata?.enrollmentId;

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');

  if (data.status === 'success') {
    enrollment.status = 'active';
    enrollment.providerPaymentId = data.reference;
    await enrollment.save();

    // Add course to user if not already
    const user = await User.findById(enrollment.student);
    if (user && !user.enrolledCourses.includes(enrollment.course)) {
      user.enrolledCourses.push(enrollment.course);
      await user.save();
    }
  }

  return enrollment;
}

// ----------------------------
// Handle Webhook (optional)
// ----------------------------
export async function handleWebhook(headers, body) {
  const signature = headers['x-paystack-signature'];
  const computed = crypto
    .createHmac('sha512', env.paystackSecret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (signature !== computed) throw new Error('Invalid signature');

  const event = body.event;
  if (event === 'charge.success') {
    return verifyPayment(body.data.reference);
  }
  return null;
}

/* Stripe example (commented-out)
import Stripe from 'stripe';
const stripe = new Stripe(env.stripeSecret);

export async function initializeStripePayment(...) { }
export async function verifyStripePayment(...) { }
*/
