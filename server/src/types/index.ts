import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
