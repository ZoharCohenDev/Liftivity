import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: env.WEB_URL,
  credentials: true,
});

// Health check — used by Docker and load-balancer probes
app.get("/health", async () => ({ status: "ok", service: "api" }));

const start = async () => {
  await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
};

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
