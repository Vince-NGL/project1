import { cookies } from 'next/headers';

async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch('http://localhost:4000/api/auth/me', {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json() as { user: { userId: string; email: string } };
    return data.user;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>Bonjour {user.email}</p>
      ) : (
        <p>Could not load user info.</p>
      )}
    </div>
  );
}
