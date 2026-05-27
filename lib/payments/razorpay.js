import crypto from 'node:crypto';

const RAZORPAY_ORDERS_URL = 'https://api.razorpay.com/v1/orders';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`${name} is not configured`);
  }
  return String(value).trim();
}

export function getRazorpayConfig() {
  const keyId = getRequiredEnv('RAZORPAY_KEY_ID');
  const keySecret = getRequiredEnv('RAZORPAY_KEY_SECRET');
  return { keyId, keySecret };
}

export function getRazorpayWebhookSecret() {
  return getRequiredEnv('RAZORPAY_WEBHOOK_SECRET');
}

export async function createRazorpayOrder({ amountInPaise, receipt, notes = {} }) {
  const { keyId, keySecret } = getRazorpayConfig();
  const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch(RAZORPAY_ORDERS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.description || 'Failed to create payment order';
    throw new Error(message);
  }

  return { order: data, keyId };
}

export function verifyRazorpayPaymentSignature({ orderId, paymentId, signature }) {
  const { keySecret } = getRazorpayConfig();
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (!signature || expected.length !== String(signature).length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function verifyRazorpayWebhookSignature(rawBody, signature) {
  const secret = getRazorpayWebhookSecret();
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (!signature || expected.length !== String(signature).length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
