import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>
        <Link href="/login">Log in</Link> or <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
