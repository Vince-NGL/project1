import fs from 'fs';
import path from 'path';
import { User } from '../types';

const DATA_FILE = path.join(__dirname, '../../data/users.json');

function readUsers(): User[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as User[];
}

function writeUsers(users: User[]): void {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2), 'utf-8');
  fs.renameSync(tmp, DATA_FILE);
}

export function findByEmail(email: string): User | undefined {
  return readUsers().find((u) => u.email === email);
}

export function createUser(user: User): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}
