'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EventRegisterClient({ eventId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      setStatus('success');
      setMessage('Successfully registered!');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
          {message}
        </div>
      ) : (
        <>
          {status === 'error' && (
            <div style={{ color: '#e53e3e', fontSize: '0.9rem', marginBottom: '8px' }}>
              {message}
            </div>
          )}
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Register for Event'}
          </button>
        </>
      )}
    </div>
  );
}
