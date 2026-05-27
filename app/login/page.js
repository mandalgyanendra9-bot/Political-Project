'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('registered') === 'true';
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const destination = data?.user?.role === 'ADMIN' ? '/admin' : '/dashboard';
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card">
          <div className="card-header text-center">
            <h2 style={{ marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Login to access your member dashboard</p>
          </div>
          <div className="card-body">
            {registered && (
              <div style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                Registration successful! Please log in.
              </div>
            )}
            
            {error && (
              <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="text-center" style={{ marginTop: '24px', fontSize: '0.95rem' }}>
              Not a member yet? <Link href="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Join the Party</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
