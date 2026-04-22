import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });

app.register(cors, { origin: process.env.WEB_URL ?? "*" });

// Health check — used by Docker and load-balancer probes
app.get("/health", async () => ({ status: "ok", service: "api" }));

const start = async () => {
  const port = Number(process.env.API_PORT ?? 3000);
  await app.listen({ port, host: "0.0.0.0" });
};

start();
