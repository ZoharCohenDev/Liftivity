import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "../lib/tokens";
import { db } from "../lib/db";

// Augments FastifyRequest so downstream handlers can read userId/userEmail
// without re-decoding the token.
declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    userEmail: string;
  }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.code(401).send({
      error: { code: "UNAUTHORIZED", message: "Missing access token" },
    });
  }

  let payload: ReturnType<typeof verifyAccessToken>;
  try {
    payload = verifyAccessToken(authHeader.slice(7));
  } catch {
    return reply.code(401).send({
      error: { code: "TOKEN_EXPIRED", message: "Access token expired or invalid" },
    });
  }

  // Confirm the account still exists — catches deleted-user tokens within their TTL window.
  const user = await db.user.findUnique({ where: { id: payload.sub }, select: { id: true } });
  if (!user) {
    return reply.code(401).send({
      error: { code: "UNAUTHORIZED", message: "Account no longer exists" },
    });
  }

  req.userId = payload.sub;
  req.userEmail = payload.email;
}
