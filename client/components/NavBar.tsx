'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/api';

interface Props {
  isLoggedIn: boolean;
}

export default function NavBar({ isLoggedIn }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.push('/login');
  }

  return (
    <nav style={{ display: 'flex', gap: 16, padding: '12px 24px', borderBottom: '1px solid #eee' }}>
      <Link href="/" style={{ fontWeight: 'bold' }}>Home</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontSize: 'inherit' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
