'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please re-enter them.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
        <div style={{ padding: 24, border: '1px solid #22c55e', borderRadius: 8, background: '#f0fdf4' }}>
          <h2 style={{ margin: '0 0 12px', color: '#15803d' }}>Password changed successfully!</h2>
          <p style={{ margin: '0 0 16px', color: '#166534' }}>
            Your password has been updated. Please make sure to remember and save your new password in a safe place.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ padding: '8px 16px', cursor: 'pointer', background: '#15803d', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14 }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 8 }}>Change your Password</h1>
      <p style={{ marginBottom: 24, color: '#666', fontSize: 14 }}>
        Fill in your current password and choose a new one.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', fontSize: 14, boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ fontSize: 14, fontWeight: 500 }}>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', fontSize: 14, boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', fontSize: 14, boxSizing: 'border-box' }}
          />
        </label>

        {error && <p style={{ color: 'red', margin: 0, fontSize: 14 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 1, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
          >
            {loading ? 'Please wait…' : 'Validate'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 14, background: 'none', border: '1px solid #ccc', borderRadius: 4 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
