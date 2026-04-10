const BASE = '/api/auth';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? 'Request failed');
  }

  return data as T;
}

export function registerUser(email: string, password: string) {
  return request<{ message: string }>('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function loginUser(email: string, password: string) {
  return request<{ user: { id: string; email: string } }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logoutUser() {
  return request<{ message: string }>('/logout', { method: 'POST' });
}

export function getMe() {
  return request<{ user: { userId: string; email: string } }>('/me');
}

export function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  return request<{ message: string }>('/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
}
