import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import { signAccessToken, generateRefreshToken, hashRefreshToken } from "../lib/tokens";
import type { User } from "@liftivity/shared-types";

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_DAYS = 7;

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw Object.assign(new Error("Email already registered"), { code: "EMAIL_TAKEN" });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const dbUser = await db.user.create({ data: { email, displayName, passwordHash } });
  return issueTokens(dbUser);
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const dbUser = await db.user.findUnique({ where: { email } });

  // Always run compare to avoid timing-based user enumeration
  const hash = dbUser?.passwordHash ?? "$2a$12$invalidhashpadding000000000000000000000000000000000000";
  const valid = await bcrypt.compare(password, hash);

  if (!dbUser || !valid) {
    throw Object.assign(new Error("Invalid credentials"), { code: "INVALID_CREDENTIALS" });
  }

  return issueTokens(dbUser);
}

export async function refresh(rawToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const tokenHash = hashRefreshToken(rawToken);

  const stored = await db.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  if (!stored) {
    throw Object.assign(new Error("Invalid or expired refresh token"), { code: "INVALID_REFRESH_TOKEN" });
  }

  // Rotate: revoke the old token and issue a new one
  await db.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

  const newRefreshToken = generateRefreshToken();
  await db.refreshToken.create({
    data: {
      userId: stored.userId,
      tokenHash: hashRefreshToken(newRefreshToken),
      expiresAt: refreshExpiry(),
    },
  });

  const accessToken = signAccessToken({ sub: stored.userId, email: stored.user.email });
  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(rawToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(rawToken);
  await db.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getMe(userId: string): Promise<User> {
  const dbUser = await db.user.findUnique({ where: { id: userId } });
  if (!dbUser) {
    throw Object.assign(new Error("User not found"), { code: "NOT_FOUND" });
  }
  return toPublicUser(dbUser);
}

export async function deleteAccount(userId: string): Promise<void> {
  // Cascade in schema handles RefreshTokens → Projects → Analyses → AnalysisResults.
  await db.user.delete({ where: { id: userId } });
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const dbUser = await db.user.findUnique({ where: { id: userId } });
  if (!dbUser) {
    throw Object.assign(new Error("User not found"), { code: "NOT_FOUND" });
  }

  const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!valid) {
    throw Object.assign(new Error("Current password is incorrect"), { code: "INVALID_CREDENTIALS" });
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  // Handle the race condition where the user is deleted between the findUnique and this update.
  try {
    await db.user.update({ where: { id: userId }, data: { passwordHash } });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2025") {
      throw Object.assign(new Error("User not found"), { code: "NOT_FOUND" });
    }
    throw err;
  }

  // Revoke all active sessions so compromised tokens can't be used after a password change.
  await db.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function issueTokens(dbUser: {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}): Promise<AuthResult> {
  const refreshToken = generateRefreshToken();

  await db.refreshToken.create({
    data: {
      userId: dbUser.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: refreshExpiry(),
    },
  });

  const accessToken = signAccessToken({ sub: dbUser.id, email: dbUser.email });
  return { accessToken, refreshToken, user: toPublicUser(dbUser) };
}

function toPublicUser(dbUser: {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    displayName: dbUser.displayName,
    createdAt: dbUser.createdAt.toISOString(),
    updatedAt: dbUser.updatedAt.toISOString(),
  };
}

function refreshExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return d;
}
