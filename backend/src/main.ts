import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { env } from "./config/env";
import { authRoutes } from "./routes/auth";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: env.WEB_URL,
  credentials: true,
});

// Cookie parser — required for httpOnly refresh token handling
app.register(cookie);

// Health check — used by Docker and load-balancer probes
app.get("/health", async () => ({ status: "ok", service: "api" }));

// Auth routes: /auth/register, /auth/login, /auth/refresh, /auth/logout, /auth/me
app.register(authRoutes);

const start = async () => {
  await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
};

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
