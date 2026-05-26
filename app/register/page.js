'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section section-light">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card">
          <div className="card-header text-center">
            <h2 style={{ marginBottom: '8px' }}>Join the Party</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Register as a member to get your digital ID card</p>
          </div>
          <div className="card-body">
            {error && (
              <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                {error}
              </div>
            )}
            
            {success ? (
              <div className="text-center" style={{ padding: '40px 0' }}>
                <div style={{ fontSize: '48px', color: '#48bb78', marginBottom: '16px' }}>✓</div>
                <h3 style={{ color: '#2f855a' }}>Registration Successful!</h3>
                <p>Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" className="form-input" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="mobile">Mobile Number</label>
                  <input type="tel" id="mobile" name="mobile" className="form-input" pattern="[0-9]{10}" title="10 digit mobile number" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" className="form-input" minLength="6" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="photo">Profile Photo</label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>This will be used for your Digital ID Card</p>
                  <input type="file" id="photo" name="photo" className="form-input" accept="image/*" required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                  {loading ? 'Processing...' : 'Register Now'}
                </button>
              </form>
            )}
            
            <div className="text-center" style={{ marginTop: '24px', fontSize: '0.95rem' }}>
              Already a member? <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
