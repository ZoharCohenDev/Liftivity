import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "../lib/tokens";

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

  try {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
  } catch {
    return reply.code(401).send({
      error: { code: "TOKEN_EXPIRED", message: "Access token expired or invalid" },
    });
  }
}
