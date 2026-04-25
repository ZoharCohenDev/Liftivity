import { db } from "../lib/db";
import { enqueueAnalysis } from "../lib/queue";
import type { Analysis } from "@liftivity/shared-types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CreateAnalysisResult {
  analysisId: string;
  status: "PENDING";
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Creates a new analysis job for a given URL, scoped to an authenticated user.
 *
 * Because every Analysis must belong to a Project, this function
 * find-or-creates a Project keyed on (userId, url) before inserting the Analysis.
 * The project name defaults to the URL hostname (e.g. "example.com").
 */
export async function createAnalysis(
  userId: string,
  url: string
): Promise<CreateAnalysisResult> {
  // Find or create a project for this user+url pair
  let project = await db.project.findFirst({ where: { userId, url } });

  if (!project) {
    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      throw Object.assign(new Error("Invalid URL"), { code: "INVALID_URL" });
    }
    project = await db.project.create({
      data: { userId, url, name: hostname },
    });
  }

  const analysis = await db.analysis.create({
    data: {
      projectId: project.id,
      url,
      // status and stage default to PENDING/QUEUED in the schema
    },
  });

  await enqueueAnalysis({
    analysisId: analysis.id,
    projectId: project.id,
    url,
    userId,
  });

  return { analysisId: analysis.id, status: "PENDING" };
}

/**
 * Fetches a single analysis by ID.
 * Returns null when not found (the controller maps this to a 404).
 */
export async function getAnalysisById(id: string): Promise<Analysis | null> {
  const row = await db.analysis.findUnique({ where: { id } });

  if (!row) return null;

  return {
    id: row.id,
    projectId: row.projectId,
    url: row.url,
    status: row.status,
    stage: row.stage,
    progress: row.progress,
    errorCode: row.errorCode ?? null,
    errorMessage: row.errorMessage ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
