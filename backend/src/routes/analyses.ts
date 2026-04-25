import type { FastifyInstance } from "fastify";
import {
  createAnalysisHandler,
  getAnalysisByIdHandler,
} from "../controllers/analyses.controller";

export async function analysesRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/analyses",     createAnalysisHandler);
  app.get( "/api/analyses/:id", getAnalysisByIdHandler);
}
