import type { Job } from "bullmq";
import type { AnalysisJobPayload } from "@liftivity/shared-types";
import { db } from "../lib/db";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Processes a single analysis job through a simulated pipeline.
 *
 * Status lifecycle: PENDING → RUNNING → COMPLETED
 * Stage lifecycle:  QUEUED  → COLLECTOR → ANALYZER → COMPLETED
 * Progress:         0       → 25        → 75       → 100
 *
 * Real NLP/CV/scoring calls will replace the sleep() stubs in a future phase.
 */
export async function processAnalysisJob(job: Job<AnalysisJobPayload>): Promise<void> {
  const { analysisId, url } = job.data;

  console.log(`[worker] Job ${job.id} started — analysisId=${analysisId} url=${url}`);

  // ── RUNNING / COLLECTOR ─────────────────────────────────────────────────
  await db.analysis.update({
    where: { id: analysisId },
    data: { status: "RUNNING", stage: "COLLECTOR", progress: 25 },
  });
  console.log(`[worker] analysisId=${analysisId} status=RUNNING stage=COLLECTOR progress=25`);

  // Simulate collector work (page scraping / screenshot capture)
  await sleep(500);

  // ── ANALYZER ────────────────────────────────────────────────────────────
  await db.analysis.update({
    where: { id: analysisId },
    data: { stage: "ANALYZER", progress: 75 },
  });
  console.log(`[worker] analysisId=${analysisId} stage=ANALYZER progress=75`);

  // Simulate analyzer work (feature extraction)
  await sleep(500);

  // ── COMPLETED ───────────────────────────────────────────────────────────
  await db.analysis.update({
    where: { id: analysisId },
    data: { status: "COMPLETED", stage: "COMPLETED", progress: 100 },
  });

  // Write a placeholder result row so consumers always get a non-null result on COMPLETED.
  // Real scores and features will replace these zeros once the ML pipeline is wired in.
  await db.analysisResult.create({
    data: {
      analysisId,
      overallScore: 0,
      categoryScores: {},
      rawFeatures: {},
      insights: [],
    },
  });

  console.log(`[worker] analysisId=${analysisId} status=COMPLETED progress=100`);
}
