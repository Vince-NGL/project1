import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { findByEmail, findById, createUser, updatePassword } from '../services/userService';
import { AuthRequest } from '../types';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ error: 'Password must contain at least one letter and one number' });
    return;
  }

  if (findByEmail(email)) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  createUser({ id: uuidv4(), email, passwordHash, createdAt: new Date().toISOString() });

  res.status(201).json({ message: 'Registered successfully' });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = findByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: { id: user.id, email: user.email } });
}

export function logout(_req: Request, res: Response): void {
  res.cookie('token', '', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ message: 'Logged out' });
}

export function me(req: AuthRequest, res: Response): void {
  res.json({ user: req.user });
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  const { currentPassword, newPassword, confirmPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: 'New passwords do not match' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }

  if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    res.status(400).json({ error: 'Password must contain at least one letter and one number' });
    return;
  }

  const user = findById(req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  updatePassword(user.id, newPasswordHash);

  res.json({ message: 'Password changed successfully' });
}
