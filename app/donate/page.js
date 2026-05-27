'use client';
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react';
import Link from 'next/link';

let razorpayScriptPromise;

function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export default function Donate() {
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [upiId, setUpiId] = useState('unchiawaajparty@upi');
  const [loading, setLoading] = useState(false);
  const [paymentState, setPaymentState] = useState({ status: 'IDLE', message: '' });
  const [successAmount, setSuccessAmount] = useState(null);

  const finalAmount = useMemo(() => (amount === 'custom' ? customAmount : amount), [amount, customAmount]);

  async function handleFailure(orderId, reason) {
    try {
      await fetch('/api/payments/online/failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason }),
      });
    } catch {
      // Best effort only
    }
  }

  async function handlePayment(event) {
    event.preventDefault();

    const numericAmount = Number(finalAmount);
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setPaymentState({ status: 'FAILED', message: 'Please enter a valid amount.' });
      return;
    }

    setLoading(true);
    setPaymentState({ status: 'PENDING', message: 'Creating secure payment order...' });

    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded || !window.Razorpay) {
        throw new Error('Unable to load payment gateway. Please try again.');
      }

      const orderData = await parseJson(
        await fetch('/api/payments/online/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: numericAmount }),
        })
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Unchi Awaaj Party',
        description: 'Verified online donation',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            setPaymentState({ status: 'PENDING', message: 'Verifying payment confirmation...' });

            await parseJson(
              await fetch('/api/payments/online/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              })
            );

            setSuccessAmount(numericAmount);
            setPaymentState({
              status: 'SUCCESS',
              message: 'Payment verified and donation recorded successfully.',
            });
          } catch (verifyError) {
            await handleFailure(orderData.orderId, verifyError.message || 'Verification failed');
            setPaymentState({
              status: 'FAILED',
              message: verifyError.message || 'Payment verification failed. Donation not recorded.',
            });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await handleFailure(orderData.orderId, 'Payment cancelled by user');
            setPaymentState({
              status: 'FAILED',
              message: 'Payment cancelled. Donation was not recorded.',
            });
            setLoading(false);
          },
        },
        theme: {
          color: '#1a365d',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async (response) => {
        const reason = response?.error?.description || response?.error?.reason || 'Payment failed';
        await handleFailure(orderData.orderId, reason);
        setPaymentState({ status: 'FAILED', message: `${reason}. Donation was not recorded.` });
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      setPaymentState({ status: 'FAILED', message: error.message || 'Payment initiation failed.' });
      setLoading(false);
    }
  }

  const isSuccess = paymentState.status === 'SUCCESS';

  return (
    <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        <div className="text-center" style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Support the Party</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Online donations are now recorded only after verified payment success. Manual UPI/QR donations remain separate.
          </p>
        </div>

        {paymentState.status !== 'IDLE' && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor:
                paymentState.status === 'SUCCESS'
                  ? '#c6f6d5'
                  : paymentState.status === 'PENDING'
                    ? '#ebf8ff'
                    : '#fed7d7',
              color:
                paymentState.status === 'SUCCESS'
                  ? '#22543d'
                  : paymentState.status === 'PENDING'
                    ? '#2a4365'
                    : '#9b2c2c',
            }}
          >
            <strong>Status: {paymentState.status}</strong>
            <div>{paymentState.message}</div>
          </div>
        )}

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '16px' }}>UPI / QR (Manual Donation)</h3>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '14px', textAlign: 'center' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=Unchi%20Awaaj%20Party`}
                  alt="UPI QR Code"
                  style={{ width: '220px', height: '220px', margin: '0 auto 12px auto' }}
                />
                <p style={{ marginBottom: '8px' }}>Scan and pay via any UPI app</p>
                <p style={{ fontFamily: 'monospace', margin: 0 }}>{upiId}</p>
              </div>
              <label className="form-label" htmlFor="upiId">UPI ID (for display)</label>
              <input
                id="upiId"
                className="form-input"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Manual donations are not auto-verified or auto-recorded in online donation history.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '16px' }}>Verified Online Donation</h3>
              <form onSubmit={handlePayment}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginBottom: '14px' }}>
                  {['500', '1000', '2500', '5000'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setAmount(val)}
                      style={{
                        borderColor: amount === val ? 'var(--primary-color)' : 'var(--border-color)',
                        backgroundColor: amount === val ? 'rgba(26, 54, 93, 0.08)' : 'white',
                      }}
                    >
                      Rs {val}
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setAmount('custom')} style={{ width: '100%' }}>
                    Custom Amount
                  </button>
                </div>

                {amount === 'custom' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="customAmount">Enter amount</label>
                    <input
                      id="customAmount"
                      type="number"
                      min="1"
                      className="form-input"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Processing...' : `Pay Rs ${finalAmount || 0}`}
                </button>
              </form>

              {isSuccess && (
                <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href="/dashboard/donations" className="btn btn-outline">
                    View Verified Donation History
                  </Link>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setPaymentState({ status: 'IDLE', message: '' });
                      setSuccessAmount(null);
                    }}
                  >
                    Donate Again
                  </button>
                </div>
              )}

              {successAmount && (
                <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Verified contribution recorded: Rs {successAmount}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
