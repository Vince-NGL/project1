import AuthForm from '@/components/AuthForm';

export default function LoginPage({ searchParams }: { searchParams: { registered?: string } }) {
  return (
    <div>
      <h1>Log in</h1>
      {searchParams.registered && (
        <p style={{ color: 'green' }}>Account created! Please log in.</p>
      )}
      <AuthForm mode="login" />
      <p style={{ marginTop: 12, fontSize: 14 }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
