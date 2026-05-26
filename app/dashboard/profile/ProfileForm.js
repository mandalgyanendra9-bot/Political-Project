'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ user }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    if (password) formData.append('password', password);
    if (photo) formData.append('photo', photo);

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setStatus('success');
      router.refresh();
    } else {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {status === 'success' && <p style={{ color: 'green' }}>Profile updated successfully.</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Failed to update profile.</p>}
      <label>Name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} required />

      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

      <label>Mobile</label>
      <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required />

      <label>Password (leave blank to keep unchanged)</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <label>Profile Photo</label>
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />

      <button className="btn btn-primary" type="submit">Save Changes</button>
    </form>
  );
}
