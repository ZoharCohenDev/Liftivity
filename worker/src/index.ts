// Validate env before anything else — crashes early with a clear error if misconfigured.
import "./config/env";
import { Worker } from "bullmq";
import { ANALYSIS_QUEUE_NAME } from "@liftivity/shared-types";
import type { AnalysisJobPayload } from "@liftivity/shared-types";
import { redisConnection } from "./lib/redis";
import { db } from "./lib/db";
import { processAnalysisJob } from "./processors/analysis.processor";

const worker = new Worker<AnalysisJobPayload>(
  ANALYSIS_QUEUE_NAME,
  processAnalysisJob,
  { connection: redisConnection }
);

worker.on("completed", (job) =>
  console.log(`[worker] Job ${job.id} completed — analysisId=${job.data.analysisId}`)
);

// fired after all retry attempts are exhausted
worker.on("failed", async (job, err) => {
  console.error(`[worker] Job ${job?.id} failed — analysisId=${job?.data.analysisId} error="${err.message}"`);

  if (!job?.data.analysisId) return;

  await db.analysis
    .update({
      where: { id: job.data.analysisId },
      data: {
        status: "FAILED",
        errorCode: "WORKER_ERROR",
        // cap at 500 chars to fit the DB column
        errorMessage: err.message.slice(0, 500),
      },
    })
    .catch((dbErr: unknown) =>
      console.error("[worker] Failed to persist FAILED status to DB:", dbErr)
    );
});

console.log(`[worker] Listening for jobs on queue: ${ANALYSIS_QUEUE_NAME}`);

async function shutdown(): Promise<void> {
  console.log("[worker] Shutting down gracefully...");
  await worker.close();
  await db.$disconnect();
  redisConnection.disconnect();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("uncaughtException", (err) => {
  console.error("[worker] Uncaught exception — exiting:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[worker] Unhandled rejection — exiting:", reason);
  process.exit(1);
});
