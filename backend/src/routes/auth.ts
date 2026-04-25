import type { FastifyInstance } from "fastify";
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  getMeHandler,
} from "../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/register", registerHandler);
  app.post("/auth/login",    loginHandler);
  app.post("/auth/refresh",  refreshHandler);
  app.post("/auth/logout",   logoutHandler);
  app.get( "/auth/me",       getMeHandler);
}
