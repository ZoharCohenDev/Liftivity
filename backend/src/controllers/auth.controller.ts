import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { requireAuth } from "../middleware/auth";

const REFRESH_COOKIE = "refresh_token";
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /auth/register
export async function registerHandler(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid request" },
    });
  }

  try {
    const result = await authService.register(
      parsed.data.email,
      parsed.data.password,
      parsed.data.displayName
    );
    setRefreshCookie(reply, result.refreshToken);
    return reply.code(201).send({ accessToken: result.accessToken, user: result.user });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "EMAIL_TAKEN") {
      return reply.code(409).send({ error: { code: "EMAIL_TAKEN", message: "Email already registered" } });
    }
    throw err;
  }
}

// POST /auth/login
export async function loginHandler(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: { code: "VALIDATION_ERROR", message: "Invalid email or password format" },
    });
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({ accessToken: result.accessToken, user: result.user });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "INVALID_CREDENTIALS") {
      return reply.code(401).send({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
    }
    throw err;
  }
}

// POST /auth/refresh
export async function refreshHandler(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const rawToken = (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE];
  if (!rawToken) {
    return reply.code(401).send({
      error: { code: "MISSING_REFRESH_TOKEN", message: "No refresh token provided" },
    });
  }

  try {
    const result = await authService.refresh(rawToken);
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({ accessToken: result.accessToken });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "INVALID_REFRESH_TOKEN") {
      clearRefreshCookie(reply);
      return reply.code(401).send({
        error: { code: "INVALID_REFRESH_TOKEN", message: "Session expired, please log in again" },
      });
    }
    throw err;
  }
}

// POST /auth/logout
export async function logoutHandler(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const rawToken = (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE];
  if (rawToken) {
    await authService.logout(rawToken).catch(() => {}); // best-effort revocation
  }
  clearRefreshCookie(reply);
  return reply.send({ success: true });
}

// GET /auth/me — protected by requireAuth middleware
export const getMeHandler = {
  preHandler: requireAuth,
  handler: async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = await authService.getMe(req.userId);
    return reply.send({ user });
  },
};

// PATCH /auth/me/password — changes the authenticated user's password
export const changePasswordHandler = {
  preHandler: requireAuth,
  handler: async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid request" },
      });
    }

    try {
      await authService.changePassword(req.userId, parsed.data.currentPassword, parsed.data.newPassword);
      return reply.send({ success: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "INVALID_CREDENTIALS") {
        return reply.code(422).send({
          error: { code: "INVALID_CREDENTIALS", message: "Current password is incorrect" },
        });
      }
      if (code === "NOT_FOUND") {
        return reply.code(404).send({
          error: { code: "NOT_FOUND", message: "User not found" },
        });
      }
      throw err;
    }
  },
};

// DELETE /auth/me — permanently deletes the authenticated user and all their data
export const deleteAccountHandler = {
  preHandler: requireAuth,
  handler: async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await authService.deleteAccount(req.userId);
    clearRefreshCookie(reply);
    return reply.code(204).send();
  },
};

// ── Cookie helpers ──────────────────────────────────────────────────────────

function setRefreshCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/auth", // Only sent to /auth/* routes — limits exposure
  });
}

function clearRefreshCookie(reply: FastifyReply): void {
  reply.clearCookie(REFRESH_COOKIE, { path: "/auth" });
}
