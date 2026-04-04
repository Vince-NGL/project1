import { cookies } from 'next/headers';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'User Login',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!cookies().get('token');

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <NavBar isLoggedIn={isLoggedIn} />
        <main style={{ padding: '24px' }}>{children}</main>
      </body>
    </html>
  );
}
