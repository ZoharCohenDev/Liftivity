import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import * as analysesService from "../services/analyses.service";

// ── Validation schemas ─────────────────────────────────────────────────────

const createSchema = z.object({
  url: z
    .string()
    .min(1, "url is required")
    .url("url must be a valid URL (e.g. https://example.com)"),
});

const idParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

// ── Handlers ───────────────────────────────────────────────────────────────

// POST /api/analyses — requires auth so we can associate the job with a user
export const createAnalysisHandler = {
  preHandler: requireAuth,
  handler: async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid request" },
      });
    }

    const result = await analysesService.createAnalysis(req.userId, parsed.data.url);
    return reply.code(201).send(result);
  },
};

// GET /api/analyses/:id — open endpoint, used for polling job progress
export async function getAnalysisByIdHandler(
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = idParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return reply.code(400).send({
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid id" },
    });
  }

  const analysis = await analysesService.getAnalysisById(parsed.data.id);
  if (!analysis) {
    return reply.code(404).send({
      error: { code: "NOT_FOUND", message: "Analysis not found" },
    });
  }

  return reply.send(analysis);
}
