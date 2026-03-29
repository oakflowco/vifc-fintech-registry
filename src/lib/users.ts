import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  subscription: {
    active: boolean;
    expiresAt: string | null;
    momoTransactionId: string | null;
  };
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function readUsers(): User[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export async function createUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = readUsers();
  if (users.find((u) => u.email === email)) return null;

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: uuidv4(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
    subscription: { active: false, expiresAt: null, momoTransactionId: null },
  };

  users.push(user);
  writeUsers(users);
  return user;
}

export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = readUsers();
  return users.find((u) => u.email === email) || null;
}

export async function activateSubscription(
  userId: string,
  momoTransactionId: string
): Promise<boolean> {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  user.subscription = {
    active: true,
    expiresAt: expiresAt.toISOString(),
    momoTransactionId,
  };

  writeUsers(users);
  return true;
}

export async function resetUserPassword(userId: string): Promise<string | null> {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  const newPassword = uuidv4().slice(0, 10);
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  writeUsers(users);
  return newPassword;
}

export function hasActiveSubscription(user: User): boolean {
  if (!user.subscription.active) return false;
  if (!user.subscription.expiresAt) return false;
  return new Date(user.subscription.expiresAt) > new Date();
}
