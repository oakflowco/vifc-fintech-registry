import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";

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

// Lazy init — won't crash at build time if env vars missing
let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

// Keys:
//   user:{id}           → User JSON
//   user:email:{email}  → userId (lookup index)

export async function createUser(
  email: string,
  password: string
): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;

  // Check if email already registered
  const existing = await redis.get<string>(`user:email:${email}`);
  if (existing) return null;

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: uuidv4(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
    subscription: { active: false, expiresAt: null, momoTransactionId: null },
  };

  await redis.set(`user:${user.id}`, JSON.stringify(user));
  await redis.set(`user:email:${email}`, user.id);

  return user;
}

export async function verifyUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get<string>(`user:${id}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : (data as unknown as User);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;
  const userId = await redis.get<string>(`user:email:${email}`);
  if (!userId) return null;
  return getUserById(userId);
}

export async function activateSubscription(
  userId: string,
  momoTransactionId: string
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  const user = await getUserById(userId);
  if (!user) return false;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  user.subscription = {
    active: true,
    expiresAt: expiresAt.toISOString(),
    momoTransactionId,
  };

  await redis.set(`user:${userId}`, JSON.stringify(user));
  return true;
}

export async function resetUserPassword(userId: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;

  const user = await getUserById(userId);
  if (!user) return null;

  const newPassword = uuidv4().slice(0, 10);
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await redis.set(`user:${userId}`, JSON.stringify(user));
  return newPassword;
}

export function hasActiveSubscription(user: User): boolean {
  if (!user.subscription.active) return false;
  if (!user.subscription.expiresAt) return false;
  return new Date(user.subscription.expiresAt) > new Date();
}

export async function deleteUser(
  userId: string,
  email: string
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.del(`user:${userId}`);
  await redis.del(`user:email:${email.toLowerCase()}`);
}
