import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <div>
      <h1>Create account</h1>
      <AuthForm mode="register" />
      <p style={{ marginTop: 12, fontSize: 14 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
