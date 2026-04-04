'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/lib/api';

interface Props {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await registerUser(email, password);
        router.push('/login?registered=1');
      } else {
        await loginUser(email, password);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: '8px 12px', fontSize: 14 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: '8px 12px', fontSize: 14 }}
      />
      {error && <p style={{ color: 'red', margin: 0, fontSize: 14 }}>{error}</p>}
      <button type="submit" disabled={loading} style={{ padding: '8px 12px', cursor: 'pointer' }}>
        {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}
      </button>
    </form>
  );
}
