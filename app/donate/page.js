'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import Link from 'next/link';

export default function Donate() {
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [upiId, setUpiId] = useState('pdparty@upi');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalAmount = amount === 'custom' ? customAmount : amount;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!finalAmount || Number.isNaN(Number(finalAmount)) || Number(finalAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Donation failed');
      }
      setSuccess(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          <div className="card text-center" style={{ padding: '40px' }}>
            <h2 style={{ color: 'var(--primary-color)' }}>Thank You for Your Donation</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              We have received your contribution of Rs {finalAmount}.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                Donate Again
              </button>
              <Link href="/dashboard/donations" className="btn btn-outline">
                View Donation History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center" style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Support the Party</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Contribute online using UPI or direct donation flow. Every contribution helps public outreach programs.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '16px' }}>UPI / QR Payment</h3>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '14px', textAlign: 'center' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=PDP%20Donation`}
                  alt="UPI QR Code"
                  style={{ width: '220px', height: '220px', margin: '0 auto 12px auto' }}
                />
                <p style={{ marginBottom: '8px' }}>Scan and pay via any UPI app</p>
                <p style={{ fontFamily: 'monospace', margin: 0 }}>{upiId}</p>
              </div>
              <label className="form-label" htmlFor="upiId">UPI ID (for testing/demo)</label>
              <input
                id="upiId"
                className="form-input"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '16px' }}>Online Donation</h3>
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
                  {loading ? 'Processing...' : `Donate Rs ${finalAmount || 0}`}
                </button>
              </form>
              <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                This MVP records donations and transaction references in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
