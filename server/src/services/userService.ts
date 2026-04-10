import Database from 'better-sqlite3';
import path from 'path';
import { User } from '../types';

const db = new Database(path.join(__dirname, '../../data/users.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export function findByEmail(email: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function findById(id: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export function createUser(user: User): void {
  db.prepare(
    'INSERT INTO users (id, email, passwordHash, createdAt) VALUES (?, ?, ?, ?)'
  ).run(user.id, user.email, user.passwordHash, user.createdAt);
}

export function updatePassword(id: string, newPasswordHash: string): void {
  db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(newPasswordHash, id);
}
